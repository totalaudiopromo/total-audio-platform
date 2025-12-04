'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

// Force dynamic rendering for client-side state
export const dynamic = 'force-dynamic';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: 'How do I upload contacts?',
    answer:
      'Navigate to the enrichment page and click "Upload CSV". Your file should have columns for name, email (optional), and outlet/company. We\'ll enrich the rest automatically.',
    category: 'Getting Started',
  },
  {
    id: 2,
    question: 'What data gets enriched?',
    answer:
      'We find verified email addresses, social media profiles (Twitter/X, LinkedIn), recent activity, and outlet information. Our enrichment has a 100% success rate for contacts with public presence.',
    category: 'Features',
  },
  {
    id: 3,
    question: 'How long does enrichment take?',
    answer:
      'Usually 2-5 seconds per contact. Batch uploads process contacts in parallel, so even 100 contacts typically complete within a minute.',
    category: 'Features',
  },
  {
    id: 4,
    question: 'Can I export to other tools?',
    answer:
      'Yes! Export as CSV for any tool, or use one-click export to Pitch Generator for personalised outreach. Campaign Tracker integration coming soon.',
    category: 'Integration',
  },
  {
    id: 5,
    question: 'How does pricing work?',
    answer:
      'FREE tier: 10 enrichments/month. PRO (£19/month): 100 enrichments. AGENCY (£79/month): 500 enrichments + priority support.',
    category: 'Billing',
  },
  {
    id: 6,
    question: 'What file formats are supported?',
    answer:
      'CSV and Excel (.xlsx) files. Column headers should include name/contact and optionally email, outlet, or company.',
    category: 'Getting Started',
  },
  {
    id: 7,
    question: 'How do I connect to Pitch Generator?',
    answer:
      'Click "Export to Pitch Generator" on any enriched contact. Your contacts sync automatically through shared authentication.',
    category: 'Integration',
  },
  {
    id: 8,
    question: 'What if enrichment fails for a contact?',
    answer:
      'We return partial data when available. You can retry failed contacts, or contact support if issues persist. No enrichment credit is used for failures.',
    category: 'Troubleshooting',
  },
  {
    id: 9,
    question: 'How do I track campaign responses?',
    answer:
      'Export enriched contacts to Campaign Tracker to log submissions, track responses, and measure success rates against industry benchmarks.',
    category: 'Integration',
  },
  {
    id: 10,
    question: 'How do I cancel my subscription?',
    answer:
      'Go to Account Settings → Subscription → Cancel. Your access continues until the end of your billing period. No questions asked.',
    category: 'Billing',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Group FAQs by category
  const categories = Array.from(new Set(filteredFaqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/dashboard"
            className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4">Help Centre</h1>
          <p className="text-gray-600 font-bold mt-2">Find answers to common questions</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-4 border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
              aria-label="Search help articles"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm font-bold text-gray-600" aria-live="polite">
              {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white border-4 border-black rounded-xl p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 font-medium">
                Try a different search term or{' '}
                <Link href="/contact" className="text-blue-600 font-bold hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map(category => {
              const categoryFaqs = filteredFaqs.filter(faq => faq.category === category);

              return (
                <div key={category}>
                  {/* Category Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-900">{category}</h2>
                    <div className="h-1 w-16 bg-blue-600 mt-2 rounded-full" />
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4">
                    {categoryFaqs.map((faq, index) => {
                      const isOpen = openIndex === faq.id;

                      return (
                        <div key={faq.id}>
                          {isOpen ? (
                            // Open state
                            <div className="bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <button
                                onClick={() => toggleAccordion(faq.id)}
                                className="w-full text-left p-4 border-b-4 border-black hover:bg-gray-50 transition-colors"
                                aria-expanded="true"
                                aria-controls={`faq-answer-${faq.id}`}
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <span className="font-black text-gray-900">{faq.question}</span>
                                  <ChevronUp
                                    className="h-5 w-5 flex-shrink-0 text-gray-600 mt-0.5"
                                    aria-hidden="true"
                                  />
                                </div>
                              </button>
                              <div className="p-4" id={`faq-answer-${faq.id}`} role="region">
                                <p className="text-gray-700 font-medium leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          ) : (
                            // Closed state
                            <button
                              onClick={() => toggleAccordion(faq.id)}
                              className="w-full text-left p-4 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                              aria-expanded="false"
                              aria-controls={`faq-answer-${faq.id}`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <span className="font-black text-gray-900">{faq.question}</span>
                                <ChevronDown
                                  className="h-5 w-5 flex-shrink-0 text-gray-600 mt-0.5"
                                  aria-hidden="true"
                                />
                              </div>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Contact Support CTA */}
        <div className="mt-12 bg-blue-600 border-4 border-black rounded-xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-2xl font-black text-white mb-3">Still need help?</h3>
          <p className="text-white font-bold mb-6 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-white border-4 border-black rounded-xl font-black text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
          >
            Contact Support
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Link
            href="/demo"
            className="p-4 bg-white border-4 border-black rounded-xl font-bold text-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-center"
          >
            Try Enrichment
          </Link>
          <Link
            href="/pricing"
            className="p-4 bg-white border-4 border-black rounded-xl font-bold text-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-center"
          >
            View Pricing
          </Link>
          <Link
            href="/dashboard"
            className="p-4 bg-white border-4 border-black rounded-xl font-bold text-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-center"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
