'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  title?: string;
  description?: string;
  placeholder?: string;
}

export function NewsletterSignup({
  variant = 'card',
  title = "Get The Unsigned Advantage",
  description = "Weekly music industry insights, radio promotion tips, and tools to help you break through.",
  placeholder = "your@email.com"
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('https://intel.totalaudiopromo.com/api/convertkit/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriber: {
            email_address: email,
            tags: ['newsletter', 'totalaudiopromo_user'],
            fields: {
              lead_source: 'totalaudiopromo',
              signup_tool: 'Total Audio Promo'
            }
          },
          form_type: 'newsletter'
        })
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      setMessage('🎉 Success! Check your email to confirm.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={loading || status === 'success'}
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || status === 'success'}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'success' ? (
            <><CheckCircle2 className="h-4 w-4" /> Subscribed</>
          ) : loading ? (
            'Subscribing...'
          ) : (
            <>Subscribe <ArrowRight className="h-4 w-4" /></>
          )}
        </button>
      </form>
    );
  }

  // Default: card variant
  return (
    <div className="glass-panel p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-blue-500/10 p-3">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                disabled={loading || status === 'success'}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || status === 'success'}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {status === 'success' ? (
                  <><CheckCircle2 className="h-4 w-4" /> Done</>
                ) : loading ? (
                  'Subscribing...'
                ) : (
                  <>Subscribe <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
            {message && (
              <p className={`text-xs ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
          <p className="text-xs text-gray-500">
            Join 100+ artists getting weekly insights from Total Audio Promo.
          </p>
        </div>
      </div>
    </div>
  );
}
