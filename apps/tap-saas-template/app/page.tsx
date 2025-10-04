import Link from 'next/link';
import { Sparkles, Zap, Clock, Target } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI That Sounds Human',
    description: 'No robotic pitches. Our AI writes natural, conversational emails that get responses.',
    color: 'brand-iris',
  },
  {
    icon: Target,
    title: 'Intel-Powered Personalization',
    description: 'Pulls from your contact database to create genuinely personal pitches, not generic templates.',
    color: 'brand-magenta',
  },
  {
    icon: Clock,
    title: 'Save 5+ Hours Per Campaign',
    description: 'Generate 50 personalized pitches in 20 minutes instead of spending hours on each one.',
    color: 'brand-amber',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Select a contact',
    description: 'Choose from your Audio Intel database or add contacts directly',
  },
  {
    step: '02',
    title: 'Add track details',
    description: 'Artist name, track title, and what makes it special',
  },
  {
    step: '03',
    title: 'Generate & send',
    description: 'AI creates a personalized pitch in 30 seconds. Copy and send.',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      {/* Hero */}
      <section className="glass-panel overflow-hidden px-6 py-16 sm:px-10 sm:py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="badge-postcraft">Pitch Generator · Total Audio Promo</span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Write 50 personalized pitches in
              <span className="block text-blue-600">
                20 minutes
              </span>
            </h1>
            <p className="max-w-xl text-base text-gray-600 sm:text-lg">
              Pitch Generator uses AI + your contact data to write professional music PR pitches 
              that actually get responses. No more staring at blank emails.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/auth/signin" className="cta-button">Start free trial →</Link>
              <Link href="#how-it-works" className="subtle-button">See how it works</Link>
            </div>
            <p className="text-sm text-gray-500">
              ⚡ Generate unlimited pitches • 🎯 Built for indie artists & PR agencies
            </p>
          </div>
          <div className="flex-1">
            <div className="relative">
              <div className="glass-panel px-8 py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gray-500">The Problem</p>
                <h2 className="mt-4 text-2xl font-bold">Stop wasting time on pitches</h2>
                <ul className="mt-6 space-y-4 text-sm text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>5+ hours per campaign writing personalized pitches</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>Generic ChatGPT outputs sound robotic and get ignored</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger" />
                    <span>You're copy-pasting templates and they feel impersonal</span>
                  </li>
                </ul>
                <div className="mt-6 rounded-lg border border-brand-iris/30 bg-brand-iris/10 px-4 py-3">
                  <p className="text-sm font-medium text-brand-iris">
                    Pitch Generator fixes all of this in 30 seconds per pitch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="glass-panel h-full px-6 py-8">
              <div className={`inline-flex rounded-full bg-${feature.color}/20 p-3`}>
                <Icon className={`h-6 w-6 text-${feature.color}`} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm text-white/70">{feature.description}</p>
            </div>
          );
        })}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">How It Works</p>
            <h2 className="text-3xl font-semibold">Three steps to perfect pitches</h2>
            <p className="text-sm text-white/70">
              No learning curve. No complicated setup. Just pick a contact, add your track info, 
              and let AI do the heavy lifting.
            </p>
          </div>
          <div className="flex-1">
            <ol className="space-y-4">
              {howItWorks.map((step) => (
                <li key={step.step} className="glass-panel flex items-start gap-4 px-5 py-5 sm:px-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-blue-500 text-sm font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {step.step}
                  </span>
                  <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">{step.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-gray-500">Built by Music PR Pros</p>
          <h2 className="mt-4 text-3xl font-semibold">Proven templates from 500+ campaigns</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Our templates are based on real pitches that got results for BBC Radio, Amazing Radio, 
            blogs, and playlists. We know what works because we've done it hundreds of times.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Ready to stop wasting hours on pitches?</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-600">
            Start your 7-day free trial. Generate unlimited pitches. No credit card required.
          </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/auth/signin" className="cta-button">Start free trial →</Link>
            <Link href="/pricing" className="subtle-button">View pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
