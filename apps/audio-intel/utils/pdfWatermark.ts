import { jsPDF } from 'jspdf';

interface WatermarkConfig {
  text: string;
  opacity?: number;
  fontSize?: number;
  angle?: number;
  color?: [number, number, number];
  position?: 'center' | 'diagonal' | 'bottom';
}

interface PreviewConfig {
  watermark: WatermarkConfig;
  pageLimit?: number;
  quality?: 'low' | 'medium' | 'high';
  restrictFeatures?: string[];
}

const DEFAULT_WATERMARK: WatermarkConfig = {
  text: 'PREVIEW - Audio Intel Professional',
  opacity: 0.08,
  fontSize: 18,
  angle: -45,
  color: [150, 150, 150],
  position: 'diagonal',
};

/**
 * Adds professional watermark to PDF pages
 */
export function addWatermarkToPdf(doc: jsPDF, config: WatermarkConfig = DEFAULT_WATERMARK): void {
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addWatermarkToPage(doc, config);
  }
}

/**
 * Adds watermark to a single page
 */
function addWatermarkToPage(doc: jsPDF, config: WatermarkConfig): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Save current graphics state
  doc.saveGraphicsState();

  // Set watermark properties
  doc.setTextColor(config.color![0], config.color![1], config.color![2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(config.fontSize!);

  // Calculate transparency (jsPDF doesn't have native opacity, so we'll use light colors)
  const lightColor = config.color!.map(c =>
    Math.min(255, c + (255 - c) * (1 - config.opacity!))
  ) as [number, number, number];
  doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);

  switch (config.position) {
    case 'center':
      doc.text(config.text, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: config.angle,
      });
      break;

    case 'diagonal':
      // Single centered diagonal watermark (more subtle)
      doc.text(config.text, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: config.angle,
      });
      break;

    case 'bottom':
      doc.text(config.text, pageWidth / 2, pageHeight - 20, {
        align: 'center',
      });
      break;

    default:
      // Default to center
      doc.text(config.text, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: config.angle,
      });
  }

  // Restore graphics state
  doc.restoreGraphicsState();
}

/**
 * Creates preview-specific configuration
 */
export function createPreviewConfig(userTier: string = 'free'): PreviewConfig {
  const baseConfig: PreviewConfig = {
    watermark: DEFAULT_WATERMARK,
    pageLimit: 2,
    quality: 'medium',
    restrictFeatures: [],
  };

  switch (userTier) {
    case 'free':
      return {
        ...baseConfig,
        watermark: {
          ...DEFAULT_WATERMARK,
          text: 'Audio Intel Preview - Try Premium for Full Report',
          opacity: 0.12,
        },
        pageLimit: 1,
        quality: 'medium',
        restrictFeatures: ['email_delivery', 'white_label', 'full_analytics'],
      };

    case 'professional':
      return {
        watermark: {
          text: '',
          opacity: 0,
        },
        quality: 'high',
        restrictFeatures: ['white_label'], // White-label is Agency-only feature
      };

    case 'beta':
      // Beta users get full agency-level access during testing phase
      return {
        watermark: {
          text: '',
          opacity: 0,
        },
        quality: 'high',
        restrictFeatures: [],
      };

    case 'agency':
      // Agency gets full access, no restrictions
      return {
        watermark: {
          text: '',
          opacity: 0,
        },
        quality: 'high',
        restrictFeatures: [],
      };

    default:
      return baseConfig;
  }
}

/**
 * Professional upgrade messaging for different contexts
 */
export const UPGRADE_MESSAGES = {
  afterPreview: {
    title: 'Unlock Your Complete Professional Report',
    description:
      'Get the full report with all contacts, detailed analytics, and professional formatting.',
    cta: 'Upgrade to Professional',
    benefits: [
      'Complete multi-page reports',
      'No watermarks',
      'Email delivery',
      'Advanced analytics',
      'Priority support',
    ],
  },

  monthlyLimit: {
    title: "You've Used Your Free PDF This Month",
    description: 'Upgrade to Professional for unlimited PDF exports and premium features.',
    cta: 'Get Unlimited PDFs',
    benefits: [
      'Unlimited PDF exports',
      'Professional templates',
      'White-label options',
      'Advanced formatting',
      'Email automation',
    ],
  },

  whiteLabel: {
    title: 'Add Your Brand to Reports',
    description: 'Remove Audio Intel branding and add your company logo and colors.',
    cta: 'Upgrade to Agency',
    benefits: [
      'Custom branding',
      'Your logo and colors',
      'Client-ready reports',
      'White-label emails',
      'Agency dashboard',
    ],
  },

  qualityUpgrade: {
    title: 'Professional PDF Quality',
    description: 'Experience premium formatting, charts, and advanced layouts.',
    cta: 'See Professional Quality',
    benefits: [
      'Premium formatting',
      'Visual charts & graphs',
      'Advanced layouts',
      'High-resolution output',
      'Professional presentation',
    ],
  },
};

/**
 * Determines appropriate upgrade message based on user context
 */
export function getUpgradeMessage(
  context: string,
  userTier: string = 'free',
  additionalContext?: any
) {
  const baseMessage =
    UPGRADE_MESSAGES[context as keyof typeof UPGRADE_MESSAGES] || UPGRADE_MESSAGES.afterPreview;

  // Customize message based on user tier and context
  if (userTier === 'free' && context === 'afterPreview') {
    return {
      ...baseMessage,
      title: 'Unlock Professional PDF Reports',
      description:
        'Upgrade to Professional for complete reports, no watermarks, and premium features starting at £19/month.',
    };
  }

  if (userTier === 'professional' && context === 'whiteLabel') {
    return {
      ...baseMessage,
      title: 'Brand Your Reports',
      description:
        'Upgrade to Agency tier to add your logo, colors, and create client-ready reports.',
    };
  }

  return baseMessage;
}

/**
 * Conversion tracking for PDF upgrade flows
 */
export const PDF_CONVERSION_EVENTS = {
  PREVIEW_GENERATED: 'pdf_preview_generated',
  PREVIEW_DOWNLOADED: 'pdf_preview_downloaded',
  UPGRADE_PROMPT_SHOWN: 'pdf_upgrade_prompt_shown',
  UPGRADE_CLICKED: 'pdf_upgrade_clicked',
  FREE_PDF_USED: 'free_pdf_monthly_limit_used',
  PAYWALL_BOUNCE: 'pdf_paywall_bounce',
};

/**
 * Track conversion events for optimization
 */
export function trackPdfConversion(event: string, metadata: any = {}) {
  // Integration with your analytics system
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event, {
      event_category: 'pdf_conversion',
      event_label: metadata.userTier || 'unknown',
      value: metadata.conversionValue || 0,
      custom_parameters: metadata,
    });
  }

  console.log('PDF Conversion Event:', event, metadata);
}
