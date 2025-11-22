import axios from 'axios';
import * as cheerio from 'cheerio';
import { chromium, Browser, Page } from 'playwright';

interface FirecrawlConfig {
  apiKey: string;
  baseUrl: string;
}

interface ScrapingJob {
  url: string;
  options?: {
    includeHtml?: boolean;
    includeScreenshot?: boolean;
    includePdf?: boolean;
    waitForSelectors?: string[];
    scrollToBottom?: boolean;
    extractEmails?: boolean;
    extractPhones?: boolean;
    extractSocialMedia?: boolean;
    extractMetaData?: boolean;
    extractStructuredData?: boolean;
  };
}

interface ScrapingResult {
  success: boolean;
  data?: {
    html?: string;
    text?: string;
    screenshot?: string | undefined;
    pdf?: string;
    emails?: string[];
    phones?: string[];
    socialMedia?: {
      twitter?: string | undefined;
      linkedin?: string | undefined;
      facebook?: string | undefined;
      instagram?: string | undefined;
    };
    contactInfo?: {
      name?: string;
      email?: string;
      phone?: string | undefined;
      title?: string | undefined;
    }[];
    metaData?: {
      title?: string | undefined;
      description?: string | undefined;
      keywords?: string[];
      ogImage?: string | undefined;
      canonicalUrl?: string | undefined;
    };
    structuredData?: any;
  };
  error?: string;
}

