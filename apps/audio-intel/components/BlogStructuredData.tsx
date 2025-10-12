import Script from 'next/script';

interface BlogStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
  imageUrl?: string;
}

export function BlogStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  slug,
  imageUrl = 'https://intel.totalaudiopromo.com/og-image.jpg'
}: BlogStructuredDataProps) {
  const url = `https://intel.totalaudiopromo.com/blog/${slug}`;

  const structuredData = {
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
      "jobTitle": "Founder & Radio Promoter"
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
    "inLanguage": "en-GB"
  };

  return (
    <Script
      id={`blog-structured-data-${slug}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
