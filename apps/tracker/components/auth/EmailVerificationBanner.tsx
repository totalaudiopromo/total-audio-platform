'use client';

import { useState } from 'react';
import { X, Mail } from 'lucide-react';

interface EmailVerificationBannerProps {
  email: string;
}

export function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
      });

      if (response.ok) {
        setResendMessage('✓ Verification email sent! Check your inbox.');
      } else {
        setResendMessage('⚠ Failed to send email. Please try again later.');
      }
    } catch (error) {
      setResendMessage('⚠ Something went wrong. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl border-4 border-amber-500 shadow-brutal relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white border-2 border-amber-500 hover:bg-amber-50 transition-all"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4 text-amber-700" />
      </button>

      <div className="px-6 py-5 pr-14">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center border-2 border-black">
            <Mail className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 mb-2">Verify Your Email Address</h3>
            <p className="text-sm font-bold text-gray-700 mb-4">
              Please verify your email address (<span className="text-amber-700">{email}</span>) to access all Tracker features
              including campaign creation, AI insights, and integrations.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-black hover:bg-amber-700 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>

              {resendMessage && (
                <div className={`px-4 py-2.5 rounded-xl font-bold text-sm ${
                  resendMessage.startsWith('✓')
                    ? 'bg-green-100 text-green-800 border-2 border-green-500'
                    : 'bg-red-100 text-red-800 border-2 border-red-500'
                }`}>
                  {resendMessage}
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-gray-600">
              Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
