import { NextResponse } from 'next/server';
import { getSupabaseSession } from '@/lib/supabase/auth-helpers';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const session = await getSupabaseSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const userId = (session.user as any).email || 'demo-user';

    // Fetch contacts from Audio Intel database (intel_contacts table)
    const { data: intelContacts, error: fetchError } = await supabaseAdmin
      .from('intel_contacts')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('Error fetching Audio Intel contacts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch Audio Intel contacts' },
        { status: 500 }
      );
    }

    if (!intelContacts || intelContacts.length === 0) {
      return NextResponse.json({
        message: 'No contacts found in Audio Intel',
        synced: 0,
      });
    }

    // Get existing contacts in Pitch Generator to avoid duplicates
    const { data: existingContacts } = await supabaseAdmin
      .from('contacts')
      .select('email, name')
      .eq('user_id', userId);

    const existingEmails = new Set(
      existingContacts?.map((c) => c.email?.toLowerCase()) || []
    );
    const existingNames = new Set(
      existingContacts?.map((c) => c.name?.toLowerCase()) || []
    );

    // Filter out duplicates (match by email or name)
    const newContacts = intelContacts.filter((contact) => {
      const emailMatch = contact.email && existingEmails.has(contact.email.toLowerCase());
      const nameMatch = contact.name && existingNames.has(contact.name.toLowerCase());
      return !emailMatch && !nameMatch;
    });

    if (newContacts.length === 0) {
      return NextResponse.json({
        message: 'All Audio Intel contacts already synced',
        synced: 0,
        total: intelContacts.length,
      });
    }

    // Transform Audio Intel contacts to Pitch Generator format
    const contactsToInsert = newContacts.map((contact) => ({
      user_id: userId,
      name: contact.contact_name || contact.name,
      role: contact.role || null,
      outlet: contact.station || contact.outlet || contact.publication || null,
      email: contact.email || null,
      genre_tags: contact.genres || contact.genre_tags || null,
      notes: contact.notes || null,
      preferred_tone: 'professional' as const,
    }));

    // Insert contacts into Pitch Generator database
    const { error: insertError } = await supabaseAdmin
      .from('contacts')
      .insert(contactsToInsert);

    if (insertError) {
      console.error('Error inserting contacts:', insertError);
      return NextResponse.json(
        { error: 'Failed to sync contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully synced ${newContacts.length} contacts from Audio Intel`,
      synced: newContacts.length,
      total: intelContacts.length,
      skipped: intelContacts.length - newContacts.length,
    });
  } catch (error: any) {
    console.error('Sync contacts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync contacts' },
      { status: 500 }
    );
  }
}
