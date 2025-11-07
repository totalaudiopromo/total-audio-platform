'use client';

import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Music,
  Star,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Upload,
  Download,
  User,
  Mail,
  Headphones,
  BarChart,
  Shield,
  Smile,
  Award,
  Briefcase,
  Globe,
  Phone,
  ExternalLink,
  Check,
  Play,
  Target,
} from 'lucide-react';
import FileUpload from './FileUpload';
import ProgressBarWithDog from './ProgressBarWithDog';
import ExportButtons from './ExportButtons';
import GradientSelector from './GradientSelector';
import TextureSelector from './TextureSelector';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const testimonials = [
  {
    quote:
      'Audio Intel cut our research time by 80%. We can now focus on building relationships instead of googling contact details.',
    name: 'Sarah, Sonic PR',
    role: 'Music PR Agency',
  },
  {
    quote:
      'Finally know exactly who to pitch and how to approach them. Our playlist placement rate doubled.',
    name: 'Marcus, Indie Records',
    role: 'Record Label A&R',
  },
  {
    quote:
      "Got my first BBC Radio play after using Audio Intel's contact intelligence. Game changer.",
    name: 'Emma, Artist',
    role: 'Independent Artist',
  },
];

const faqs = [
  {
    q: 'What kind of context does Audio Intel add?',
    a: 'Audio Intel uses AI to generate helpful reference notes based on available information - like platform type, genre focus, and pitching suggestions. This is AI-generated context to help organise your contacts, not verified data. Always verify important details before pitching.',
  },
  {
    q: 'What music industry contacts can you enrich?',
    a: 'We specialize in playlist curators, radio DJs, music bloggers, A&Rs, festival bookers, and more across the UK and global music industry.',
  },
  {
    q: 'Do you work with Spotify playlists and radio stations?',
    a: 'Yes! We enrich contacts for Spotify, Apple Music, BBC Radio, community radio, and hundreds of other platforms.',
  },
  {
    q: 'Can I export to my existing CRM?',
    a: 'Absolutely. Export enriched contacts to CSV or Excel and import into any CRM or spreadsheet system you use.',
  },
  {
    q: 'Is my data secure and GDPR compliant?',
    a: 'Yes, we are fully GDPR compliant and your data is encrypted at rest and in transit. We never share your lists.',
  },
  {
    q: 'What happens after my free credits are used?',
    a: 'You can upgrade to a paid plan at any time. Your data and enriched contacts remain accessible even if you don’t upgrade.',
  },
  {
    q: 'What is the 7-day free trial?',
    a: "Our free trial allows you to try all our features for 7 days. You'll be charged automatically at the end of your trial unless you cancel. All features are unlocked during the trial, and you can cancel anytime during your trial to avoid charges. We'll send you a reminder before your trial ends.",
  },
  {
    q: 'Do I need a credit card for the free trial?',
    a: "Yes, a credit card is required to start the free trial. This helps us ensure you're a serious user and prevents abuse. You won't be charged unless you choose to upgrade or your trial ends.",
  },
  {
    q: 'What happens if I cancel my trial?',
    a: "If you cancel your trial, you'll lose access to all paid features. Your data and enriched contacts will remain available for a limited time, but you won't be able to export them or use the platform for paid features.",
  },
];

// --- Analytics Utility ---
function trackEvent(event: string, data: Record<string, any> = {}) {
  // Google Analytics 4 (if available)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }
  // Fallback: send to internal API
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data: { ...data, timestamp: new Date().toISOString() } }),
  });
}

// Track contact enrichment usage
function trackEnrichment(contactCount: number, processingTime: number) {
  trackEvent('enrichment_completed', { contactCount, processingTime });
}
// Track conversion funnel
function trackPricingView(plan: string) {
  trackEvent('pricing_view', { plan });
}
function trackTrialStart(plan: string) {
  trackEvent('trial_start', { plan });
}
// Track feature usage
function trackFileUpload(fileType: string, contactCount: number) {
  trackEvent('file_upload', { fileType, contactCount });
}
function trackExport(format: string, enrichedCount: number) {
  trackEvent('export', { format, enrichedCount });
}
// Track errors
type ErrorType = 'api_failure' | 'upload_error' | 'enrichment_error' | 'download_error';
function trackError(errorType: ErrorType, details: string) {
  trackEvent('error', { errorType, details });
}

// Track cross-promotion clicks
function trackCrossPromotionClick(target: string, location: string) {
  trackEvent('cross_promotion_click', { target, location });
}

