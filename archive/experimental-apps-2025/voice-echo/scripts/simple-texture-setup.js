const fs = require('fs');
const path = require('path');

// Create texture manifest and organize files
function setupTextures() {
  const publicDir = path.join(__dirname, '../public');
  const texturesDir = path.join(publicDir, 'textures');

  // Create textures directory if it doesn't exist
  if (!fs.existsSync(texturesDir)) {
    fs.mkdirSync(texturesDir, { recursive: true });
  }

  // Get all texture files from public directory
  const allFiles = fs.readdirSync(publicDir);
  const textureFiles = allFiles.filter(
    file => file.includes('DRS_MagazineTexture') || file.includes('DRS_4K_Luma')
  );

  console.log(`Found ${textureFiles.length} texture files...`);

  // Copy files to textures directory if they're not already there
  textureFiles.forEach(file => {
    const sourcePath = path.join(publicDir, file);
    const destPath = path.join(texturesDir, file);

    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✓ Copied ${file} to textures directory`);
    }
  });

  // Create texture manifest
  const manifest = {
    textures: {
      paper: textureFiles
        .filter(f => f.includes('DRS_MagazineTexture') && !f.includes('8K_5'))
        .map(f => `/textures/${f}`)
        .slice(0, 5), // Take first 5 paper textures
      grain: textureFiles
        .filter(f => f.includes('DRS_MagazineTexture') && f.includes('8K_5'))
        .map(f => `/textures/${f}`)
        .slice(0, 4), // Take first 4 grain textures
      luma: textureFiles
        .filter(f => f.includes('DRS_4K_Luma'))
        .map(f => `/textures/${f}`)
        .slice(0, 5), // Take first 5 luma textures
    },
    fileSizes: {},
    lastUpdated: new Date().toISOString(),
  };

  // Calculate file sizes
  textureFiles.forEach(file => {
    const filePath = path.join(texturesDir, file);
    const stats = fs.statSync(filePath);
    manifest.fileSizes[file] = {
      size: stats.size,
      sizeMB: (stats.size / 1024 / 1024).toFixed(2),
    };
  });

  // Write manifest
  const manifestPath = path.join(texturesDir, 'texture-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\nTexture manifest created: ${manifestPath}`);
  console.log(`\nTexture organization complete!`);
  console.log(`\nFile sizes:`);

  Object.entries(manifest.fileSizes).forEach(([file, info]) => {
    console.log(`  ${file}: ${info.sizeMB}MB`);
  });

  console.log(`\nTotal textures available:`);
  console.log(`  Paper textures: ${manifest.textures.paper.length}`);
  console.log(`  Grain textures: ${manifest.textures.grain.length}`);
  console.log(`  Luma textures: ${manifest.textures.luma.length}`);

  // Create usage examples
  createUsageExamples(manifest);
}

function createUsageExamples(manifest) {
  const examplesPath = path.join(__dirname, '../docs/texture-examples.md');

  const examples = `# Texture Usage Examples

## Available Textures

### Paper Textures (${manifest.textures.paper.length} available)
${manifest.textures.paper
  .map((texture, i) => `- \`texture-paper-${i + 1}\`: ${texture.split('/').pop()}`)
  .join('\n')}

### Grain Textures (${manifest.textures.grain.length} available)
${manifest.textures.grain
  .map((texture, i) => `- \`texture-grain-${i + 1}\`: ${texture.split('/').pop()}`)
  .join('\n')}

### Luma Textures (${manifest.textures.luma.length} available)
${manifest.textures.luma
  .map((texture, i) => `- \`texture-luma-${i + 1}\`: ${texture.split('/').pop()}`)
  .join('\n')}

## Usage Examples

### Hero Section with Paper Texture
\`\`\`tsx
<TextureBackground 
  textureType="paper" 
  textureVariant={1} 
  blendMode="overlay" 
  opacity={0.08}
  className="py-20 px-4"
>
  <div className="max-w-7xl mx-auto">
    <h1 className="text-6xl font-black">Audio Intel</h1>
    <p className="text-2xl font-bold">Transform your music promotion</p>
  </div>
</TextureBackground>
\`\`\`

### Pricing Cards with Rotations
\`\`\`tsx
<div className="grid lg:grid-cols-3 gap-8">
  <TextureCard 
    textureType="paper" 
    textureVariant={1} 
    rotation={-1} 
    className="p-8"
  >
    <h3>Starter</h3>
    <div className="text-4xl font-black">£19/mo</div>
  </TextureCard>
  
  <TextureCard 
    textureType="paper" 
    textureVariant={2} 
    rotation={1} 
    className="p-8"
  >
    <h3>Professional</h3>
    <div className="text-4xl font-black">£39/mo</div>
  </TextureCard>
  
  <TextureCard 
    textureType="paper" 
    textureVariant={3} 
    rotation={-0.5} 
    className="p-8"
  >
    <h3>Agency</h3>
    <div className="text-4xl font-black">£79/mo</div>
  </TextureCard>
</div>
\`\`\`

### Interactive Button with Grain Texture
\`\`\`tsx
<TextureOverlay 
  textureType="grain" 
  textureVariant={2} 
  blendMode="multiply" 
  opacity={0.1}
>
  <Button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:scale-105 transition-all">
    Get Started
  </Button>
</TextureOverlay>
\`\`\`

### Stats Cards with Floating Animation
\`\`\`tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
  <TextureCard 
    textureType="grain" 
    textureVariant={1} 
    rotation={-0.5} 
    floating={true} 
    className="p-10 text-center texture-delay-100"
  >
    <div className="text-6xl font-black">517+</div>
    <div className="text-2xl font-black">Contacts Enriched</div>
  </TextureCard>
  
  <TextureCard 
    textureType="grain" 
    textureVariant={2} 
    rotation={0.5} 
    floating={true} 
    className="p-10 text-center texture-delay-200"
  >
    <div className="text-6xl font-black">210+</div>
    <div className="text-2xl font-black">Radio Stations</div>
  </TextureCard>
</div>
\`\`\`

## Performance Notes

- Total texture files: ${Object.keys(manifest.fileSizes).length}
- Total size: ${(
    Object.values(manifest.fileSizes).reduce((sum, info) => sum + info.size, 0) /
    1024 /
    1024
  ).toFixed(2)}MB
- Consider lazy loading for textures below the fold
- Use WebP conversion for production (requires ImageMagick)

## Next Steps

1. Test the textures in development
2. Optimize file sizes for production
3. Consider implementing lazy loading
4. Add texture preloading for critical sections
`;

  fs.writeFileSync(examplesPath, examples);
  console.log(`\nUsage examples created: ${examplesPath}`);
}

// Run setup
if (require.main === module) {
  setupTextures();
}

module.exports = { setupTextures };
