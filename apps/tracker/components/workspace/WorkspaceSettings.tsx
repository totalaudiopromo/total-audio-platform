'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Palette, Building2, Save, Upload, Eye } from 'lucide-react';
import { workspaceManager, Workspace } from '@/lib/workspace';
import { createClient } from '@total-audio/core-db/client';

export default function WorkspaceSettings() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [agencyName, setAgencyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#14B8A6');
  const [secondaryColor, setSecondaryColor] = useState('#0F9488');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadWorkspaceSettings();
  }, []);

  const loadWorkspaceSettings = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const workspaces = await workspaceManager.getUserWorkspaces(user.id);
      if (workspaces.length > 0) {
        const currentWorkspace = workspaces[0];
        setWorkspace(currentWorkspace);

        // Load existing branding
        if (currentWorkspace.custom_branding) {
          setAgencyName(
            currentWorkspace.custom_branding.agency_name ||
              currentWorkspace.name
          );
          setLogoUrl(currentWorkspace.custom_branding.logo_url || '');
          setPrimaryColor(
            currentWorkspace.custom_branding.primary_color || '#14B8A6'
          );
          setSecondaryColor(
            currentWorkspace.custom_branding.secondary_color || '#0F9488'
          );
        } else {
          setAgencyName(currentWorkspace.name);
        }
      }
    }
  };

  const handleSave = async () => {
    if (!workspace) return;

    setSaving(true);

    const success = await workspaceManager.updateWorkspaceBranding(
      workspace.id,
      {
        agency_name: agencyName,
        logo_url: logoUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
      }
    );

    if (success) {
      alert('White-label settings saved successfully!');
      loadWorkspaceSettings();
    } else {
      alert('Failed to save settings. Please try again.');
    }

    setSaving(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for PDF embedding
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#14B8A6] border-2 border-black rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              White-Label Settings
            </h2>
            <p className="text-sm font-bold text-gray-700">
              Customise your agency branding for PDF exports
            </p>
          </div>
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white border-4 border-black shadow-brutal rounded-none p-8">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-[#14B8A6]" />
          <h3 className="text-xl font-black text-gray-900">Agency Branding</h3>
        </div>

        <div className="space-y-6">
          {/* Agency Name */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
              Agency Name
            </label>
            <input
              type="text"
              value={agencyName}
              onChange={e => setAgencyName(e.target.value)}
              placeholder="Your Agency Name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-900 focus:border-[#14B8A6] focus:outline-none"
            />
            <p className="text-xs font-medium text-gray-600 mt-1">
              This name will appear on all PDF exports and reports
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
              Agency Logo
            </label>
            <div className="flex items-start gap-4">
              {/* Logo Preview */}
              <div className="w-24 h-24 border-4 border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-10 h-10 text-gray-400" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="inline-block px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-black text-sm border-2 border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs font-medium text-gray-600 mt-2">
                  PNG, JPG, or SVG. Square format recommended (e.g., 512x512px)
                </p>
                {logoUrl && (
                  <button
                    onClick={() => setLogoUrl('')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 mt-2"
                  >
                    Remove logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Colour Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Colour */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                Primary Brand Colour
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:border-[#14B8A6] focus:outline-none"
                  placeholder="#14B8A6"
                />
              </div>
              <p className="text-xs font-medium text-gray-600 mt-1">
                Used for headers, accents, and buttons
              </p>
            </div>

            {/* Secondary Colour */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                Secondary Colour
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-mono font-bold text-gray-900 focus:border-[#14B8A6] focus:outline-none"
                  placeholder="#0F9488"
                />
              </div>
              <p className="text-xs font-medium text-gray-600 mt-1">
                Used for gradients and highlights
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t-2 border-gray-200">
          <button
            onClick={() => setShowPreview(true)}
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-black border-2 border-gray-300 hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !agencyName.trim()}
            className="flex-1 px-6 py-3 bg-[#14B8A6] text-white rounded-xl font-black border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Plan Tier Info */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 shadow-brutal rounded-none p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-yellow-400 border-2 border-black rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-yellow-900" />
          </div>
          <div>
            <h3 className="text-lg font-black text-yellow-900 mb-2">
              {workspace.plan_tier === 'agency'
                ? 'Agency Plan - White-Label Active'
                : 'Upgrade to Enable White-Label'}
            </h3>
            {workspace.plan_tier === 'agency' ? (
              <p className="text-sm font-medium text-yellow-900">
                Your agency plan includes full white-label branding for all PDF
                exports. Clients will only see your agency branding.
              </p>
            ) : (
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-3">
                  White-label branding is available on the Agency plan
                  (£79/month). Features include:
                </p>
                <ul className="text-sm font-medium text-yellow-900 space-y-1 mb-4">
                  <li>• Custom logo on all PDFs</li>
                  <li>• Your agency colours and branding</li>
                  <li>• No "Powered by Audio Intel" footer</li>
                  <li>• Client-ready professional reports</li>
                  <li>• Unlimited workspace members</li>
                </ul>
                <button className="px-6 py-3 bg-yellow-400 text-yellow-900 rounded-xl font-black border-2 border-black shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all">
                  Upgrade to Agency Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-black shadow-brutal rounded-none max-w-2xl w-full p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6">
              Branding Preview
            </h3>

            {/* Mock PDF Header Preview */}
            <div
              className="border-4 border-black shadow-brutal rounded-none p-6 mb-6"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-gray-300">
                {/* Logo */}
                <div
                  className="w-16 h-16 border-2 border-black rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="text-white font-black text-2xl">
                      {agencyName
                        .split(' ')
                        .map(w => w[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Agency Info */}
                <div>
                  <h4
                    className="text-xl font-black"
                    style={{ color: '#000000' }}
                  >
                    {agencyName.toUpperCase()}
                  </h4>
                  <p
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    CONTACT INTELLIGENCE REPORT
                  </p>
                </div>
              </div>

              <h5
                className="text-2xl font-black mb-2"
                style={{ color: '#000000' }}
              >
                ENRICHED CONTACT INTELLIGENCE
              </h5>
              <p className="text-sm font-bold" style={{ color: primaryColor }}>
                Professional Music Industry Contacts
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-black border-2 border-gray-300 hover:bg-gray-200 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
