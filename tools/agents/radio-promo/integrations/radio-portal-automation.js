const path = require('path');
const os = require('os');
const fs = require('fs');
const { URL } = require('url');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

class RadioPortalAutomation {
  constructor(options = {}) {
    this.logFn =
      typeof options.log === 'function'
        ? options.log
        : (level, message, meta) => {
            const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
            const prefix = prefixMap[level] || 'ℹ️';
            if (meta !== undefined) {
              console.log(prefix, message, meta);
            } else {
              console.log(prefix, message);
            }
          };

    const cred = options.credentials || {};
    this.amazing = {
      username: cred.amazingUsername || process.env.AMAZING_RADIO_USERNAME || null,
      password: cred.amazingPassword || process.env.AMAZING_RADIO_PASSWORD || null,
    };
    this.wigwam = {
      username: cred.wigwamUsername || process.env.WIGWAM_USERNAME || null,
      password: cred.wigwamPassword || process.env.WIGWAM_PASSWORD || null,
    };

    const envLevels = (process.env.DISCORD_NOTIFY_LEVELS || '')
      .split(',')
      .map(level => level.trim().toLowerCase())
      .filter(Boolean);

    this.discord = {
      webhookUrl: options.discordWebhook || process.env.DISCORD_WEBHOOK_URL || null,
      levels:
        Array.isArray(options.discordLevels) && options.discordLevels.length > 0
          ? options.discordLevels.map(level => String(level).toLowerCase())
          : envLevels.length > 0
            ? envLevels
            : ['error', 'warn'],
    };

    this.launchOptions = options.launchOptions || {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  log(level, message, meta) {
    try {
      this.logFn(level, message, meta);
    } catch (error) {
      console.log(`[${level}]`, message, meta || '');
      console.log('Logger error fallback:', error.message);
    }

    this.sendDiscordNotification(level, message, meta);
  }

  async ensureSuccess(promise, context, { optional = false } = {}) {
    try {
      const result = await promise;
      if (!result && !optional) {
        throw new Error(`Required action failed: ${context}`);
      }
      if (!result && optional) {
        this.log('warn', `${context} skipped (optional action failed)`);
      }
      return result;
    } catch (error) {
      if (optional) {
        this.log('warn', `${context} skipped (optional error): ${error.message}`);
        return false;
      }
      throw new Error(`${context}: ${error.message || error}`);
    }
  }

  async sendDiscordNotification(level, message, meta) {
    if (!this.discord?.webhookUrl) return;
    if (!this.discord.levels.includes(level)) return;

    const colorMap = {
      error: 0xe74c3c,
      warn: 0xf1c40f,
      success: 0x2ecc71,
      info: 0x3498db,
    };

    try {
      let metaString = '';
      if (meta !== undefined) {
        if (typeof meta === 'string') {
          metaString = meta;
        } else {
          try {
            metaString = JSON.stringify(meta, null, 2);
          } catch (error) {
            metaString = String(meta);
          }
        }
      }

      const maxFieldLength = 900;
      if (metaString.length > maxFieldLength) {
        metaString = `${metaString.slice(0, maxFieldLength - 1)}…`;
      }

      const embed = {
        title: `${level.toUpperCase()} • Radio Portal Automation`,
        description: message,
        color: colorMap[level] || colorMap.info,
      };

      if (metaString.trim()) {
        embed.fields = [
          {
            name: 'Details',
            value: `\u0060\u0060\u0060\n${metaString}\n\u0060\u0060\u0060`,
          },
        ];
      }

      const payload = {
        username: 'Liberty Radio Agent',
        embeds: [embed],
      };

      const response = await fetch(this.discord.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook responded with ${response.status}`);
      }
    } catch (error) {
      console.log('⚠️ Discord notification failed:', error.message);
    }
  }

  hasAmazingCredentials() {
    return Boolean(this.amazing.username && this.amazing.password);
  }

  hasWigwamCredentials() {
    return Boolean(this.wigwam.username && this.wigwam.password);
  }

  async withBrowser(task) {
    const browser = await puppeteer.launch(this.launchOptions);
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);

    try {
      const result = await task(page, browser);
      await browser.close();
      return result;
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  async downloadAsset(url, prefix = 'asset') {
    if (!url) return null;

    try {
      const normalizedUrl = this.normalizeAssetUrl(url);
      const response = await fetch(normalizedUrl, { redirect: 'follow' });
      if (!response.ok) {
        throw new Error(`Failed to download asset (${response.status} ${response.statusText})`);
      }
      const contentType = response.headers.get('content-type') || '';
      const arrayBuffer = await response.arrayBuffer();
      if (contentType.includes('text/html')) {
        const textSample = arrayBuffer.slice(0, Math.min(arrayBuffer.byteLength, 2048));
        const text = Buffer.from(textSample).toString();
        if (/sign\s*in|login|required/i.test(text)) {
          throw new Error('Asset appears to require authentication');
        }
      }
      const buffer = Buffer.from(arrayBuffer);

      let extension = '';
      try {
        const parsed = new URL(normalizedUrl);
        extension = path.extname(parsed.pathname);
      } catch (error) {
        extension = '';
      }

      const filename = `${prefix}-${Date.now()}${extension}`;
      const filePath = path.join(os.tmpdir(), filename);
      await fs.promises.writeFile(filePath, buffer);
      return filePath;
    } catch (error) {
      this.log('warn', `Asset download failed for ${url}: ${error.message}`);
      return null;
    }
  }

  normalizeAssetUrl(originalUrl) {
    if (!originalUrl) return originalUrl;
    try {
      const url = new URL(originalUrl);
      const host = url.hostname.toLowerCase();

      if (host.includes('dropbox.com')) {
        if (!url.searchParams.get('dl')) {
          url.searchParams.set('dl', '1');
        }
        return url.toString();
      }

      if (host.includes('drive.google.com')) {
        // File links: /file/d/<id>/view
        const fileMatch = url.pathname.match(/\/file\/d\/([^/]+)\//);
        if (fileMatch && fileMatch[1]) {
          return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
        }

        // Sharing links like uc?id= already handled
        if (url.pathname.includes('/uc')) {
          url.searchParams.set('export', url.searchParams.get('export') || 'download');
          return url.toString();
        }

        // Folders cannot be downloaded directly - warn but keep original to attempt (likely fail)
        this.log(
          'warn',
          `Google Drive folder link detected; unable to auto-download: ${originalUrl}`
        );
        return originalUrl;
      }
    } catch (error) {
      return originalUrl;
    }

    return originalUrl;
  }

  async cleanupAssets(filePaths = []) {
    await Promise.all(
      filePaths.filter(Boolean).map(async file => {
        try {
          await fs.promises.unlink(file);
        } catch (error) {
          this.log('warn', `Failed to cleanup temp file ${file}: ${error.message}`);
        }
      })
    );
  }

  async findFieldSelectorByLabel(page, labelText) {
    if (!labelText) return null;
    const lowered = labelText.toLowerCase();

    return page.evaluate(text => {
      const matches = Array.from(document.querySelectorAll('label')).filter(label => {
        const content = (label.textContent || '').trim().toLowerCase();
        return content.includes(text);
      });

      for (const label of matches) {
        let field = null;
        if (label.htmlFor) {
          field =
            document.getElementById(label.htmlFor) || document.querySelector(`#${label.htmlFor}`);
        }
        if (!field) {
          field = label.querySelector('input, textarea, select');
        }
        if (!field) {
          let sibling = label.nextElementSibling;
          while (sibling) {
            if (sibling.matches && sibling.matches('input, textarea, select')) {
              field = sibling;
              break;
            }
            sibling = sibling.nextElementSibling;
          }
        }
        if (!field && label.parentElement) {
          const candidate = label.parentElement.querySelector('input, textarea, select');
          if (candidate) {
            field = candidate;
          }
        }

        if (field) {
          const attr = `agent-target-${Math.random().toString(36).slice(2)}`;
          field.setAttribute('data-agent-target', attr);
          return `[data-agent-target="${attr}"]`;
        }
      }
      return null;
    }, lowered);
  }

