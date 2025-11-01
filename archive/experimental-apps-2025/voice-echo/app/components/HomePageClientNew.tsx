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

// Preserve all existing data and functions
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
    q: 'How accurate is the contact intelligence?',
    a: 'We use a combination of AI, public data, and manual verification to ensure 90%+ accuracy. Each profile includes a research confidence score.',
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
    a: 'Absolutely. Export to CSV, Excel, or Airtable and import into any CRM or spreadsheet.',
  },
  {
    q: 'Is my data secure and GDPR compliant?',
    a: 'Yes, we are fully GDPR compliant and your data is encrypted at rest and in transit. We never share your lists.',
  },
  {
    q: 'What happens after my free credits are used?',
    a: "You can upgrade to a paid plan at any time. Your data and enriched contacts remain accessible even if you don't upgrade.",
  },
];

// Analytics functions
function trackEvent(event: string, data: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, data);
  }
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data: { ...data, timestamp: new Date().toISOString() } }),
  });
}

function trackEnrichment(contactCount: number, processingTime: number) {
  trackEvent('enrichment_completed', { contactCount, processingTime });
}

function trackPricingView(plan: string) {
  trackEvent('pricing_view', { plan });
}

function trackTrialStart(plan: string) {
  trackEvent('trial_start', { plan });
}

function trackFileUpload(fileType: string, contactCount: number) {
  trackEvent('file_upload', { fileType, contactCount });
}

function trackExport(format: string, enrichedCount: number) {
  trackEvent('export', { format, enrichedCount });
}

type ErrorType = 'api_failure' | 'upload_error' | 'enrichment_error' | 'download_error';
function trackError(errorType: ErrorType, details: string) {
  trackEvent('error', { errorType, details });
}

function trackCrossPromotionClick(target: string, location: string) {
  trackEvent('cross_promotion_click', { target, location });
}

