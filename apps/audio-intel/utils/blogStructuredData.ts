/**
 * Generate structured data (JSON-LD) for blog posts
 * Improves SEO with rich snippets in search results
 */

interface BlogStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  imageUrl?: string;
}

export function generateBlogStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  imageUrl = 'https://intel.totalaudiopromo.com/og-image.jpg'
}: BlogStructuredDataProps) {
  const url = `https://intel.totalaudiopromo.com/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": "Chris Schofield",
      "url": "https://intel.totalaudiopromo.com/about",
      "jobTitle": "Founder & Radio Promoter",
      "sameAs": [
        "https://twitter.com/chrisschouk",
        "https://www.linkedin.com/in/chris-schofield-audio"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Total Audio Promo",
      "url": "https://intel.totalaudiopromo.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://intel.totalaudiopromo.com/images/total_audio_promo_logo_trans.png"
      }
    },
    "image": imageUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": "Music Industry Contact Intelligence",
    "keywords": "music industry contacts, contact enrichment, radio promotion, playlist pitching, music PR",
    "inLanguage": "en-GB",
    "isAccessibleForFree": true
  };
}

// Blog post metadata for structured data
export const blogPostsMetadata = {
  "bbc-radio-1-contact-enrichment": {
    datePublished: "2025-01-10",
    description: "Complete guide to enriching BBC Radio 1 contacts for radio promotion campaigns. Get accurate contact information for Greg James, Annie Mac, and more."
  },
  "bbc-radio-1xtra-contact-enrichment": {
    datePublished: "2025-01-10",
    description: "Enrich BBC Radio 1Xtra contacts for urban, grime, and hip-hop music campaigns. Get accurate DJ and presenter information."
  },
  "bbc-radio-2-contact-enrichment": {
    datePublished: "2025-01-10",
    description: "BBC Radio 2 contact enrichment guide for mainstream music campaigns. Reach the right presenters and producers."
  },
  "bbc-radio-6-music-contact-enrichment": {
    datePublished: "2025-01-10",
    description: "BBC Radio 6 Music contact intelligence for alternative and indie music campaigns. Connect with the right presenters."
  },
  "spotify-editorial-playlist-contacts": {
    datePublished: "2025-01-12",
    description: "Complete guide to Spotify editorial playlist contacts and submission process. Increase your chances of playlist placement."
  },
  "apple-music-editorial-contacts": {
    datePublished: "2025-01-12",
    description: "Apple Music editorial contact information and playlist submission guidelines for independent artists."
  },
  "kerrang-radio-contact-enrichment": {
    datePublished: "2025-01-11",
    description: "Kerrang! Radio contact enrichment for rock and metal music campaigns. Get accurate presenter contact information."
  },
  "absolute-radio-contact-enrichment": {
    datePublished: "2025-01-11",
    description: "Absolute Radio contact intelligence for rock and alternative music campaigns. Connect with the right team."
  },
  "music-contact-enrichment-guide": {
    datePublished: "2025-01-08",
    description: "Complete guide to music industry contact enrichment. Learn how to research and organize contacts efficiently."
  },
  "radio-promotion-tips": {
    datePublished: "2025-01-08",
    description: "Essential radio promotion tips for independent artists. Learn from 5+ years of BBC Radio 1 pitch experience."
  },
  "playlist-promotion-mistakes": {
    datePublished: "2025-01-09",
    description: "Common playlist promotion mistakes and how to avoid them. Save time and improve your success rate."
  },
  "music-industry-contacts": {
    datePublished: "2025-01-08",
    description: "Comprehensive guide to finding and organizing music industry contacts for promotion campaigns."
  }
};
