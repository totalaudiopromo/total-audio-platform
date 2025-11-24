/**
 * Settings Page
 * Configure coaching profile and preferences
 */

'use client';

import React, { useEffect, useState } from 'react';
import { CoachSettingsForm } from '../components/CoachSettingsForm';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/coach/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: any) => {
    try {
      await fetch('/api/coach/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      await fetchProfile();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <div className="text-white/70">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white/90 mb-2">Settings</h1>
          <p className="text-white/60">Configure your coaching profile</p>
        </div>

        <CoachSettingsForm
          initialValues={{
            role: profile?.role,
            experienceLevel: profile?.experience_level,
            genre: profile?.genre,
            preferences: profile?.preferences,
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
