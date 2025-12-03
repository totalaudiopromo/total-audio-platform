'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, UserPlus, Loader2, Trash2, Upload } from 'lucide-react';
import { createClient } from '@total-audio/core-db/client';
import type { Contact } from '@/lib/types';

export default function ContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Only create supabase client on client-side
  const supabase = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createClient();
  }, []);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [importing, setImporting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    outlet: '',
    email: '',
    genre_tags: '',
    notes: '',
    preferred_tone: 'professional' as 'casual' | 'professional' | 'enthusiastic',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.email) {
      loadContacts();
    }
  }, [session]);

  async function loadContacts() {
    if (!supabase) return;
    try {
      const userId = session?.user?.email || '';
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId)
        .order('name');

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    try {
      const userId = session?.user?.email || '';
      const genreTags = formData.genre_tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase.from('contacts').insert({
        user_id: userId,
        name: formData.name,
        role: formData.role || null,
        outlet: formData.outlet || null,
        email: formData.email || null,
        genre_tags: genreTags.length > 0 ? genreTags : null,
        notes: formData.notes || null,
        preferred_tone: formData.preferred_tone,
      });

      if (error) throw error;

      // Reset form and reload contacts
      setFormData({
        name: '',
        role: '',
        outlet: '',
        email: '',
        genre_tags: '',
        notes: '',
        preferred_tone: 'professional',
      });
      setShowAddForm(false);
      loadContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  }

  async function handleDeleteContact(contactId: string) {
    if (!supabase) return;
    const confirmed = confirm('Are you sure you want to delete this contact?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('contacts').delete().eq('id', contactId);

      if (error) throw error;
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    if (!supabase) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Parse header row
      const headers = lines[0]
        .toLowerCase()
        .split(',')
        .map(h => h.trim());
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const outletIdx = headers.findIndex(
        h => h.includes('outlet') || h.includes('station') || h.includes('publication')
      );
      const roleIdx = headers.findIndex(h => h.includes('role') || h.includes('title'));
      const genreIdx = headers.findIndex(h => h.includes('genre'));

      if (nameIdx === -1) {
        throw new Error('CSV must include a "name" column');
      }

      // Parse data rows
      const contactsToImport = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

        const name = values[nameIdx];
        if (!name) continue;

        const genreTags =
          genreIdx !== -1 && values[genreIdx]
            ? values[genreIdx]
                .split(';')
                .map(g => g.trim())
                .filter(Boolean)
            : [];

        contactsToImport.push({
          user_id: session?.user?.email || '',
          name,
          email: emailIdx !== -1 ? values[emailIdx] || null : null,
          outlet: outletIdx !== -1 ? values[outletIdx] || null : null,
          role: roleIdx !== -1 ? values[roleIdx] || null : null,
          genre_tags: genreTags.length > 0 ? genreTags : null,
          preferred_tone: 'professional' as const,
        });
      }

      if (contactsToImport.length === 0) {
        throw new Error('No valid contacts found in CSV');
      }

      // Batch insert
      const { error } = await supabase.from('contacts').insert(contactsToImport);

      if (error) throw error;

      alert(`Successfully imported ${contactsToImport.length} contacts`);
      loadContacts();

      // Reset file input
      e.target.value = '';
    } catch (error: any) {
      console.error('Error importing CSV:', error);
      alert(error.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-8 w-8 animate-spin text-brand-amber-dark" aria-hidden="true" />
        <span className="sr-only">Loading contacts...</span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-5xl overflow-x-hidden px-4 sm:px-0">
      <div className="mb-6">
        <Link href="/dashboard" className="subtle-button inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="glass-panel px-8 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Contacts</h1>
              <p className="mt-2 text-gray-900/60">Add contacts manually or import from CSV</p>
            </div>
            <div className="flex gap-3">
              <label
                className={`subtle-button flex cursor-pointer items-center gap-2 ${
                  importing ? 'opacity-50' : ''
                }`}
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Import CSV
                  </>
                )}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  disabled={importing}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="cta-button flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-900">
              <strong>💡 Pro tip:</strong> Use Audio Intel to enrich your contacts first, then
              export as CSV and import here for best results.
            </p>
          </div>
        </div>

        {/* Add Contact Form */}
        {showAddForm && (
          <div className="mb-8 rounded-2xl border border-brand-amber/30 bg-brand-amber/5 p-6">
            <h3 className="mb-4 text-lg font-semibold">Add New Contact</h3>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Producer"
                    className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">Outlet</label>
                  <input
                    type="text"
                    value={formData.outlet}
                    onChange={e => setFormData({ ...formData, outlet: e.target.value })}
                    placeholder="e.g. BBC Radio 6 Music"
                    className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900/80">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900/80">
                  Genre Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.genre_tags}
                  onChange={e => setFormData({ ...formData, genre_tags: e.target.value })}
                  placeholder="e.g. indie, folk, alternative"
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900/80">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="e.g. Replies on Tuesdays, loves touring artists"
                  className="mt-1.5 w-full rounded-xl border-4 border-black bg-white px-4 py-3 font-bold text-sm text-gray-900 placeholder:text-gray-500 transition focus:outline-none focus:ring-4 focus:ring-cyan-400 min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900/80">Preferred Tone</label>
                <div className="mt-2 flex gap-2">
                  {(['casual', 'professional', 'enthusiastic'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferred_tone: tone })}
                      className={`rounded-xl border-4 border-black px-4 py-2 text-sm font-bold transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                        formData.preferred_tone === tone
                          ? 'bg-brand-amber text-black'
                          : 'bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="cta-button flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="subtle-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="rounded-2xl border-4 border-black bg-white px-8 py-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <UserPlus className="mx-auto h-12 w-12 text-gray-900/30" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900/70">No contacts yet</h3>
            <p className="mt-2 text-sm text-gray-900/50">
              Add your first media contact to start generating personalized pitches
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className="group rounded-2xl border-4 border-black bg-white px-6 py-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{contact.name}</h3>
                      {contact.role && (
                        <span className="text-sm text-gray-900/60">{contact.role}</span>
                      )}
                    </div>
                    {contact.outlet && (
                      <p className="mt-1 text-sm text-gray-900/70">{contact.outlet}</p>
                    )}
                    {contact.email && (
                      <p className="mt-1 text-sm text-gray-900/50">{contact.email}</p>
                    )}
                    {contact.genre_tags && contact.genre_tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {contact.genre_tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-brand-amber/20 px-3 py-1 text-xs text-brand-amber-dark font-bold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {contact.notes && (
                      <p className="mt-2 text-sm text-gray-900/50 italic">{contact.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="subtle-button flex items-center gap-2 text-xs text-danger opacity-0 transition hover:bg-danger/10 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
