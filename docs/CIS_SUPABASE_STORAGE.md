# CIS Supabase Storage Configuration

## Storage Bucket: `cis_assets`

The Creative Intelligence Studio uses a dedicated Supabase storage bucket called `cis_assets` for all generated creative assets.

### Setup

The storage bucket is created automatically via the migration file:
- **Migration**: `supabase/migrations/20251117_cis.sql`
- **Bucket Name**: `cis_assets`
- **Public Access**: `false` (private bucket)

### Storage Policies

The following RLS policies are applied:

1. **Upload Policy**: Users can upload assets to their own folder
   - Path pattern: `{userId}/*`
   - Users can only upload to folders matching their user ID

2. **View Policy**: Users can view their own assets
   - Path pattern: `{userId}/*`
   - Users can only view assets in their own folder

3. **Update Policy**: Users can update their own assets
   - Path pattern: `{userId}/*`

4. **Delete Policy**: Users can delete their own assets
   - Path pattern: `{userId}/*`

### Folder Structure

Assets are organized by user ID and project type:

```
cis_assets/
  ├── {userId}/
  │   ├── cover-art/
  │   │   ├── {projectId}/
  │   │   │   ├── cover-art-v1.jpg
  │   │   │   ├── cover-art-v2.jpg
  │   │   │   └── palette.json
  │   ├── moodboards/
  │   │   └── {projectId}/
  │   │       ├── moodboard.pdf
  │   │       └── images/
  │   ├── brand-kits/
  │   │   └── {projectId}/
  │   │       ├── brand-kit.pdf
  │   │       ├── logo.png
  │   │       └── palettes/
  │   └── exports/
  │       └── {projectId}/
  │           └── bundle.zip
```

### Usage Example

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Upload a cover art image
async function uploadCoverArt(
  userId: string,
  projectId: string,
  file: File
) {
  const path = `${userId}/cover-art/${projectId}/cover-art.jpg`;

  const { data, error } = await supabase.storage
    .from('cis_assets')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL (signed URL since bucket is private)
  const { data: urlData } = await supabase.storage
    .from('cis_assets')
    .createSignedUrl(path, 60 * 60); // 1 hour expiry

  return urlData?.signedUrl;
}

// Download an asset
async function downloadAsset(
  userId: string,
  path: string
) {
  const { data, error } = await supabase.storage
    .from('cis_assets')
    .download(`${userId}/${path}`);

  if (error) {
    throw error;
  }

  return data;
}
```

### File Size Limits

- **Individual File**: 50MB (Supabase default)
- **Total Storage**: Based on Supabase plan

### CORS Configuration

If accessing from the browser, ensure CORS is configured in Supabase Dashboard:
- Allowed Origins: Your app domains
- Allowed Methods: GET, POST, PUT, DELETE

### Manual Setup (if needed)

If the migration doesn't auto-create the bucket:

1. Go to Supabase Dashboard → Storage
2. Create new bucket: `cis_assets`
3. Set public: `false`
4. Apply the RLS policies from the migration file

### Next Steps

- Implement file upload UI components
- Add progress indicators for large uploads
- Implement thumbnail generation for images
- Add file type validation
- Set up CDN caching for frequently accessed assets
