import { createServerClient } from '@total-audio/core-db/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Bell, Shield, Palette, CreditCard } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createServerClient(cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName =
    user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const isEmailVerified = !!user.email_confirmed_at;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
          Settings
        </h1>
        <p className="text-gray-600 font-medium">
          Manage your account and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <User className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500">
                  Your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue={userName}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:outline-none font-medium"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    defaultValue={userEmail}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 font-medium"
                    disabled
                  />
                  {isEmailVerified ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold">
                      Not Verified
                    </span>
                  )}
                </div>
              </div>

              <button className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Save Changes
              </button>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500">
                  Email and alert preferences
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Campaign Updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified when campaigns complete
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded accent-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Integration Alerts</p>
                  <p className="text-sm text-gray-500">
                    Sync errors and connection issues
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded accent-teal-600"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 cursor-pointer transition-colors">
                <div>
                  <p className="font-bold text-gray-900">Weekly Digest</p>
                  <p className="text-sm text-gray-500">
                    Summary of your campaign performance
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded accent-teal-600"
                />
              </label>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">
                  Password and authentication
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
                <div>
                  <p className="font-bold text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left">
                <div>
                  <p className="font-bold text-gray-900">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold">
                  Coming Soon
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-4 border-teal-600 shadow-[4px_4px_0px_0px_rgba(13,148,136,1)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Plan</h2>
                <p className="text-sm text-teal-700 font-bold">Free Tier</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Upgrade to Pro for unlimited campaigns, advanced analytics, and
                premium integrations.
              </p>
            </div>

            <a
              href="/pricing"
              className="block w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-black text-center hover:bg-teal-700 transition-colors border-2 border-black"
            >
              Upgrade to Pro
            </a>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900">Appearance</h2>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-teal-500 bg-teal-50 cursor-pointer">
                <span className="font-bold text-gray-900">Light Mode</span>
                <div className="w-4 h-4 rounded-full bg-teal-600"></div>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <span className="font-bold text-gray-600">Dark Mode</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-bold">
                  Soon
                </span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border-4 border-red-200 p-6">
            <h2 className="text-lg font-black text-red-600 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border-2 border-red-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
