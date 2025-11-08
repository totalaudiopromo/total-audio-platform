const { google } = require('googleapis');
const fs = require('fs');
const { Readable } = require('stream');

class DriveHelper {
  constructor(options = {}) {
    this.clientEmail = options.clientEmail;
    this.privateKey = (options.privateKey || '').replace(/\\n/g, '\n');
    this.rootFolderId = options.rootFolderId;
    this.logFn = typeof options.log === 'function' ? options.log : null;
    this.drive = null;
  }

  log(level, message, meta) {
    if (this.logFn) {
      try {
        this.logFn(level, message, meta);
        return;
      } catch (error) {
        // fall through to console
      }
    }
    const prefixMap = { info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' };
    const prefix = prefixMap[level] || 'ℹ️';
    if (meta !== undefined) {
      console.log(prefix, message, meta);
    } else {
      console.log(prefix, message);
    }
  }

  async ensureAuth() {
    if (this.drive) return this.drive;
    if (!this.clientEmail || !this.privateKey) {
      throw new Error('Google Drive credentials not configured');
    }

    this.log('info', 'Initializing Google Drive helper', {
      email: this.clientEmail,
      hasKey: Boolean(this.privateKey),
    });

    const scopes = ['https://www.googleapis.com/auth/drive'];
    const auth = new google.auth.JWT({
      email: this.clientEmail,
      key: this.privateKey,
      scopes,
    });

    await auth.authorize();
    this.drive = google.drive({ version: 'v3', auth });
    return this.drive;
  }

  async ensureFolder(parentId, folderName) {
    const drive = await this.ensureAuth();
    const trimmedName = folderName.trim();

    const query = [
      "mimeType = 'application/vnd.google-apps.folder'",
      'trashed = false',
      `'${parentId}' in parents`,
      `name = '${trimmedName.replace(/'/g, "\\'")}'`,
    ].join(' and ');

    const listResponse = await drive.files.list({
      q: query,
      spaces: 'drive',
      fields: 'files(id, name)',
      orderBy: 'createdTime desc',
      pageSize: 1,
    });

    const existing = listResponse.data.files && listResponse.data.files[0];
    if (existing) {
      return existing.id;
    }

    const createResponse = await drive.files.create({
      resource: {
        name: trimmedName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [parentId],
      },
      fields: 'id, name',
    });

    this.log('info', `Created Drive folder: ${trimmedName}`);
    return createResponse.data.id;
  }

  async uploadFile(parentId, name, mimeType, buffer) {
    const drive = await this.ensureAuth();

    const fileMetadata = {
      name,
      parents: [parentId],
    };

    const bodyStream =
      buffer instanceof fs.ReadStream
        ? buffer
        : Buffer.isBuffer(buffer)
        ? Readable.from(buffer)
        : Readable.from(Buffer.from(buffer));

    const media = {
      mimeType: mimeType || 'application/octet-stream',
      body: bodyStream,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, name, mimeType, webViewLink, webContentLink',
    });

    this.log('success', `Uploaded file to Drive: ${name}`);
    return response.data;
  }

  async findFiles(parentId, nameStartsWith) {
    const drive = await this.ensureAuth();
    const queryParts = ['trashed = false', `'${parentId}' in parents`];

    if (nameStartsWith) {
      queryParts.push(`name contains '${nameStartsWith.replace(/'/g, "\\'")}'`);
    }

    const resp = await drive.files.list({
      q: queryParts.join(' and '),
      spaces: 'drive',
      fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
      pageSize: 100,
    });

    return resp.data.files || [];
  }

  async downloadFile(fileId, destinationPath) {
    const drive = await this.ensureAuth();

    const dest = fs.createWriteStream(destinationPath);
    return new Promise((resolve, reject) => {
      drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
        if (err) {
          return reject(err);
        }
        res.data
          .on('end', () => resolve(destinationPath))
          .on('error', reject)
          .pipe(dest);
      });
    });
  }
}

module.exports = DriveHelper;
