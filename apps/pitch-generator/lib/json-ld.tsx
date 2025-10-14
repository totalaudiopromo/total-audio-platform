/**
 * JSON-LD structured data utilities for SEO
 * Helps search engines understand content context
 */

import React from 'react';

export interface BlogPostData {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  image?: string;
  url: string;
  keywords?: string[];
}

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

/**
 * Generate JSON-LD for blog article
 */
export function generateBlogPostJsonLd(data: BlogPostData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    image: data.image || `https://pitch.totalaudiopromo.com/og-pitch-generator.png`,
    datePublished: data.publishedDate,
    dateModified: data.modifiedDate || data.publishedDate,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Total Audio Promo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pitch.totalaudiopromo.com/total_audio_promo_logo_trans.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    ...(data.keywords && { keywords: data.keywords.join(', ') }),
  };
}

/**
 * Generate JSON-LD for organization
 */
export function generateOrganizationJsonLd(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}

/**
 * Generate JSON-LD for website
 */
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pitch Generator',
    url: 'https://pitch.totalaudiopromo.com',
    description: 'AI-powered pitch generation for music industry professionals',
    publisher: {
      '@type': 'Organization',
      name: 'Total Audio Promo',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pitch.totalaudiopromo.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD for software application
 */
export function generateSoftwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pitch Generator',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '12.00',
      priceCurrency: 'GBP',
      priceValidUntil: '2026-12-31',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    operatingSystem: 'Web',
    description: 'Generate professional music industry pitches in seconds with AI',
    url: 'https://pitch.totalaudiopromo.com',
  };
}

/**
 * Generate JSON-LD for breadcrumbs
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD for FAQ page
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD for How-To guide
 */
export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function generateHowToJsonLd(data: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    ...(data.totalTime && { totalTime: data.totalTime }),
    ...(data.image && { image: data.image }),
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
    })),
  };
}

/**
 * Component to render JSON-LD script tag
 */
export function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
