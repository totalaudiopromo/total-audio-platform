import { chromium, Browser, BrowserContext, Page } from 'playwright';

interface PlaywrightConfig {
  headless?: boolean;
  slowMo?: number;
  timeout?: number;
}

interface ScreenshotOptions {
  fullPage?: boolean;
  path?: string;
  quality?: number;
  type?: 'png' | 'jpeg';
}

interface ScrapingOptions {
  waitForSelector?: string;
  waitForTimeout?: number;
  scrollToBottom?: boolean;
  extractText?: boolean;
  extractLinks?: boolean;
  extractImages?: boolean;
}

interface ScrapingResult {
  success: boolean;
  data?: {
    html?: string;
    text?: string;
    links?: string[];
    images?: string[];
    screenshot?: string;
  };
  error?: string;
}

export class PlaywrightService {
  private config: PlaywrightConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;

  constructor(config?: PlaywrightConfig) {
    this.config = config || {};
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      const launchOptions: any = {
        headless: this.config.headless ?? true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      };

      if (this.config.slowMo !== undefined) {
        launchOptions.slowMo = this.config.slowMo;
      }

      this.browser = await chromium.launch(launchOptions);
    }
    return this.browser;
  }

  private async getContext(): Promise<BrowserContext> {
    if (!this.context) {
      const browser = await this.getBrowser();
      this.context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      });
    }
    return this.context;
  }

  async takeScreenshot(
    url: string,
    options?: ScreenshotOptions
  ): Promise<{
    success: boolean;
    screenshot?: string;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      const screenshot = await page.screenshot();

      await page.close();

      return {
        success: true,
        screenshot: screenshot.toString('base64'),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async scrapeWebsite(url: string, options?: ScrapingOptions): Promise<ScrapingResult> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout ?? 30000,
      });

      // Wait for specific selector if provided
      if (options?.waitForSelector) {
        await page.waitForSelector(options.waitForSelector, { timeout: 10000 });
      }

      // Wait for timeout if provided
      if (options?.waitForTimeout) {
        await page.waitForTimeout(options.waitForTimeout);
      }

      // Scroll to bottom if requested
      if (options?.scrollToBottom) {
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        await page.waitForTimeout(2000);
      }

      const html = await page.content();
      const text = options?.extractText ? (await page.textContent('body')) || '' : '';

      let links: string[] = [];
      if (options?.extractLinks) {
        links = await page.$$eval('a[href]', (elements: any[]) =>
          elements
            .map((el: any) => el.href)
            .filter((href: string) => href && href.startsWith('http'))
        );
      }

      let images: string[] = [];
      if (options?.extractImages) {
        images = await page.$$eval('img[src]', (elements: any[]) =>
          elements.map((el: any) => el.src).filter((src: string) => src && src.startsWith('http'))
        );
      }

      const screenshot = await page.screenshot({
        fullPage: true,
      });

      await page.close();

      return {
        success: true,
        data: {
          html,
          text,
          links,
          images,
          screenshot: screenshot.toString('base64'),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async fillForm(
    url: string,
    formData: Record<string, string>
  ): Promise<{
    success: boolean;
    result?: string;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      // Fill form fields
      for (const [selector, value] of Object.entries(formData)) {
        await page.fill(selector, value);
      }

      // Submit form
      await page.click('input[type="submit"], button[type="submit"]');

      // Wait for response
      await page.waitForLoadState('networkidle');

      const result = await page.evaluate(() => {
        return document.body.innerText;
      });

      await page.close();

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async clickElement(
    url: string,
    selector: string
  ): Promise<{
    success: boolean;
    result?: string;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      await page.click(selector);

      // Wait for any navigation or state changes
      await page.waitForLoadState('networkidle');

      const result = await page.evaluate(() => {
        return document.body.innerText;
      });

      await page.close();

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async extractText(url: string): Promise<{
    success: boolean;
    text?: string;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      const text = await page.evaluate(() => {
        return document.body.innerText;
      });

      await page.close();

      return {
        success: true,
        text,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async extractLinks(url: string): Promise<{
    success: boolean;
    links?: string[];
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      const links = await page.evaluate(() => {
        const anchors = document.querySelectorAll('a');
        return Array.from(anchors).map(a => a.href);
      });

      await page.close();

      return {
        success: true,
        links,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async waitForElement(
    url: string,
    selector: string,
    timeout?: number
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      await page.waitForSelector(selector, { timeout: timeout || 10000 });

      await page.close();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async evaluateJavaScript(
    url: string,
    script: string
  ): Promise<{
    success: boolean;
    result?: any;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout ?? 30000,
      });

      const result = await page.evaluate(script);

      await page.close();

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async scrollPage(
    url: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const context = await this.getContext();
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.config.timeout || 30000,
      });

      const scrollAmount = 500;

      switch (direction) {
        case 'down':
          await page.evaluate(() => window.scrollBy(0, 500));
          break;
        case 'up':
          await page.evaluate(() => window.scrollBy(0, -500));
          break;
        case 'right':
          await page.evaluate(() => window.scrollBy(500, 0));
          break;
        case 'left':
          await page.evaluate(() => window.scrollBy(-500, 0));
          break;
      }

      await page.close();

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