export class FirecrawlService {
  private config: FirecrawlConfig;
  private browser: Browser | null = null;

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.firecrawl.dev',
    };
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
    }
    return this.browser;
  }

  async scrapeWebsite(url: string, options?: ScrapingJob['options']): Promise<ScrapingResult> {
    try {
      // Use Playwright for advanced scraping
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      // Set user agent to avoid detection
      await page.setExtraHTTPHeaders({
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      });

      // Set viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for specific selectors if provided
      if (options?.waitForSelectors) {
        for (const selector of options.waitForSelectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
          } catch (error) {
            console.log(`Selector ${selector} not found, continuing...`);
          }
        }
      }

      // Scroll to bottom if requested
      if (options?.scrollToBottom) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(2000);
      }

      const html = await page.content();
      const text = (await page.textContent('body')) || '';

      let screenshot: string | undefined;
      if (options?.includeScreenshot) {
        const screenshotBuffer = await page.screenshot({
          fullPage: true,
        });
        screenshot = screenshotBuffer.toString('base64');
      }

      await page.close();

      // Extract various types of information
      const contactInfo = await this.extractContactInfo(html);
      const metaData = options?.extractMetaData ? await this.extractMetaData(html) : undefined;
      const structuredData = options?.extractStructuredData
        ? await this.extractStructuredData(html)
        : undefined;

      // Build metaData object with only defined properties
      const metaDataObj: any = {};
      if (metaData) {
        if (metaData.title !== undefined) metaDataObj.title = metaData.title;
        if (metaData.description !== undefined) metaDataObj.description = metaData.description;
        if (metaData.keywords !== undefined) metaDataObj.keywords = metaData.keywords;
        if (metaData.ogImage !== undefined) metaDataObj.ogImage = metaData.ogImage;
        if (metaData.canonicalUrl !== undefined) metaDataObj.canonicalUrl = metaData.canonicalUrl;
      }
      return {
        success: true,
        data: {
          html,
          text,
          screenshot: screenshot || undefined,
          emails: contactInfo.emails,
          phones: contactInfo.phones,
          socialMedia: Object.fromEntries(
            Object.entries(contactInfo.socialMedia).filter(([_, v]) => v !== undefined)
          ),
          contactInfo: contactInfo.contacts.map(c => ({
            name: c.name,
            email: c.email,
            ...(c.phone !== undefined ? { phone: c.phone } : {}),
            ...(c.title !== undefined ? { title: c.title } : {}),
          })),
          ...(Object.keys(metaDataObj).length > 0 ? { metaData: metaDataObj } : {}),
          structuredData,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async extractContactInfo(html: string): Promise<{
    emails: string[];
    phones: string[];
    socialMedia: {
      twitter?: string;
      linkedin?: string;
      facebook?: string;
      instagram?: string;
    };
    contacts: Array<{
      name: string;
      email: string;
      phone?: string;
      title?: string;
    }>;
  }> {
    const $ = cheerio.load(html);

    // Extract emails using regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = html.match(emailRegex) || [];

    // Extract phone numbers with various formats
    const phoneRegex = /(\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})/g;
    const phones = html.match(phoneRegex) || [];

    // Extract social media links
    const socialMedia: any = {};
    const twitter = $('a[href*="twitter.com"]').attr('href');
    if (twitter !== undefined) socialMedia.twitter = twitter;
    const linkedin = $('a[href*="linkedin.com"]').attr('href');
    if (linkedin !== undefined) socialMedia.linkedin = linkedin;
    const facebook = $('a[href*="facebook.com"]').attr('href');
    if (facebook !== undefined) socialMedia.facebook = facebook;
    const instagram = $('a[href*="instagram.com"]').attr('href');
    if (instagram !== undefined) socialMedia.instagram = instagram;

    // Extract names and titles with improved regex
    const nameRegex = /([A-Z][a-z]+ [A-Z][a-z]+)/g;
    const names = html.match(nameRegex) || [];
    const titleRegex =
      /(Editor|Reporter|Journalist|Writer|Correspondent|Columnist|Manager|Director|CEO|CTO|Founder|President|Vice President|Senior|Lead)/gi;
    const titles = html.match(titleRegex) || [];

    // Create contact objects
    const contacts = emails
      .map((email, index) => {
        const contact: any = { name: names[index] || 'Unknown', email };
        if (phones[index] !== undefined) contact.phone = phones[index];
        if (titles[index] !== undefined) contact.title = titles[index];
        return contact;
      })
      .filter(contact => contact.name && contact.email);

    return {
      emails: [...new Set(emails)],
      phones: [...new Set(phones)],
      socialMedia,
      contacts,
    };
  }

  async extractMetaData(html: string): Promise<{
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  }> {
    const $ = cheerio.load(html);

    // metaData return
    const title = $('title').text() || $('meta[property="og:title"]').attr('content');
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content');
    const keywords = $('meta[name="keywords"]')
      .attr('content')
      ?.split(',')
      .map((k: string) => k.trim());
    const ogImage = $('meta[property="og:image"]').attr('content');
    const canonicalUrl = $('link[rel="canonical"]').attr('href');
    const meta: any = {};
    if (title !== undefined) meta.title = title;
    if (description !== undefined) meta.description = description;
    if (keywords !== undefined) meta.keywords = keywords;
    if (ogImage !== undefined) meta.ogImage = ogImage;
    if (canonicalUrl !== undefined) meta.canonicalUrl = canonicalUrl;
    return meta;
  }

  async extractStructuredData(html: string): Promise<any> {
    const $ = cheerio.load(html);
    const structuredData: any = {};

    // Extract JSON-LD structured data
    $('script[type="application/ld+json"]').each((index: number, element: any) => {
      try {
        const jsonData = JSON.parse($(element).html() || '{}');
        structuredData[`json-ld-${index}`] = jsonData;
      } catch (error) {
        console.log('Failed to parse JSON-LD data');
      }
    });

    return structuredData;
  }

  async scrapeJournalistContacts(websiteUrl: string): Promise<{
    success: boolean;
    contacts: Array<{
      name: string;
      email: string;
      phone?: string;
      title?: string;
      source: string;
    }>;
    error?: string;
  }> {
    try {
      const result = await this.scrapeWebsite(websiteUrl, {
        includeHtml: true,
        extractEmails: true,
        extractPhones: true,
        scrollToBottom: true,
      });

      if (!result.success || !result.data?.html) {
        return {
          success: false,
          contacts: [],
          error: result.error || 'Failed to scrape website',
        };
      }

      const contactInfo = await this.extractContactInfo(result.data.html);

      const contacts = contactInfo.contacts.map(contact => ({
        name: contact.name,
        email: contact.email,
        ...(contact.phone !== undefined ? { phone: contact.phone } : {}),
        ...(contact.title !== undefined ? { title: contact.title } : {}),
        source: websiteUrl,
      }));

      return {
        success: true,
        contacts,
      };
    } catch (error) {
      return {
        success: false,
        contacts: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async scrapeMultipleWebsites(urls: string[]): Promise<{
    success: boolean;
    results: Array<{
      url: string;
      success: boolean;
      contacts: Array<{
        name: string;
        email: string;
        phone?: string;
        title?: string;
      }>;
      error?: string;
    }>;
  }> {
    const results = [];

    for (const url of urls) {
      try {
        const result = await this.scrapeJournalistContacts(url);
        results.push({
          url,
          success: result.success,
          contacts: result.contacts,
          ...(result.error !== undefined ? { error: result.error } : {}),
        });
      } catch (error) {
        results.push({
          url,
          success: false,
          contacts: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      success: true,
      results,
    };
  }

  async scrapeWithCustomSelectors(
    url: string,
    selectors: {
      contactName?: string;
      contactEmail?: string;
      contactPhone?: string;
      contactTitle?: string;
    }
  ): Promise<{
    success: boolean;
    contacts: Array<{
      name: string;
      email: string;
      phone?: string;
      title?: string;
    }>;
    error?: string;
  }> {
    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle' });

      const contacts = [];

      if (selectors.contactName) {
        const names = await page.$$eval(selectors.contactName, (elements: any[]) =>
          elements.map((el: any) => el.textContent?.trim()).filter(Boolean)
        );

        const emails = selectors.contactEmail
          ? await page.$$eval(selectors.contactEmail, (elements: any[]) =>
              elements.map((el: any) => el.textContent?.trim()).filter(Boolean)
            )
          : [];

        const phones = selectors.contactPhone
          ? await page.$$eval(selectors.contactPhone, (elements: any[]) =>
              elements.map((el: any) => el.textContent?.trim()).filter(Boolean)
            )
          : [];

        const titles = selectors.contactTitle
          ? await page.$$eval(selectors.contactTitle, (elements: any[]) =>
              elements.map((el: any) => el.textContent?.trim()).filter(Boolean)
            )
          : [];

        for (let i = 0; i < names.length; i++) {
          contacts.push({
            name: names[i] || 'Unknown',
            email: emails[i] || '',
            phone: phones[i] || undefined,
            title: titles[i] || undefined,
          });
        }
      }

      await page.close();

      return {
        success: true,
        contacts,
      };
    } catch (error) {
      return {
        success: false,
        contacts: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