  async fillField(page, selectors, value, labelCandidates = []) {
    if (!value) return false;

    const candidateSelectors = Array.isArray(selectors) ? selectors : [selectors].filter(Boolean);

    for (const selector of candidateSelectors) {
      if (!selector) continue;
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        await page.click(selector, { clickCount: 3 });
        await page.type(selector, value, { delay: 30 });
        return true;
      } catch (error) {
        continue;
      }
    }

    for (const label of labelCandidates) {
      const selector = await this.findFieldSelectorByLabel(page, label);
      if (!selector) continue;
      try {
        await page.click(selector, { clickCount: 3 });
        await page.type(selector, value, { delay: 30 });
        await page.evaluate(sel => {
          const el = document.querySelector(sel);
          if (el) {
            el.removeAttribute('data-agent-target');
          }
        }, selector);
        return true;
      } catch (error) {
        continue;
      }
    }

    this.log('warn', `Unable to fill field for labels/selectors: ${labelCandidates.join(', ')}`);
    return false;
  }

  async selectOption(page, selectors, value, labelCandidates = []) {
    if (!value) return false;

    const candidateSelectors = Array.isArray(selectors) ? selectors : [selectors].filter(Boolean);
    for (const selector of candidateSelectors) {
      if (!selector) continue;
      try {
        await page.waitForSelector(selector, { timeout: 2000 });
        const didSelect = await page.select(selector, value);
        if (didSelect && didSelect.length) {
          return true;
        }

        const normalized =
          (await page.evaluate(
            (sel, target) => {
              const element = document.querySelector(sel);
              if (!element) return null;
              const options = Array.from(element.options || []);
              const lowerTarget = target.toLowerCase();
              const match =
                options.find(option => option.text.trim().toLowerCase() === lowerTarget) ||
                options.find(option => option.text.trim().toLowerCase().includes(lowerTarget)) ||
                options.find(option => option.value.trim().toLowerCase() === lowerTarget) ||
                options.find(option => option.value.trim().toLowerCase().includes(lowerTarget));
              if (match) {
                element.value = match.value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return match.value;
              }
              return null;
            },
            selector,
            value
          )) || null;

        if (normalized) {
          return true;
        }

        await page.type(selector, value, { delay: 30 });
        return true;
      } catch (error) {
        continue;
      }
    }

    for (const label of labelCandidates) {
      const selector = await this.findFieldSelectorByLabel(page, label);
      if (!selector) continue;
      try {
        await page.select(selector, value);
        await page.evaluate(sel => {
          const el = document.querySelector(sel);
          if (el) {
            el.removeAttribute('data-agent-target');
          }
        }, selector);
        return true;
      } catch (error) {
        try {
          await page.type(selector, value, { delay: 30 });
          await page.evaluate(sel => {
            const el = document.querySelector(sel);
            if (el) {
              el.removeAttribute('data-agent-target');
            }
          }, selector);
          return true;
        } catch (err) {
          continue;
        }
      }
    }

    this.log('warn', `Unable to select option for labels/selectors: ${labelCandidates.join(', ')}`);
    return false;
  }

  async uploadByLabel(page, filePath, labelCandidates) {
    if (!filePath) return false;

    for (const label of labelCandidates) {
      const selector = await this.findFieldSelectorByLabel(page, label);
      if (!selector) continue;
      try {
        const inputHandle = await page.$(selector);
        if (!inputHandle) continue;
        await inputHandle.uploadFile(filePath);
        await page.evaluate(sel => {
          const el = document.querySelector(sel);
          if (el) {
            el.removeAttribute('data-agent-target');
          }
        }, selector);
        return true;
      } catch (error) {
        continue;
      }
    }

    const generic = await page.$('input[type="file"]');
    if (generic) {
      try {
        await generic.uploadFile(filePath);
        return true;
      } catch (error) {
        this.log('warn', `Generic file upload failed: ${error.message}`);
      }
    }

    this.log('warn', `Unable to upload file for labels: ${labelCandidates.join(', ')}`);
    return false;
  }

  async setCheckbox(page, labelCandidates = [], checked = true) {
    for (const label of labelCandidates) {
      const selector = await this.findFieldSelectorByLabel(page, label);
      if (!selector) continue;
      try {
        await page.evaluate(
          (sel, value) => {
            const el = document.querySelector(sel);
            if (el) {
              el.checked = value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          },
          selector,
          checked
        );
        await page.evaluate(sel => {
          const el = document.querySelector(sel);
          if (el) {
            el.removeAttribute('data-agent-target');
          }
        }, selector);
        return true;
      } catch (error) {
        continue;
      }
    }

    this.log('warn', `Unable to toggle checkbox for labels: ${labelCandidates.join(', ')}`);
    return false;
  }

  async clickButton(page, textOptions = []) {
    for (const text of textOptions) {
      const success = await page.evaluate(buttonText => {
        const buttons = Array.from(
          document.querySelectorAll('button, input[type="submit"], a.button')
        );
        const target = buttons.find(btn =>
          (btn.textContent || btn.value || '')
            .trim()
            .toLowerCase()
            .includes(buttonText.toLowerCase())
        );
        if (target) {
          target.click();
          return true;
        }
        return false;
      }, text);
      if (success) {
        return true;
      }
    }

    try {
      const primaryButton = await page.$('button[type="submit"], input[type="submit"]');
      if (primaryButton) {
        await primaryButton.click();
        return true;
      }
    } catch (error) {
      this.log('warn', `Button click fallback failed: ${error.message}`);
    }

    this.log('warn', `Unable to click button for labels: ${textOptions.join(', ')}`);
    return false;
  }

  extractCampaignLocations(campaign) {
    const data = campaign.original?.data || {};
    const city =
      campaign.city || campaign.artistCity || data.artistCity || data['artist_city'] || '';
    const country =
      campaign.country ||
      campaign.artistCountry ||
      data.artistCountry ||
      data['artist_country'] ||
      '';
    return { city, country };
  }

  extractArtistBio(campaign) {
    const data = campaign.original?.data || {};
    return campaign.pressRelease || data.pressBio || data['press_bio'] || data['artistBio'] || '';
  }

  async prepareAssets(campaign) {
    const assets = {
      track: null,
      pressPhoto: null,
      artwork: null,
      cleanup: [],
    };

    const data = campaign.original?.data || {};
    const trackCandidates = [
      ...(campaign.downloadLinks || []),
      data.mp3Link,
      data['mp3_link'],
      data['audioFile'],
    ].filter(Boolean);
    if (trackCandidates.length > 0) {
      const trackFile = await this.downloadAsset(trackCandidates[0], 'track');
      if (trackFile) {
        assets.track = trackFile;
        assets.cleanup.push(trackFile);
      }
    }

    const pressCandidates = [
      data.pressPhoto,
      data['press_photo'],
      data['artist_photo'],
      data['pressImage'],
      campaign.pressReleaseLink,
    ].filter(Boolean);
    if (pressCandidates.length > 0) {
      const pressFile = await this.downloadAsset(pressCandidates[0], 'press');
      if (pressFile) {
        assets.pressPhoto = pressFile;
        assets.cleanup.push(pressFile);
      }
    }

    const artworkCandidates = [
      data.coverArt,
      data['cover_art'],
      data['artwork'],
      data['album_art'],
    ].filter(Boolean);
    if (artworkCandidates.length > 0) {
      const artworkFile = await this.downloadAsset(artworkCandidates[0], 'artwork');
      if (artworkFile) {
        assets.artwork = artworkFile;
        assets.cleanup.push(artworkFile);
      }
    }

    return assets;
  }

  async submitToAmazingRadio(campaign, preparedAssets = null) {
    if (!this.hasAmazingCredentials()) {
      this.log('warn', 'Amazing Radio credentials missing – cannot automate');
      return { success: false, skipped: true, reason: 'missing_credentials' };
    }

    const assets = preparedAssets || (await this.prepareAssets(campaign));

    try {
      const result = await this.withBrowser(async page => {
        const ensure = (promise, label, optional = false) =>
          this.ensureSuccess(promise, label, { optional });
        this.log('info', 'Logging into Amazing Radio');
        await page.goto('https://amazingradio.com/connect', { waitUntil: 'networkidle2' });
        await ensure(
          this.fillField(
            page,
            ['input[type="email"]', 'input[name="email"]', '#email'],
            this.amazing.username,
            ['Email']
          ),
          'Amazing Radio login email'
        );
        await ensure(
          this.fillField(
            page,
            ['input[type="password"]', 'input[name="password"]', '#password'],
            this.amazing.password,
            ['Password']
          ),
          'Amazing Radio login password'
        );
        await ensure(this.clickButton(page, ['Login', 'Sign in']), 'Amazing Radio login submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        this.log('info', 'Navigating to Amazing Radio artist creation');
        await page.goto('https://amazingradio.com/profile/liberty-music-pr/artists/new', {
          waitUntil: 'networkidle2',
        });

        const { city, country } = this.extractCampaignLocations(campaign);
        const bio = this.extractArtistBio(campaign);

        await ensure(
          this.fillField(
            page,
            [
              'input[name="displayName"]',
              'input[name="display_name"]',
              'input#artist_display_name',
            ],
            campaign.artistName,
            ['Display Name', 'Artist Name']
          ),
          'Amazing Radio display name'
        );
        await ensure(
          this.fillField(page, ['textarea[name="bio"]', '#bio', 'textarea#artist_bio'], bio, [
            'Bio',
            'Artist Biography',
          ]),
          'Amazing Radio bio'
        );
        await ensure(
          this.fillField(page, ['input[name="town"]', 'input[name="city"]', '#city'], city, [
            'Town',
            'City',
          ]),
          'Amazing Radio city'
        );
        await ensure(
          this.fillField(page, ['input[name="country"]', '#country'], country, ['Country']),
          'Amazing Radio country'
        );

        await ensure(
          this.clickButton(page, ['Create Artist', 'Save']),
          'Amazing Radio create artist'
        );
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});

        this.log('info', 'Filling track details for Amazing Radio');

        await ensure(
          this.fillField(
            page,
            ['input[name="title"]', 'input[name="trackTitle"]', '#title'],
            campaign.trackTitle,
            ['Track Title', 'Title']
          ),
          'Amazing Radio track title'
        );
        await ensure(
          this.fillField(
            page,
            ['input[name="isrc"]', '#isrc'],
            campaign.isrc || campaign.original?.data?.isrcCode || campaign.original?.data?.isrc,
            ['ISRC']
          ),
          'Amazing Radio ISRC'
        );
        await ensure(
          this.fillField(
            page,
            ['input[name="releaseDate"]', 'input[type="date"]', '#release_date'],
            campaign.releaseDate,
            ['Release Date']
          ),
          'Amazing Radio release date'
        );

        if (assets.pressPhoto) {
          await ensure(
            this.uploadByLabel(page, assets.pressPhoto, ['Press Photo', 'Artist Photo']),
            'Amazing Radio press photo upload',
            true
          );
        }
        if (assets.artwork) {
          await ensure(
            this.uploadByLabel(page, assets.artwork, ['Release Artwork', 'Cover Art']),
            'Amazing Radio artwork upload',
            true
          );
        }

        await ensure(
          this.uploadByLabel(page, assets.track, ['Upload Track', 'Audio File', 'Track Upload']),
          'Amazing Radio audio upload'
        );

        if (
          campaign.facebook ||
          campaign.instagram ||
          campaign.twitter ||
          (campaign.otherLinks && campaign.otherLinks.length)
        ) {
          this.log('info', 'Adding social links to Amazing Radio profile');
          await ensure(
            this.fillField(page, ['input[name="facebook"]', '#facebook'], campaign.facebook, [
              'Facebook',
            ]),
            'Amazing Radio facebook link',
            true
          );
          await ensure(
            this.fillField(page, ['input[name="instagram"]', '#instagram'], campaign.instagram, [
              'Instagram',
            ]),
            'Amazing Radio instagram link',
            true
          );
          await ensure(
            this.fillField(
              page,
              ['input[name="twitter"]', '#twitter', 'input[name="x"]'],
              campaign.twitter,
              ['Twitter', 'X']
            ),
            'Amazing Radio twitter link',
            true
          );
          if (campaign.otherLinks && campaign.otherLinks.length > 0) {
            await ensure(
              this.fillField(
                page,
                ['textarea[name="otherLinks"]', '#otherlinks', '#other_links'],
                campaign.otherLinks.join('\n'),
                ['Other Links', 'Additional Links']
              ),
              'Amazing Radio other links',
              true
            );
          }
        }

        await ensure(
          this.clickButton(page, ['Submit', 'Save', 'Finish']),
          'Amazing Radio submission button'
        );
        await this.sleep(5000);

        return {
          success: true,
          channel: 'amazing_radio_portal',
        };
      });

      this.log('success', 'Amazing Radio portal submission complete');
      return result;
    } catch (error) {
      this.log('error', `Amazing Radio portal submission failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      if (!preparedAssets && assets?.cleanup?.length) {
        await this.cleanupAssets(assets.cleanup);
      }
    }
  }

  async submitToRadioWigwam(campaign, preparedAssets = null) {
    if (!this.hasWigwamCredentials()) {
      this.log('warn', 'Radio Wigwam credentials missing – cannot automate');
      return { success: false, skipped: true, reason: 'missing_credentials' };
    }

    const assets = preparedAssets || (await this.prepareAssets(campaign));

    try {
      const result = await this.withBrowser(async page => {
        const ensure = (promise, label, optional = false) =>
          this.ensureSuccess(promise, label, { optional });
        this.log('info', 'Logging into Radio Wigwam');
        await page.goto('https://radiowigwam.co.uk/login/', { waitUntil: 'networkidle2' });
        await ensure(
          this.fillField(
            page,
            ['input[name="log"]', 'input[name="username"]', '#user_login'],
            this.wigwam.username,
            ['Username', 'Email']
          ),
          'Wigwam login username'
        );
        await ensure(
          this.fillField(
            page,
            ['input[name="pwd"]', 'input[name="password"]', '#user_pass'],
            this.wigwam.password,
            ['Password']
          ),
          'Wigwam login password'
        );
        await ensure(this.clickButton(page, ['Log In', 'Login']), 'Wigwam login submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        this.log('info', 'Navigating to Wigwam upload form');
        await page.goto('https://radiowigwam.co.uk/_useradmin/?uploadtrack=true', {
          waitUntil: 'networkidle2',
        });

        const { city, country } = this.extractCampaignLocations(campaign);
        const bio = this.extractArtistBio(campaign);

        await ensure(
          this.fillField(
            page,
            ['input[name="artist_name"]', 'input[name="band_name"]', '#artist_name'],
            campaign.artistName,
            ['Artist Name', 'Band/Artist Name', 'BAND NAME']
          ),
          'Wigwam artist name'
        );
        await ensure(
          this.fillField(page, ['textarea[name="artist_bio"]', '#artist_bio'], bio, [
            'Artist Bio',
            'Biography',
          ]),
          'Wigwam artist bio'
        );
        await ensure(
          this.fillField(page, ['input[name="artist_city"]', '#artist_city'], city, [
            'Town',
            'City',
          ]),
          'Wigwam city'
        );
        await ensure(
          this.fillField(page, ['input[name="artist_country"]', '#artist_country'], country, [
            'Country',
          ]),
          'Wigwam country'
        );
        if (campaign.genre) {
          await ensure(
            this.selectOption(
              page,
              ['select[name="artist_genre"]', '#artist_genre'],
              campaign.genre,
              ['Primary Genre', 'Genre', 'PRIMARY GENRE']
            ),
            'Wigwam artist genre'
          );
        }

        if (campaign.facebook || campaign.instagram || campaign.twitter) {
          await ensure(
            this.fillField(
              page,
              ['input[name="artist_facebook"]', '#artist_facebook'],
              campaign.facebook,
              ['Facebook']
            ),
            'Wigwam facebook link',
            true
          );
          await ensure(
            this.fillField(
              page,
              ['input[name="artist_instagram"]', '#artist_instagram'],
              campaign.instagram,
              ['Instagram']
            ),
            'Wigwam instagram link',
            true
          );
          await ensure(
            this.fillField(
              page,
              ['input[name="artist_twitter"]', '#artist_twitter'],
              campaign.twitter,
              ['Twitter', 'X']
            ),
            'Wigwam twitter link',
            true
          );
        }

        if (assets.pressPhoto) {
          await ensure(
            this.uploadByLabel(page, assets.pressPhoto, ['Artist Photo', 'Band Photo']),
            'Wigwam artist photo upload',
            true
          );
        }
        if (assets.artwork) {
          await ensure(
            this.uploadByLabel(page, assets.artwork, ['Artwork', 'Cover Art']),
            'Wigwam artwork upload',
            true
          );
        }

        await ensure(
          this.clickButton(page, ['Add Artist', 'Save Artist', 'ADD BAND']),
          'Wigwam add artist button'
        );
        await this.sleep(3000);

        await ensure(
          this.uploadByLabel(page, assets.track, [
            'Upload Track',
            'Audio File',
            'Song File',
            'CHOOSE FILE',
          ]),
          'Wigwam audio upload'
        );

        await ensure(
          this.selectOption(
            page,
            ['select[name="artist_select"]', 'select[name="choose_band"]', '#artist_select'],
            campaign.artistName,
            ['Choose Band', 'CHOOSE BAND']
          ),
          'Wigwam choose band'
        );
        await ensure(
          this.fillField(page, ['input[name="track_title"]', '#track_title'], campaign.trackTitle, [
            'Track Title',
            'Song Title',
            'TRACK TITLE',
          ]),
          'Wigwam track title'
        );
        if (campaign.genre) {
          await ensure(
            this.selectOption(
              page,
              ['select[name="track_genre"]', '#track_genre', 'select[name="primary_genre"]'],
              campaign.genre,
              ['Primary Genre', 'Genre', 'PRIMARY GENRE']
            ),
            'Wigwam track genre'
          );
        }
        await ensure(
          this.fillField(
            page,
            ['textarea[name="track_description"]', '#track_description'],
            campaign.pitch || '',
            ['Track Description', 'About the Track']
          ),
          'Wigwam track description',
          true
        );

        if (campaign.otherLinks && campaign.otherLinks.length > 0) {
          await ensure(
            this.fillField(
              page,
              ['textarea[name="other_links"]', '#other_links'],
              campaign.otherLinks.join('\n'),
              ['Other Links']
            ),
            'Wigwam other links',
            true
          );
        }

        await ensure(
          this.setCheckbox(
            page,
            ['I CERTIFY', 'certify', 'I certify that I am the artist associated with this track'],
            true
          ),
          'Wigwam certification checkbox'
        );

        await ensure(
          this.clickButton(page, [
            'Upload & Submit for Airplay',
            'Submit for Airplay',
            'Submit Track',
            'Upload Track',
          ]),
          'Wigwam submit button'
        );
        await this.sleep(5000);

        return {
          success: true,
          channel: 'radio_wigwam_portal',
        };
      });

      this.log('success', 'Radio Wigwam portal submission complete');
      return result;
    } catch (error) {
      this.log('error', `Radio Wigwam portal submission failed: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      if (!preparedAssets && assets?.cleanup?.length) {
        await this.cleanupAssets(assets.cleanup);
      }
    }
  }
}

module.exports = RadioPortalAutomation;
