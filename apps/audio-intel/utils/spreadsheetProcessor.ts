// 🟢 DATA PROCESSING: Multi-Agent Spreadsheet Cleanup System
// Inspired by OneRedOak workflow automation patterns

import * as XLSX from 'xlsx';

export interface SpreadsheetFile {
  name: string;
  data: any[][];
  headers: string[];
  detectedColumns: ColumnMapping;
  issues: DataIssue[];
  confidence: number;
}

export interface ColumnMapping {
  email?: number;
  name?: number;
  firstName?: number;
  lastName?: number;
  company?: number;
  phone?: number;
  website?: number;
  twitter?: number;
  instagram?: number;
  role?: number;
  notes?: number;
  unknown: number[];
}

export interface DataIssue {
  type: 'empty_column' | 'duplicate_header' | 'format_issue' | 'missing_data' | 'suspicious_data';
  severity: 'low' | 'medium' | 'high';
  description: string;
  row?: number;
  column?: number;
  suggestion?: string;
}

export interface ProcessedContact {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  role?: string;
  notes?: string;
  source: string;
  confidence: 'high' | 'medium' | 'low';
  issues: string[];
}

// 🤖 AGENT 1: Data Quality Analysis Agent
export class DataQualityAgent {
  static analyseSpreadsheet(data: any[][], headers: string[], filename: string): DataIssue[] {
    const issues: DataIssue[] = [];

    // Check for empty columns
    headers.forEach((header, colIndex) => {
      const hasData = data.some(row => row[colIndex] && row[colIndex].toString().trim());
      if (!hasData) {
        issues.push({
          type: 'empty_column',
          severity: 'medium',
          description: `Column "${header}" appears to be completely empty`,
          column: colIndex,
          suggestion: 'Consider removing this column',
        });
      }
    });

    // Check for duplicate headers
    const headerCounts = headers.reduce(
      (acc, header) => {
        acc[header] = (acc[header] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(headerCounts).forEach(([header, count]) => {
      if (count > 1) {
        issues.push({
          type: 'duplicate_header',
          severity: 'high',
          description: `Duplicate column header "${header}" found ${count} times`,
          suggestion: 'Merge or rename duplicate columns',
        });
      }
    });

    // Check data quality row by row
    data.forEach((row, rowIndex) => {
      const nonEmptyCells = row.filter(cell => cell && cell.toString().trim()).length;
      const emptyPercentage = (row.length - nonEmptyCells) / row.length;

      if (emptyPercentage > 0.8) {
        issues.push({
          type: 'missing_data',
          severity: 'low',
          description: `Row ${rowIndex + 2} is mostly empty (${Math.round(
            emptyPercentage * 100
          )}% empty)`,
          row: rowIndex,
          suggestion: 'Consider removing this row',
        });
      }

      // Check for suspicious data patterns
      row.forEach((cell, colIndex) => {
        if (cell && typeof cell === 'string') {
          // Check for test data
          if (/test|example|dummy|sample/i.test(cell)) {
            issues.push({
              type: 'suspicious_data',
              severity: 'medium',
              description: `Potential test data found: "${cell}"`,
              row: rowIndex,
              column: colIndex,
              suggestion: 'Verify if this is real contact data',
            });
          }
        }
      });
    });

    return issues;
  }
}

// 🤖 AGENT 2: Column Mapping Intelligence Agent
export class ColumnMappingAgent {
  private static readonly COLUMN_PATTERNS = {
    email: /email|mail|e-?mail|contact.*mail/i,
    name: /^name$|full.?name|contact.?name|person/i,
    firstName: /first.?name|fname|given.?name/i,
    lastName: /last.?name|lname|surname|family.?name/i,
    company: /company|organisation|organization|label|station|publication|outlet|blog/i,
    phone: /phone|tel|mobile|number|contact.?number/i,
    website: /website|url|site|link|web/i,
    twitter: /twitter|@|handle/i,
    instagram: /instagram|insta|ig/i,
    role: /role|position|title|job|function/i,
    notes: /notes|comments|description|bio|info/i,
  };

  static detectColumns(headers: string[], data: any[][]): ColumnMapping {
    const mapping: ColumnMapping = { unknown: [] };

    headers.forEach((header, index) => {
      let matched = false;

      // Pattern-based detection
      for (const [columnType, pattern] of Object.entries(this.COLUMN_PATTERNS)) {
        if (pattern.test(header)) {
          (mapping as any)[columnType] = index;
          matched = true;
          break;
        }
      }

      // Content-based detection if pattern matching failed
      if (!matched) {
        const sampleData = data
          .slice(0, 5)
          .map(row => row[index])
          .filter(Boolean);

        if (sampleData.length > 0) {
          // Check if it looks like email
          if (sampleData.every(item => typeof item === 'string' && item.includes('@'))) {
            mapping.email = index;
            matched = true;
          }
          // Check if it looks like phone
          else if (
            sampleData.every(item => typeof item === 'string' && /[\d\s\-\+\(\)]{8,}/.test(item))
          ) {
            mapping.phone = index;
            matched = true;
          }
          // Check if it looks like website
          else if (
            sampleData.every(item => typeof item === 'string' && /https?:\/\/|www\./i.test(item))
          ) {
            mapping.website = index;
            matched = true;
          }
        }
      }

      if (!matched) {
        mapping.unknown.push(index);
      }
    });

    return mapping;
  }
}

// 🤖 AGENT 3: Data Normalisation Agent
export class DataNormalisationAgent {
  static normaliseContact(row: any[], mapping: ColumnMapping, filename: string): ProcessedContact {
    const contact: ProcessedContact = {
      source: filename,
      confidence: 'medium',
      issues: [],
    };

    // Extract data based on mapping
    if (mapping.email !== undefined && row[mapping.email]) {
      contact.email = this.cleanEmail(row[mapping.email]);
    }

    if (mapping.name !== undefined && row[mapping.name]) {
      contact.name = this.cleanName(row[mapping.name]);
    } else {
      // Try to construct name from first/last
      const firstName = mapping.firstName !== undefined ? row[mapping.firstName] : null;
      const lastName = mapping.lastName !== undefined ? row[mapping.lastName] : null;

      if (firstName && lastName) {
        contact.name = `${firstName} ${lastName}`.trim();
        contact.firstName = firstName;
        contact.lastName = lastName;
      }
    }

    if (mapping.company !== undefined && row[mapping.company]) {
      contact.company = this.cleanCompanyName(row[mapping.company]);
    }

    if (mapping.phone !== undefined && row[mapping.phone]) {
      contact.phone = this.cleanPhoneNumber(row[mapping.phone]);
    }

    if (mapping.website !== undefined && row[mapping.website]) {
      contact.website = this.cleanWebsite(row[mapping.website]);
    }

    if (mapping.twitter !== undefined && row[mapping.twitter]) {
      contact.twitter = this.cleanTwitterHandle(row[mapping.twitter]);
    }

    if (mapping.instagram !== undefined && row[mapping.instagram]) {
      contact.instagram = this.cleanInstagramHandle(row[mapping.instagram]);
    }

    if (mapping.role !== undefined && row[mapping.role]) {
      contact.role = this.cleanRole(row[mapping.role]);
    }

    if (mapping.notes !== undefined && row[mapping.notes]) {
      contact.notes = row[mapping.notes].toString().trim();
    }

    // Calculate confidence score
    contact.confidence = this.calculateConfidence(contact);

    return contact;
  }

  private static cleanEmail(email: any): string {
    return email.toString().toLowerCase().trim();
  }

  private static cleanName(name: any): string {
    return name
      .toString()
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\b\w/g, (l: string) => l.toUpperCase()); // Title case
  }

  private static cleanCompanyName(company: any): string {
    return company
      .toString()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b(bbc|nme|itv|sky)\b/gi, (match: string) => match.toUpperCase()); // Known brands
  }

  private static cleanPhoneNumber(phone: any): string {
    let cleaned = phone.toString().replace(/[^\d\+]/g, '');

    // Add UK country code if missing
    if (cleaned.startsWith('07') || cleaned.startsWith('01') || cleaned.startsWith('02')) {
      cleaned = '+44' + cleaned.substring(1);
    }

    return cleaned;
  }

  private static cleanWebsite(website: any): string {
    let url = website.toString().trim().toLowerCase();
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return url;
  }

  private static cleanTwitterHandle(twitter: any): string {
    let handle = twitter.toString().trim();
    if (!handle.startsWith('@')) {
      handle = '@' + handle;
    }
    return handle;
  }

  private static cleanInstagramHandle(instagram: any): string {
    let handle = instagram.toString().trim();
    if (!handle.startsWith('@')) {
      handle = '@' + handle;
    }
    return handle;
  }

  private static cleanRole(role: any): string {
    return role
      .toString()
      .trim()
      .replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  private static calculateConfidence(contact: ProcessedContact): 'high' | 'medium' | 'low' {
    let score = 0;

    if (contact.email && contact.email.includes('@')) score += 3;
    if (contact.name && contact.name.length > 2) score += 2;
    if (contact.company && contact.company.length > 2) score += 2;
    if (contact.phone) score += 1;
    if (contact.website) score += 1;
    if (contact.role) score += 1;

    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }
}

// 🤖 AGENT 4: Deduplication Intelligence Agent
export class DeduplicationAgent {
  static findDuplicates(contacts: ProcessedContact[]): Map<number, number[]> {
    const duplicates = new Map<number, number[]>();

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const duplicateIndexes: number[] = [];

      for (let j = i + 1; j < contacts.length; j++) {
        const otherContact = contacts[j];

        if (this.areDuplicates(contact, otherContact)) {
          duplicateIndexes.push(j);
        }
      }

      if (duplicateIndexes.length > 0) {
        duplicates.set(i, duplicateIndexes);
      }
    }

    return duplicates;
  }

  private static areDuplicates(contact1: ProcessedContact, contact2: ProcessedContact): boolean {
    // Exact email match
    if (contact1.email && contact2.email && contact1.email === contact2.email) {
      return true;
    }

    // Similar name + company
    if (contact1.name && contact2.name && contact1.company && contact2.company) {
      const nameSimilarity = this.stringSimilarity(contact1.name, contact2.name);
      const companySimilarity = this.stringSimilarity(contact1.company, contact2.company);

      if (nameSimilarity > 0.8 && companySimilarity > 0.9) {
        return true;
      }
    }

    return false;
  }

  private static stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  static mergeDuplicates(
    contacts: ProcessedContact[],
    duplicateMap: Map<number, number[]>
  ): ProcessedContact[] {
    const merged: ProcessedContact[] = [];
    const processed = new Set<number>();

    contacts.forEach((contact, index) => {
      if (processed.has(index)) return;

      const duplicateIndexes = duplicateMap.get(index) || [];
      if (duplicateIndexes.length === 0) {
        merged.push(contact);
        processed.add(index);
        return;
      }

      // Merge contact with its duplicates
      let mergedContact = { ...contact };
      duplicateIndexes.forEach(dupIndex => {
        const duplicate = contacts[dupIndex];
        mergedContact = this.mergeContactData(mergedContact, duplicate);
        processed.add(dupIndex);
      });

      merged.push(mergedContact);
      processed.add(index);
    });

    return merged;
  }

  private static mergeContactData(
    primary: ProcessedContact,
    secondary: ProcessedContact
  ): ProcessedContact {
    const merged = { ...primary };

    // Fill in missing data from secondary
    Object.keys(secondary).forEach(key => {
      if (!merged[key as keyof ProcessedContact] && secondary[key as keyof ProcessedContact]) {
        (merged as any)[key] = secondary[key as keyof ProcessedContact];
      }
    });

    // Combine notes
    if (secondary.notes && primary.notes !== secondary.notes) {
      merged.notes = merged.notes ? `${merged.notes} | ${secondary.notes}` : secondary.notes;
    }

    // Update confidence (take highest)
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    if (confidenceOrder[secondary.confidence] > confidenceOrder[primary.confidence]) {
      merged.confidence = secondary.confidence;
    }

    return merged;
  }
}

// 🎯 Main Multi-Agent Processing Pipeline
export class SpreadsheetProcessingPipeline {
  static async processFiles(files: File[]): Promise<{
    processedContacts: ProcessedContact[];
    summary: {
      totalFiles: number;
      totalContacts: number;
      duplicatesFound: number;
      duplicatesRemoved: number;
      issuesFound: DataIssue[];
      confidence: { high: number; medium: number; low: number };
    };
    fileAnalysis: SpreadsheetFile[];
  }> {
    const fileAnalysis: SpreadsheetFile[] = [];
    let allContacts: ProcessedContact[] = [];
    let allIssues: DataIssue[] = [];

    // 🟣 Process each file through the agent pipeline
    for (const file of files) {
      const fileData = await this.parseFile(file);

      // Agent 1: Data Quality Analysis
      const issues = DataQualityAgent.analyseSpreadsheet(
        fileData.data,
        fileData.headers,
        file.name
      );
      allIssues.push(...issues);

      // Agent 2: Column Mapping
      const columnMapping = ColumnMappingAgent.detectColumns(fileData.headers, fileData.data);

      // Agent 3: Data Normalisation
      const contacts = fileData.data
        .map(row => DataNormalisationAgent.normaliseContact(row, columnMapping, file.name))
        .filter(contact => contact.email || contact.name); // Only keep contacts with basic info

      allContacts.push(...contacts);

      fileAnalysis.push({
        name: file.name,
        data: fileData.data,
        headers: fileData.headers,
        detectedColumns: columnMapping,
        issues,
        confidence: this.calculateFileConfidence(issues, contacts),
      });
    }

    // Agent 4: Deduplication
    const duplicateMap = DeduplicationAgent.findDuplicates(allContacts);
    const duplicatesFound = Array.from(duplicateMap.values()).reduce(
      (sum, dups) => sum + dups.length,
      0
    );
    const mergedContacts = DeduplicationAgent.mergeDuplicates(allContacts, duplicateMap);

    // Calculate summary statistics
    const confidence = mergedContacts.reduce(
      (acc, contact) => {
        acc[contact.confidence]++;
        return acc;
      },
      { high: 0, medium: 0, low: 0 }
    );

    return {
      processedContacts: mergedContacts,
      summary: {
        totalFiles: files.length,
        totalContacts: mergedContacts.length,
        duplicatesFound,
        duplicatesRemoved: allContacts.length - mergedContacts.length,
        issuesFound: allIssues,
        confidence,
      },
      fileAnalysis,
    };
  }

  private static async parseFile(file: File): Promise<{ data: any[][]; headers: string[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const data = e.target?.result;
          let workbook: XLSX.WorkBook;

          if (file.name.endsWith('.csv')) {
            workbook = XLSX.read(data, { type: 'string' });
          } else {
            workbook = XLSX.read(data, { type: 'binary' });
          }

          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          const headers = jsonData[0] || [];
          const dataRows = jsonData.slice(1);

          resolve({
            data: dataRows,
            headers: headers.map(h => h?.toString() || ''),
          });
        } catch (error) {
          reject(error);
        }
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  }

  private static calculateFileConfidence(
    issues: DataIssue[],
    contacts: ProcessedContact[]
  ): number {
    let score = 100;

    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high':
          score -= 20;
          break;
        case 'medium':
          score -= 10;
          break;
        case 'low':
          score -= 5;
          break;
      }
    });

    // Boost for good contact quality
    const highConfidenceContacts = contacts.filter(c => c.confidence === 'high').length;
    const confidenceBonus = Math.min(20, (highConfidenceContacts / contacts.length) * 20);
    score += confidenceBonus;

    return Math.max(0, Math.min(100, score));
  }
}