export default function HomePageClient() {
  // Preserve all existing state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
  const [paymentPlan, setPaymentPlan] = useState<'starter' | 'professional' | 'agency' | null>(
    null
  );
  const [paymentEmail, setPaymentEmail] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isPaying, setIsPaying] = useState(false);
  const [pricingMode, setPricingMode] = useState<'monthly' | 'yearly'>('monthly');
  const [currentGradient, setCurrentGradient] = useState('DRS_4K_Luma Gradient_15.jpg');
  const [currentTexture, setCurrentTexture] = useState('DRS_MagazineTexture_8K_52.jpg');

  // Preserve all existing handlers
  const handleFile = async (file: File) => {
    const text = await file.text();
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

  const handleEnrich = async () => {
    setLoading(true);
    setError(null);
    setEnriched([]);
    setProgress(0);
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
        const resp = await fetch('/api/enrich', {
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
      trackEnrichment(total, total * 100);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      trackError('enrichment_error', err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const generateCsv = (data: any[]) => {
    const headers = ['Name', 'Email', 'Contact Intelligence'];
    const rows = data.map(row => [row.name, row.email, row.contactIntelligence]);
    const csv = [headers, ...rows]
      .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');
    return csv;
  };

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

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailSent(false);
    setError(null);
    try {
      const csv = generateCsv(enriched);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      setCsvUrl(url);
      const downloadUrl = url;
      const resp = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, downloadUrl, count: enriched.length }),
      });
      const data = await resp.json();
      if (data.success) {
        setEmailSent(true);
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

  React.useEffect(() => {
    if (enriched.length > 0) {
      trackEnrichment(enriched.length, enriched.length * 100);
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 mb-10 leading-tight">
              Audio{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Intel
              </span>
              :
              <br />
              <span className="font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Stop Wasting
              </span>{' '}
              <span className="font-black bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                15 Hours a Week
              </span>
              <br />
              Researching Music Contacts
            </h1>

            <p className="text-2xl sm:text-3xl text-gray-700 mb-16 max-w-5xl mx-auto leading-relaxed font-bold">
              Transform basic email lists into music industry intelligence with AI-powered contact
              enrichment. Get playlist curators, radio DJs, and music bloggers with submission
              guidelines, contact preferences, and pitch-ready insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-24">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl px-12 py-8 text-2xl font-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-3 border-black hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
                onClick={() => {
                  setModalOpen(true);
                  trackEvent('demo_button_click');
                }}
              >
                <Play className="w-8 h-8 mr-4" />
                Try Demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl border-4 border-black px-12 py-8 text-2xl font-black hover:bg-black hover:text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-white"
                onClick={() => {
                  if (howItWorksRef.current) {
                    howItWorksRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                See How It Works
                <ArrowRight className="w-8 h-8 ml-4" />
              </Button>
            </div>

            {/* Demo Transformation */}
            <Card className="max-w-6xl mx-auto rounded-3xl shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden bg-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-white p-12 sm:p-20">
                <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-16 items-center">
                  {/* Before */}
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="mb-8 rounded-full px-8 py-3 text-lg font-black border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    >
                      BEFORE
                    </Badge>
                    <Card className="p-10 bg-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      <div className="text-gray-900 font-mono text-2xl font-bold">
                        john@bbc.co.uk
                      </div>
                    </Card>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-3 border-black hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      <ArrowRight className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="text-center">
                    <Badge className="mb-8 rounded-full px-8 py-3 text-lg font-black bg-gradient-to-r from-blue-500 to-blue-600 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      AFTER
                    </Badge>
                    <Card className="p-10 bg-white rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-left hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                      <div className="space-y-5">
                        <div className="flex items-center gap-4">
                          <Music className="w-6 h-6 text-blue-500" />
                          <span className="font-black text-xl">
                            BBC Radio 1 | National Public Service
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Target className="w-6 h-6 text-red-500" />
                          <span className="font-bold text-lg">
                            UK National Coverage | High Reach
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Mail className="w-6 h-6 text-orange-500" />
                          <span className="font-bold text-lg">
                            Email: Weekday mornings preferred
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Users className="w-6 h-6 text-purple-500" />
                          <span className="font-bold text-lg">
                            Focus: New UK artists, breaking acts
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Zap className="w-6 h-6 text-yellow-500" />
                          <span className="font-bold text-lg">
                            Tip: Include streaming numbers + press quote
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Check className="w-6 h-6 text-green-500" />
                          <span className="font-black text-xl">Research Confidence: High</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
              Trusted by Music Industry Professionals
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <Card className="p-10 text-center rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
              <div className="text-6xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-200">
                517+
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Contacts Enriched</div>
              <div className="text-base font-bold text-gray-600">
                Real radio DJs, playlist curators, and music bloggers
              </div>
            </Card>

            <Card className="p-10 text-center rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
              <div className="text-6xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-200">
                210+
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Radio Stations</div>
              <div className="text-base font-bold text-gray-600">
                BBC, commercial, and independent stations mapped
              </div>
            </Card>

            <Card className="p-10 text-center rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
              <div className="text-6xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-200">
                90%
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Data Accuracy</div>
              <div className="text-base font-bold text-gray-600">
                Verified contact intelligence you can trust
              </div>
            </Card>

            <Card className="p-10 text-center rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-6px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
              <div className="text-6xl font-black text-gray-900 mb-4 group-hover:scale-110 transition-transform duration-200">
                15
              </div>
              <div className="text-2xl font-black text-gray-700 mb-4">Hours Saved</div>
              <div className="text-base font-bold text-gray-600">
                Average time saved per week on contact research
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-16">
              The Music Industry Contact Research Nightmare
            </h2>

            <div className="grid md:grid-cols-3 gap-10 mb-20">
              <Card className="p-12 text-center rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-8px] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-3 border-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                  Spending hours researching playlist curators and radio contacts manually
                </h3>
              </Card>

              <Card className="p-12 text-center rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-8px] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-3 border-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Mail className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                  Missing crucial submission guidelines and contact preferences
                </h3>
              </Card>

              <Card className="p-12 text-center rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white hover:translate-y-[-8px] hover:shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-3 border-black group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                  Cold pitching without knowing their music taste or recent activity
                </h3>
              </Card>
            </div>

            <Card className="max-w-6xl mx-auto p-16 rounded-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-gradient-to-br from-gray-50 to-white hover:translate-y-[-4px] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <p className="text-3xl font-black text-gray-800 leading-relaxed">
                Music PR professionals waste 15+ hours per week on contact research that AI can do
                in minutes. Meanwhile, your competition is already pitching while you're still
                googling.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-2xl shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Try Audio Intel Demo</h2>
              <p className="text-xl text-gray-700">
                Upload your email list and see the magic happen
              </p>
            </div>

            <FileUpload onFile={handleFile} />

            <div className="mt-8">
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Or paste emails here (one per line)"
                className="w-full p-4 border-4 border-black rounded-2xl font-mono text-lg resize-none"
                rows={5}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleEnrich}
                disabled={loading || !contacts.length}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl px-8 py-4 text-xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-3 border-black hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {loading ? 'Processing...' : 'Enrich Contacts'}
              </Button>
            </div>

            {loading && (
              <div className="mt-8">
                <ProgressBarWithDog current={progress} total={contacts.length} />
              </div>
            )}

            {enriched.length > 0 && (
              <div className="mt-8">
                <ExportButtons
                  enriched={enriched}
                  onExport={(format, count) => {
                    if (format === 'csv') {
                      handleDownloadCsv();
                    } else if (format === 'excel') {
                      handleSendEmail();
                    }
                  }}
                />
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setModalOpen(false)}
                variant="outline"
                className="rounded-2xl border-3 border-black font-black px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Footer */}
      <footer className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="p-10 rounded-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-4 border-black bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-6 md:mb-0">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-3 border-black">
                  <span className="text-white font-black text-2xl">A</span>
                </div>
                <span className="text-3xl font-black text-gray-900">Audio Intel</span>
              </div>

              <div className="text-center md:text-right">
                <p className="text-gray-600 font-black text-lg mb-2">Powered by Audio Intel</p>
                <p className="text-base font-bold text-gray-500">
                  © 2024 Audio Intel. All rights reserved.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </footer>
    </div>
  );
}