export default function HomePageClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Demo flow state
  const [demoOpen, setDemoOpen] = useState(false);
  const [contacts, setContacts] = useState<Array<{ name: string; email: string }>>([
    { name: 'BBC Radio 1', email: 'dj@bbc.co.uk' },
    { name: 'NME', email: 'editor@nme.com' },
  ]);
  const [inputText, setInputText] = useState(contacts.map(c => c.email).join('\n'));
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [enriched, setEnriched] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();
  // Add state for payment modal
  const [paymentPlan, setPaymentPlan] = useState<'starter' | 'professional' | 'agency' | null>(
    null
  );
  const [paymentEmail, setPaymentEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isPaying, setIsPaying] = useState(false);
  // Add state for pricing toggle
  const [pricingMode, setPricingMode] = useState<'monthly' | 'yearly'>('monthly');
  // Add state for gradient and texture selectors
  const [currentGradient, setCurrentGradient] = useState('DRS_4K_Luma Gradient_15.jpg');
  const [currentTexture, setCurrentTexture] = useState('DRS_MagazineTexture_8K_52.jpg');

  // Handle file upload (CSV/Excel)
  const handleFile = async (file: File) => {
    const text = await file.text();
    // Simple CSV parsing: split by newlines, take first column as email
    const lines = text.split(/\r?\n/).filter(Boolean);
    const emails = lines.map(line => {
      const [email] = line.split(/,|;|\t/);
      return { name: '', email: email.trim() };
    });
    setContacts(emails.slice(0, 5));
    setInputText(emails.map(e => e.email).join('\n'));
    if (emails.length > 5) setShowUpgrade(true);
    trackFileUpload('csv', emails.length);
  };

  // Handle text area input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const emails = e.target.value
      .split(/\r?\n/)
      .map(email => email.trim())
      .filter(Boolean)
      .map(email => ({ name: '', email }));
    setContacts(emails.slice(0, 5));
    setShowUpgrade(emails.length > 5);
  };

  // Handle enrichment
  const handleEnrich = async () => {
    setLoading(true);
    setError(null);
    setEnriched([]);
    setProgress(0);
    // Log collected email to analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'demo_email_collected',
        data: { email: userEmail, timestamp: new Date().toISOString() },
      }),
    });
    try {
      const total = contacts.length;
      let enrichedResults: any[] = [];
      for (let i = 0; i < contacts.length; i++) {
        setProgress(i);
        const resp = await fetch('/api/enrich-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: [contacts[i]] }),
        });
        const data = await resp.json();
        if (data.success && data.enriched && data.enriched.length > 0) {
          enrichedResults.push(data.enriched[0]);
        } else {
          enrichedResults.push({ ...contacts[i], contactIntelligence: 'Enrichment failed.' });
        }
        setEnriched([...enrichedResults]);
        setProgress(i + 1);
      }
      trackEnrichment(total, total * 100); // Assuming 100ms per contact for simplicity
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      trackError('enrichment_error', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Generate CSV for download/email
  const generateCsv = (data: any[]) => {
    const headers = ['Name', 'Email', 'Contact Intelligence'];
    const rows = data.map(row => [row.name, row.email, row.contactIntelligence]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    return csv;
  };

  // Download CSV
  const handleDownloadCsv = () => {
    if (!enriched.length) return;
    const csv = generateCsv(enriched);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio-intel-enriched-demo.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    trackExport('csv', enriched.length);
  };

  // Send results to email
  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailSent(false);
    setError(null);
    try {
      // Generate CSV and create a temporary download link
      const csv = generateCsv(enriched);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      setCsvUrl(url);
      // For demo, use a data URL as downloadUrl
      const downloadUrl = url;
      const resp = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, downloadUrl, count: enriched.length }),
      });
      const data = await resp.json();
      if (data.success) {
        setEmailSent(true);
        // Analytics: log email sent
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'email_sent',
            data: { email: userEmail, count: enriched.length, timestamp: new Date().toISOString() },
          }),
        });
      } else {
        setError(data.error || 'Failed to send email');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setSendingEmail(false);
    }
  };

  // Analytics: log demo usage
  React.useEffect(() => {
    if (enriched.length > 0) {
      trackEnrichment(enriched.length, enriched.length * 100); // Assuming 100ms per contact for simplicity
    }
  }, [enriched]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto">
          <Card className="border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white bg-opacity-95 backdrop-blur-md hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
            <div className="flex justify-between items-center px-8 py-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-3 border-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all duration-200">
                  <span className="text-white font-black text-2xl">A</span>
                </div>
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                  Audio Intel
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-black font-bold text-lg transition-colors"
                >
                  Features
                </a>
                <Link
                  href="/blog"
                  className="text-gray-700 hover:text-black font-bold text-lg transition-colors"
                >
                  Blog
                </Link>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-black font-bold text-lg transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-gray-700 hover:text-black font-bold text-lg transition-colors"
                >
                  FAQ
                </a>
                <Button
                  variant="outline"
                  className="rounded-2xl border-3 border-black font-black text-lg px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white hover:bg-gray-50"
                >
                  Sign In
                </Button>
              </nav>
            </div>
          </Card>
        </div>
      </header>

      {/* Gradient and Texture Selectors */}
      <GradientSelector onGradientChange={setCurrentGradient} currentGradient={currentGradient} />
      <TextureSelector onTextureChange={setCurrentTexture} currentTexture={currentTexture} />
      {/* HERO SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col items-center text-center text-white relative overflow-hidden dark:bg-gray-900 max-w-screen-xl mx-auto">
        {/* HERO BACKGROUND IMAGE */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <Image
            src={`/${currentGradient}`}
            alt="Luma gradient background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
          />
          <Image
            src={`/${currentTexture}`}
            alt="Magazine texture overlay"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.3 }}
            priority
          />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>
        <div className="max-w-3xl mx-auto z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-2 drop-shadow-lg inline-block dark:bg-white dark:rounded-full dark:p-2">
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Mascot"
                width={160}
                height={80}
                style={{ height: 80, width: 'auto' }}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight dark:text-white break-words">
            Audio Intel: Turn{' '}
            <span className="text-[#a5b4fc] dark:text-brand-blue">Messy Contact Spreadsheets</span>{' '}
            <br className="hidden sm:block" /> Into Organised Databases
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 text-white/90 break-words">
            AI-powered contact organisation that adds helpful context and reference notes to your
            existing contacts. Upload messy lists, get back clean data with AI-generated context
            notes. Export to CSV/Excel and use anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              className="px-8 py-4 min-h-[44px] rounded-lg font-bold text-lg bg-[#6366f1] hover:bg-[#818cf8] text-white shadow-lg transition-transform focus:outline-none"
              onClick={() => {
                setModalOpen(true);
                trackEvent('demo_button_click');
              }}
              autoFocus
            >
              Try Demo
            </button>
            <button
              className="px-8 py-4 min-h-[44px] rounded-lg font-bold text-lg border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#312e81] transition-colors"
              onClick={() => {
                if (howItWorksRef.current) {
                  howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              How It Works
            </button>
          </div>
          {/* Hero visual: Before/after mockup */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8 relative w-full">
            <div className="bg-white bg-opacity-10 rounded-xl p-6 flex flex-col items-center shadow-lg min-w-0 w-full sm:w-auto dark:bg-white dark:bg-opacity-10">
              <span className="text-xs uppercase tracking-wider text-white/70 mb-2">Before</span>
              <div className="bg-white text-[#312e81] font-mono px-4 py-2 rounded-lg text-lg shadow-inner dark:bg-white dark:text-[#312e81] break-words">
                john@bbc.co.uk
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-white/70 hidden sm:block" />
            <div className="bg-white bg-opacity-20 rounded-xl p-6 flex flex-col items-center shadow-lg min-w-0 w-full sm:w-auto dark:bg-white dark:bg-opacity-20">
              <span className="text-xs uppercase tracking-wider text-white/70 mb-2">After</span>
              <div className="bg-white text-[#312e81] font-mono px-4 py-2 rounded-lg text-base shadow-inner whitespace-pre text-left dark:bg-white dark:text-[#312e81] break-words">
                • BBC Radio 1 | National Public Service{'\n'}• UK National Coverage | High Reach
                {'\n'}• Email: Weekday mornings preferred{'\n'}• Focus: New UK artists, breaking
                acts{'\n'}• Tip: Include streaming numbers + press quote{'\n'}• Research Confidence:
                High
              </div>
            </div>
            {/* Dog mascot floating near the transformation */}
            <div
              className="bg-white rounded-full p-2 border-4 border-[#6366f1] absolute -right-10 sm:right-[-60px] top-1/2 -translate-y-1/2 drop-shadow-xl z-10 dark:bg-white hidden sm:block"
              style={{ boxShadow: '0 8px 32px rgba(49,46,129,0.15)' }}
            >
              <Image
                src="/images/total_audio_promo_logo_trans.png"
                alt="Total Audio Promo Mascot"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <span className="flex items-center gap-2 text-white/90">
              <img
                src="/images/total_audio_promo_logo_trans.png"
                alt="Mascot"
                className="w-6 h-6 rounded-full bg-white mr-1"
              />
              Trusted by Music Industry Professionals
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80 text-sm">
            <span>10x cheaper than enterprise tools</span>
            <span className="hidden sm:inline">•</span>
            <span>Music industry specialized</span>
            <span className="hidden sm:inline">•</span>
            <span>Ready in minutes</span>
          </div>
          <div className="mt-6 text-xs text-white/70">Powered by Audio Intel</div>
        </div>
        {/* Subtle music note background */}
        <Music
          className="absolute top-8 left-8 w-32 h-32 text-white/10 rotate-12"
          aria-label="music note background"
        />
        <Music
          className="absolute bottom-8 right-8 w-32 h-32 text-white/10 -rotate-12"
          aria-label="music note background"
        />
      </section>

      {/* Cross-Promotion Banner */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-b border-yellow-400/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 rounded-full p-2">
                <Music className="w-5 h-5 text-black [animation:none]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  New! Try Playlist Pulse for playlist curator discovery
                </h3>
                <p className="text-sm text-white/80">
                  Get instant access to 50,000+ verified playlist curators with AI-powered pitch
                  generation
                </p>
              </div>
            </div>
            <Link
              href="https://pulse.totalaudiopromo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              onClick={() => trackCrossPromotionClick('playlist_pulse', 'hero_banner')}
            >
              <span>Try Playlist Pulse</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center dark:text-white break-words">
          The Music Industry Contact Research Nightmare
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 max-w-4xl w-full justify-center">
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <Zap className="w-10 h-10 text-[#818cf8] mb-2" aria-label="Lightning bolt icon" />
            <div className="font-semibold mb-1 dark:text-white break-words">
              Spending hours researching playlist curators and radio contacts manually
            </div>
          </div>
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <Mail className="w-10 h-10 text-[#818cf8] mb-2" aria-label="Mail icon" />
            <div className="font-semibold mb-1 dark:text-white break-words">
              Missing crucial submission guidelines and contact preferences
            </div>
          </div>
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <Headphones className="w-10 h-10 text-[#818cf8] mb-2" aria-label="Headphones icon" />
            <div className="font-semibold mb-1 dark:text-white break-words">
              Cold pitching without knowing their music taste or recent activity
            </div>
          </div>
        </div>
        <p className="mt-8 max-w-2xl text-center text-lg text-[#312e81]/80 dark:text-white/80 break-words">
          Music PR professionals waste 15+ hours per week on contact research that AI can do in
          minutes. Meanwhile, your competition is already pitching while you're still googling.
        </p>
      </section>

      {/* SOLUTION SECTION */}
      <section
        ref={howItWorksRef}
        className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-[#ede9fe] flex flex-col items-center max-w-screen-xl mx-auto overflow-x-hidden"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          How Audio Intel Works
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-4xl">
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <Upload className="w-12 h-12 text-[#6366f1] mb-2" aria-label="Upload icon" />
            <div className="font-bold text-lg mb-1 break-words">1. Upload</div>
            <div className="text-base dark:text-white break-words">
              Drop your email list (CSV, Excel, or paste emails)
            </div>
          </div>
          <ArrowRight className="w-8 h-8 text-[#818cf8] hidden sm:block" />
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <BarChart className="w-12 h-12 text-[#6366f1] mb-2" aria-label="Bar chart icon" />
            <div className="font-bold text-lg mb-1 break-words">2. AI Research</div>
            <div className="text-base dark:text-white break-words">
              Our AI analyses each contact for music industry intelligence
            </div>
          </div>
          <ArrowRight className="w-8 h-8 text-[#818cf8] hidden sm:block" />
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <Download className="w-12 h-12 text-[#6366f1] mb-2" aria-label="Download icon" />
            <div className="font-bold text-lg mb-1 break-words">3. Export</div>
            <div className="text-base dark:text-white break-words">
              Download complete contact profiles with pitch-ready insights
            </div>
          </div>
        </div>
        {/* Visual workflow diagram (arrows) */}
        <div className="flex justify-center mt-8">
          <div className="w-2 h-32 bg-gradient-to-b from-[#6366f1] to-[#818cf8] rounded-full" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white flex flex-col items-center max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          What You Get With Every Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <Feature
            icon={<User className="w-8 h-8 text-[#6366f1]" aria-label="User icon" />}
            title="Contact Organisation"
            desc="Clean formatting with role classification and platform categorisation"
          />
          <Feature
            icon={<Mail className="w-8 h-8 text-[#6366f1]" aria-label="Mail icon" />}
            title="AI-Generated Reference Notes"
            desc="Helpful context suggestions based on available information"
          />
          <Feature
            icon={<Headphones className="w-8 h-8 text-[#6366f1]" aria-label="Headphones icon" />}
            title="Genre Context"
            desc="AI suggestions for genre focus and music preferences"
          />
          <Feature
            icon={<Briefcase className="w-8 h-8 text-[#6366f1]" aria-label="Briefcase icon" />}
            title="Spreadsheet Cleanup"
            desc="Standardised formatting ready for CRM import"
          />
          <Feature
            icon={<Award className="w-8 h-8 text-[#6366f1]" aria-label="Award icon" />}
            title="Pitching Reminders"
            desc="AI-generated approach suggestions and conversation starters"
          />
          <Feature
            icon={<Download className="w-8 h-8 text-[#6366f1]" aria-label="Download icon" />}
            title="Export Anywhere"
            desc="Export to CSV, Excel, or PDF - use with any CRM system"
          />
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#ede9fe] to-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          See The Transformation
        </h2>
        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center mb-8 w-full">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-0 w-full sm:w-auto dark:bg-white">
            <span className="text-xs uppercase tracking-wider text-[#818cf8] mb-2">Before</span>
            <div className="bg-[#f1f5f9] text-[#312e81] font-mono px-4 py-2 rounded-lg text-lg shadow-inner dark:bg-[#f1f5f9] dark:text-[#312e81] break-words">
              john@bbc.co.uk
            </div>
          </div>
          <ArrowRight className="w-8 h-8 text-[#818cf8] hidden sm:block" />
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-0 w-full sm:w-auto dark:bg-white">
            <span className="text-xs uppercase tracking-wider text-[#818cf8] mb-2">After</span>
            <div className="bg-[#f1f5f9] text-[#312e81] font-mono px-4 py-2 rounded-lg text-base shadow-inner whitespace-pre text-left dark:bg-[#f1f5f9] dark:text-[#312e81] break-words">
              • BBC Radio 1 | National Public Service{'\n'}• UK National Coverage | High Reach{'\n'}
              • Email: Weekday mornings preferred{'\n'}• Focus: New UK artists, breaking acts{'\n'}•
              Tip: Include streaming numbers + press quote{'\n'}• Research Confidence: High
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[#312e81] text-lg font-semibold dark:text-white">
          <span>Clean, organised contact data in minutes</span>
          <span className="hidden sm:inline">•</span>
          <span>15 hours saved per week on spreadsheet cleanup</span>
          <span className="hidden sm:inline">•</span>
          <span>AI-generated reference notes for every contact</span>
        </div>
      </section>

      {/* REPLACE SOCIAL PROOF/TESTIMONIALS WITH USAGE STATISTICS */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          Trusted by Music Industry Professionals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl w-full mb-8">
          <StatCard
            stat="517+ Contacts Organised"
            subtext="Radio DJs, playlist curators, and music bloggers"
          />
          <StatCard
            stat="210+ Radio Stations"
            subtext="BBC, commercial, and independent contacts cleaned"
          />
          <StatCard stat="Clean Data Export" subtext="CSV, Excel, PDF - ready for any CRM" />
          <StatCard
            stat="15 Hours Saved"
            subtext="Average time saved per week on spreadsheet organisation"
          />
        </div>
        {/* Company logos as social proof */}
        <div className="flex flex-wrap gap-6 justify-center items-center opacity-60">
          <div className="w-28 h-10 bg-[#ede9fe] rounded flex items-center justify-center text-[#6366f1] font-bold text-sm dark:bg-gray-800 dark:text-white">
            BBC
          </div>
          <div className="w-28 h-10 bg-[#ede9fe] rounded flex items-center justify-center text-[#6366f1] font-bold text-sm dark:bg-gray-800 dark:text-white">
            Spotify
          </div>
          <div className="w-28 h-10 bg-[#ede9fe] rounded flex items-center justify-center text-[#6366f1] font-bold text-sm dark:bg-gray-800 dark:text-white">
            NME
          </div>
          <div className="w-28 h-10 bg-[#ede9fe] rounded flex items-center justify-center text-[#6366f1] font-bold text-sm dark:bg-gray-800 dark:text-white">
            Apple Music
          </div>
          <div className="w-28 h-10 bg-[#ede9fe] rounded flex items-center justify-center text-[#6366f1] font-bold text-sm dark:bg-gray-800 dark:text-white">
            Radio X
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-[#ede9fe] to-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#312e81] text-center dark:text-white break-words">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-[#312e81]/80 mb-8 text-center dark:text-white/80 break-words">
          Start your <span className="font-bold">7-day free trial</span>. Credit card required. All
          features unlocked during trial. You’ll be charged automatically at the end of your trial
          unless you cancel. Cancel anytime during your trial to avoid charges. We’ll send you a
          reminder before your trial ends.
        </p>
        {/* Pricing toggle */}
        <div className="flex items-center gap-2 mb-8">
          <button
            className={`px-4 py-2 min-h-[44px] rounded-l-lg font-semibold border ${
              pricingMode === 'monthly'
                ? 'bg-[#6366f1] text-white dark:bg-gray-800 dark:text-white'
                : 'bg-white text-[#6366f1] border-[#6366f1] dark:bg-gray-800 dark:text-white dark:border-gray-600'
            }`}
            onClick={() => setPricingMode('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 min-h-[44px] rounded-r-lg font-semibold border ${
              pricingMode === 'yearly'
                ? 'bg-[#6366f1] text-white dark:bg-gray-800 dark:text-white'
                : 'bg-white text-[#6366f1] border-[#6366f1] dark:bg-gray-800 dark:text-white dark:border-gray-600'
            }`}
            onClick={() => setPricingMode('yearly')}
          >
            Yearly
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mb-4">
          <PricingCard
            title="Free Forever"
            price="£0"
            features={[
              '5 contact enrichments per month',
              'Perfect for testing and small projects',
              'All core features included',
            ]}
            cta="Start Free Now"
            highlight={false}
            onClick={() => {
              setModalOpen(true);
              trackEvent('free_trial_start');
            }}
          />
          <PricingCard
            title="Starter"
            price={pricingMode === 'monthly' ? '£15/mo' : '£12/mo'}
            features={[
              '50 contact enrichments per month',
              'All AI research features',
              'Export to CSV, Excel',
              'Email support',
              'Perfect for: Independent artists, small labels',
            ]}
            cta={pricingMode === 'monthly' ? 'Start Free Trial' : 'Start Free Trial'}
            highlight={false}
            onClick={() => {
              setPaymentPlan('starter');
              setShowSignupModal(false);
              setBillingCycle(pricingMode === 'monthly' ? 'monthly' : 'annual');
              trackTrialStart('starter');
            }}
            showAnnualBadge={pricingMode === 'yearly'}
          />
          <PricingCard
            title="Professional"
            price={pricingMode === 'monthly' ? '£39/mo' : '£31/mo'}
            features={[
              '200 contact enrichments per month',
              'Priority processing',
              'Advanced export options',
              'CRM integrations',
              'Perfect for: Music PR agencies, growing labels',
            ]}
            cta={pricingMode === 'monthly' ? 'Start Free Trial' : 'Start Free Trial'}
            highlight={true}
            onClick={() => {
              setPaymentPlan('professional');
              setShowSignupModal(false);
              setBillingCycle(pricingMode === 'monthly' ? 'monthly' : 'annual');
              trackTrialStart('professional');
            }}
            showAnnualBadge={pricingMode === 'yearly'}
          />
          <PricingCard
            title="Agency"
            price={pricingMode === 'monthly' ? '£79/mo' : '£63/mo'}
            features={[
              '500 contact enrichments per month',
              'Fastest processing',
              'White-label exports',
              'Phone + email support',
              'Perfect for: Full-service PR agencies',
            ]}
            cta={pricingMode === 'monthly' ? 'Start Free Trial' : 'Start Free Trial'}
            highlight={false}
            onClick={() => {
              setPaymentPlan('agency');
              setShowSignupModal(false);
              setBillingCycle(pricingMode === 'monthly' ? 'monthly' : 'annual');
              trackTrialStart('agency');
            }}
            showAnnualBadge={pricingMode === 'yearly'}
          />
        </div>
        <div className="text-[#312e81]/80 text-sm mt-2 dark:text-white/80 break-words">
          {pricingMode === 'yearly' ? 'Billed yearly. Save 20%!' : 'Save 20% with annual billing'}
        </div>
        {/* Signup coming soon modal */}
        {showSignupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center relative dark:bg-gray-800">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold dark:text-white"
                onClick={() => setShowSignupModal(false)}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-[#312e81] dark:text-white break-words">
                Signup Coming Soon
              </h2>
              <p className="mb-4 text-[#312e81]/80 text-center dark:text-white/80">
                Paid plan signup and checkout is launching soon. For early access,{' '}
                <a
                  href="mailto:info@audiointel.com"
                  className="underline text-[#6366f1] dark:text-brand-blue"
                >
                  contact us
                </a>
                .
              </p>
              <button
                className="px-6 py-2 min-h-[44px] rounded-lg font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-colors dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                onClick={() => setShowSignupModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FAQ SECTION */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl w-full">
          {faqs.map((faq, i) => (
            <div key={i} className="mb-4 border-b border-[#ede9fe] dark:border-gray-700">
              <button
                className="w-full flex justify-between items-center py-4 text-lg font-semibold text-left text-[#312e81] focus:outline-none dark:text-white break-words"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                {faq.q}
                {openFaq === i ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>
              {openFaq === i && (
                <div className="pb-4 text-[#312e81]/80 text-base animate-in fade-in duration-300 dark:text-white/80 break-words">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DEMO FLOW SECTION (as modal for desktop, section for mobile) */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="fixed z-50 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <Dialog.Panel className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-8 z-10 dark:bg-gray-800">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold dark:text-white"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            {/* Email gating step */}
            {!userEmail ? (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-[#312e81] text-center dark:text-white">
                  Try Audio Intel Demo
                </h2>
                <p className="mb-4 text-[#312e81]/80 text-center dark:text-white/80">
                  Enter your email to access the free demo (no spam, just one-time access link).
                </p>
                <input
                  type="email"
                  className="border border-[#ede9fe] rounded-lg p-3 text-base mb-4 w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="you@email.com"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  autoFocus
                />
                <button
                  className="px-8 py-3 rounded-lg font-bold text-lg bg-[#6366f1] text-white shadow-lg hover:bg-[#818cf8] transition-transform mb-2 w-full max-w-xs dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                  onClick={async () => {
                    if (!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) return;
                    // Log email to analytics
                    fetch('/api/analytics', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        event: 'demo_email_collected',
                        data: { email: userEmail, timestamp: new Date().toISOString() },
                      }),
                    });
                    setShowEmail(false); // Hide any old email UI
                  }}
                  disabled={!userEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)}
                >
                  Continue to Demo
                </button>
                <div className="text-xs text-gray-400 mt-2 dark:text-white/80">
                  No spam. Required for demo access.
                </div>
                <div className="w-full flex flex-col items-center mt-6">
                  <div className="text-sm text-[#312e81]/80 dark:text-white/80 mb-2">
                    Want to sign up for the full experience?
                  </div>
                  <button
                    className="px-8 py-3 rounded-lg font-bold text-lg bg-[#6366f1] text-white shadow-lg hover:bg-[#818cf8] transition-transform w-full max-w-xs dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                    onClick={() => {
                      setModalOpen(false);
                      setPaymentPlan('starter');
                      setShowSignupModal(false);
                      setBillingCycle('monthly');
                      trackTrialStart('starter');
                    }}
                  >
                    Start 7-day Free Trial
                  </button>
                  <div className="text-xs text-gray-400 mt-2 dark:text-white/80 text-center">
                    7-day free trial. Credit card required. All features unlocked. You’ll be charged
                    automatically at the end of your trial unless you cancel. Cancel anytime. We’ll
                    send you a reminder before your trial ends.
                  </div>
                </div>
              </div>
            ) : (
              // Demo UI (existing modal content, but remove email input from results area)
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#312e81] text-center dark:text-white">
                  Try Audio Intel Free
                </h2>
                <p className="mb-6 text-[#312e81]/80 text-center max-w-xl dark:text-white/80">
                  Upload or paste up to 5 music industry emails and see real AI-powered enrichment
                  in action. No signup required.
                </p>
                <div className="w-full flex flex-col gap-4">
                  <div className="mb-2 text-[#6366f1] text-center font-semibold text-base dark:text-white">
                    Get exclusive music industry tips, new feature updates, and your free enrichment
                    results. No spam, unsubscribe anytime.
                  </div>
                  <input
                    type="email"
                    className="border border-[#ede9fe] rounded-lg p-3 text-base mb-2 w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your best email for results & tips"
                    value={userEmail}
                    onChange={e => setUserEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <FileUpload onFile={handleFile} />
                  <div className="text-center text-[#6366f1] font-semibold dark:text-white">
                    or paste emails below
                  </div>
                  <textarea
                    className="w-full border border-[#ede9fe] rounded-lg p-3 text-base font-mono mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={4}
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Paste up to 5 emails, one per line"
                    disabled={loading}
                  />
                  {showUpgrade && (
                    <div className="text-red-600 text-sm font-semibold mb-2 dark:text-white/80">
                      Free demo is limited to 5 contacts.{' '}
                      <span
                        className="underline cursor-pointer"
                        onClick={() =>
                          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                        }
                      >
                        See pricing
                      </span>{' '}
                      for more.
                    </div>
                  )}
                  <button
                    className="px-8 py-3 rounded-lg font-bold text-lg bg-[#6366f1] hover:bg-[#818cf8] text-white shadow-lg transition-transform focus:outline-none disabled:opacity-50 dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                    onClick={handleEnrich}
                    disabled={!userEmail || loading || contacts.length === 0 || showUpgrade}
                  >
                    {loading
                      ? 'Enriching...'
                      : `Enrich ${contacts.length} Contact${contacts.length !== 1 ? 's' : ''}`}
                  </button>
                  {loading && <ProgressBarWithDog current={progress} total={contacts.length} />}
                  {error && (
                    <div className="text-red-600 text-sm mt-2 dark:text-white/80">{error}</div>
                  )}
                  {enriched.length > 0 && !loading && (
                    <div className="mt-8 flex flex-col items-center">
                      <div className="mb-4 text-[#312e81] text-center font-semibold dark:text-white">
                        Want more than 5 enrichments? Unlock unlimited access and advanced features.
                      </div>
                      <button className="px-8 py-3 rounded-lg font-bold text-lg bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white shadow-lg hover:scale-105 transition-transform mb-2 dark:bg-brand-blue dark:hover:bg-brand-blue-dark">
                        Upgrade / Subscribe (Coming Soon)
                      </button>
                      <div className="text-xs text-[#6366f1] dark:text-white">
                        Payments powered by Stripe. Secure & instant access.
                      </div>
                    </div>
                  )}
                  {enriched.length > 0 && !loading && (
                    <div className="mt-6">
                      <h3 className="font-bold mb-2 text-[#312e81] dark:text-white">
                        Enriched Results
                      </h3>
                      {/* Prominent action buttons */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        <ExportButtons enriched={enriched} />
                        <button
                          className="px-6 py-2 rounded-lg font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-colors dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                          onClick={handleDownloadCsv}
                        >
                          Download CSV
                        </button>
                        <button
                          className="px-6 py-2 rounded-lg font-semibold bg-[#ede9fe] text-[#312e81] border border-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          onClick={() => setShowEmail(true)}
                        >
                          Send Results to Email
                        </button>
                      </div>
                      {/* Card-based results grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {enriched.map((c, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-[#ede9fe] dark:bg-gray-800 dark:border-gray-700"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <User className="w-6 h-6 text-[#6366f1]" />
                              <span className="font-bold text-lg text-[#312e81] dark:text-white">
                                {c.name || (
                                  <span className="text-gray-400 dark:text-gray-500">—</span>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[#6366f1] font-mono dark:text-white">
                              <Mail className="w-5 h-5" />
                              {c.email}
                            </div>
                            <div className="mt-2 text-[#312e81] whitespace-pre-wrap text-base dark:text-white">
                              {c.contactIntelligence}
                            </div>
                          </div>
                        ))}
                      </div>
                      {showEmail && (
                        <div className="mt-4 flex flex-col items-center">
                          <input
                            type="email"
                            className="border border-[#ede9fe] rounded-lg p-2 text-base mb-2 w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Enter your email"
                            value={userEmail}
                            onChange={e => setUserEmail(e.target.value)}
                            disabled={sendingEmail}
                          />
                          <button
                            className="px-6 py-2 rounded-lg font-semibold bg-[#6366f1] text-white hover:bg-[#818cf8] transition-colors dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
                            onClick={handleSendEmail}
                            disabled={sendingEmail || !userEmail}
                          >
                            {sendingEmail ? 'Sending...' : 'Send Email'}
                          </button>
                          {emailSent && (
                            <div className="text-green-600 text-sm mt-2 dark:text-white/80">
                              Email sent!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Payment modal for Stripe/PayPal */}
      {paymentPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center relative dark:bg-gray-800">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold dark:text-white"
              onClick={() => setPaymentPlan(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#312e81] dark:text-white">
              Subscribe to {paymentPlan.charAt(0).toUpperCase() + paymentPlan.slice(1)} Plan
            </h2>
            <input
              type="email"
              className="border border-[#ede9fe] rounded-lg p-3 text-base mb-4 w-full max-w-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your email"
              value={paymentEmail}
              onChange={e => setPaymentEmail(e.target.value)}
            />
            <div className="flex justify-center gap-4 mb-4">
              <button
                className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold border ${
                  billingCycle === 'monthly'
                    ? 'bg-[#6366f1] text-white dark:bg-gray-800 dark:text-white'
                    : 'bg-white text-[#6366f1] border-[#6366f1] dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 min-h-[44px] rounded-lg font-semibold border ${
                  billingCycle === 'annual'
                    ? 'bg-[#6366f1] text-white dark:bg-gray-800 dark:text-white'
                    : 'bg-white text-[#6366f1] border-[#6366f1] dark:bg-gray-800 dark:text-white dark:border-gray-600'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
              </button>
            </div>
            <button
              className="w-full py-3 rounded-lg font-bold text-lg bg-[#6366f1] text-white shadow-lg hover:bg-[#818cf8] transition-colors mb-2 dark:bg-brand-blue dark:hover:bg-brand-blue-dark"
              disabled={!paymentEmail || isPaying}
              onClick={async () => {
                setIsPaying(true);
                const priceIds = {
                  starter: {
                    monthly: 'price_1Ro9x2PqujcPv5fbMFNSIqq1', // Starter Monthly
                    annual: 'price_1Ro9x2PqujcPv5fbjvdTBDvE', // Starter Annual
                  },
                  professional: {
                    monthly: 'price_1Ro9yEPqujcPv5fbZKpcLIFT', // Professional Monthly
                    annual: 'price_1Ro9xiPqujcPv5fbutj97L7C', // Professional Annual
                  },
                  agency: {
                    monthly: 'price_1Ro9zrPqujcPv5fbmjN7bph6', // Agency Monthly
                    annual: 'price_1Ro9yePqujcPv5fb4PBXlwVb', // Agency Annual
                  },
                };
                if (paymentPlan && priceIds[paymentPlan]) {
                  let priceId = priceIds[paymentPlan][billingCycle];
                  let res: Response;
                  let data: any;
                  try {
                    res = await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ priceId, email: paymentEmail }),
                    });
                    data = await res.json();
                  } catch (err) {
                    setIsPaying(false);
                    alert('Network error');
                    return;
                  }
                  setIsPaying(false);
                  if (data && data.url) {
                    window.location.href = data.url;
                  } else {
                    alert((data && data.error) || 'Payment error');
                  }
                }
              }}
            >
              Pay with Card (Stripe)
            </button>
            <div className="my-2 text-[#312e81]/70 dark:text-white/80">or</div>
            <button
              className="w-full py-3 rounded-lg font-bold text-lg bg-[#ede9fe] text-[#312e81] border border-[#6366f1] hover:bg-[#6366f1] hover:text-white transition-colors mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              onClick={() => alert('PayPal integration coming soon!')}
            >
              Pay with PayPal
            </button>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white flex flex-col items-center dark:bg-gray-900 max-w-screen-xl mx-auto overflow-x-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-[#312e81] text-center dark:text-white break-words">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-4xl w-full">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-4 border-gray-300 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all dark:bg-gray-800 dark:border-gray-700"
            >
              <button
                className="w-full flex justify-between items-center text-lg font-black text-left text-[#312e81] focus:outline-none hover:text-[#6366f1] transition-colors duration-200 dark:text-white dark:hover:text-brand-blue"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                {faq.q}
                {openFaq === index ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>
              {openFaq === index && (
                <div className="mt-4 text-[#312e81]/80 dark:text-white/80 font-bold">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer with Cross-Promotion */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          {/* Cross-Promotion Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 border border-yellow-400/20 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 rounded-full p-3">
                  <Music className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#312e81] dark:text-white">
                    Need playlist curator discovery?
                  </h3>
                  <p className="text-[#312e81]/80 dark:text-white/80">
                    Try Playlist Pulse - our sister tool for finding and pitching playlist curators
                  </p>
                </div>
              </div>
              <Link
                href="https://pulse.totalaudiopromo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                onClick={() => trackCrossPromotionClick('playlist_pulse', 'footer')}
              >
                <span>Try Playlist Pulse</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#6366f1] rounded-full p-2">
                  <Image
                    src="/images/total_audio_promo_logo_trans.png"
                    alt="Total Audio Promo Mascot"
                    width={24}
                    height={24}
                    style={{ height: 24, width: 'auto' }}
                  />
                </div>
                <span className="text-xl font-bold text-[#312e81] dark:text-white">
                  Audio Intel
                </span>
              </div>
              <p className="text-[#312e81]/80 dark:text-white/80 mb-4">
                AI-powered music industry contact enrichment. Upload emails, get back detailed
                research, export anywhere.
              </p>
              <div className="flex items-center gap-4 text-sm text-[#312e81]/60 dark:text-white/60">
                <span>© 2024 Total Audio Promo</span>
                <span>•</span>
                <span>GDPR Compliant</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#312e81] dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-[#312e81]/80 dark:text-white/80">
                <li>
                  <a
                    href="#features"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Live Demo
                  </a>
                </li>
                <li>
                  <Link
                    href="/beta"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Start Free Trial
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#312e81] dark:text-white mb-4">Our Ecosystem</h4>
              <ul className="space-y-2 text-[#312e81]/80 dark:text-white/80">
                <li>
                  <Link
                    href="https://pulse.totalaudiopromo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                    onClick={() => trackCrossPromotionClick('playlist_pulse', 'footer_ecosystem')}
                  >
                    <Music className="w-4 h-4" />
                    <span>Playlist Pulse</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:info@audiointel.com"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#6366f1] dark:hover:text-brand-blue transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({
  icon,
  title,
  desc,
}) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-2">{icon}</div>
      <div className="font-bold text-lg mb-1">{title}</div>
      <div className="text-base text-[#312e81]/80 dark:text-white/80">{desc}</div>
    </div>
  );
};

const PricingCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  cta: string;
  highlight: boolean;
  onClick: () => void;
  showAnnualBadge?: boolean;
}> = ({ title, price, features, cta, highlight, onClick, showAnnualBadge }) => {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl p-8 shadow-lg border-2 ${
        highlight
          ? 'border-[#6366f1] bg-[#ede9fe] scale-105 z-10 dark:bg-gray-800'
          : 'border-[#ede9fe] bg-white dark:bg-gray-800 dark:border-gray-700'
      } transition-transform relative`}
    >
      {highlight && (
        <div className="mb-2 px-3 py-1 bg-[#6366f1] text-white text-xs rounded-full font-bold uppercase tracking-wider dark:bg-[#6366f1] dark:text-white">
          Most Popular
        </div>
      )}
      {showAnnualBadge && (
        <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-20 animate-bounce dark:bg-green-500 dark:text-white">
          Save 20%
        </div>
      )}
      <div className="text-2xl font-bold mb-2 text-[#312e81] dark:text-white">{title}</div>
      <div className="text-3xl font-extrabold mb-4 text-[#6366f1] dark:text-brand-blue">
        {price}
      </div>
      <ul className="mb-6 space-y-2 text-[#312e81]/90 dark:text-white">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#6366f1] dark:text-brand-blue" /> {f}
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-lg font-bold text-lg ${
          highlight
            ? 'bg-[#6366f1] text-white hover:bg-[#818cf8] dark:bg-brand-blue dark:text-white'
            : 'bg-white text-[#6366f1] border-2 border-[#6366f1] hover:bg-[#6366f1] hover:text-white dark:bg-gray-700 dark:text-white dark:border-gray-600'
        } shadow transition-colors mb-2`}
        onClick={onClick}
      >
        {cta}
      </button>
    </div>
  );
};

const StatCard: React.FC<{ stat: string; subtext: string }> = ({ stat, subtext }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-[#ede9fe] rounded-xl shadow-lg dark:bg-gray-800">
      <span className="text-3xl font-extrabold text-[#312e81] mb-2 dark:text-white">{stat}</span>
      <span className="text-base text-[#6366f1] dark:text-white">{subtext}</span>
    </div>
  );
};
