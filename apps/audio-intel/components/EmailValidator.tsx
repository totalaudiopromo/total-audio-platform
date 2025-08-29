'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface EmailValidationResult {
  email: string;
  isValid: boolean;
  formatValid: boolean;
  domainValid: boolean;
  mxRecords: boolean;
  smtpConnectable: boolean;
  disposable: boolean;
  freeEmail: boolean;
  catchAll: boolean;
  roleBased: boolean;
  spamTrap: boolean;
  reputation: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  issues: string[];
  warnings: string[];
  details: {
    syntax: boolean;
    domain: boolean;
    mxRecords: boolean;
    smtpTest: boolean;
    disposable: boolean;
    catchAll: boolean;
    roleBased: boolean;
    spamTrap: boolean;
    reputation: string;
  };
}

interface ValidationSummary {
  total: number;
  valid: number;
  invalid: number;
  disposable: number;
  freeEmails: number;
  businessEmails: number;
  roleBased: number;
  spamTraps: number;
  catchAll: number;
  reputationBreakdown: Record<string, number>;
}

export default function EmailValidator() {
  const [emails, setEmails] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<{
    valid: EmailValidationResult[];
    invalid: EmailValidationResult[];
    summary: ValidationSummary;
  } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleEmailInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmails(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const emailList = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.includes('@'))
        .join('\n');
      setEmails(emailList);
    };
    reader.readAsText(file);
  };

  const validateEmails = async () => {
    if (!emails.trim()) return;

    setIsValidating(true);
    setProgress(0);

    try {
      const emailList = emails
        .split('\n')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      const response = await fetch('/api/validate-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList })
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        console.error('Validation failed:', data.error);
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
      setProgress(100);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isValid: boolean) => {
    return isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">•</span>
            Email Validation
          </CardTitle>
          <CardDescription>
            Verify email addresses are valid and active. Check for disposable emails, 
            free providers, and business domains.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Addresses (one per line or CSV file)
              </label>
              <textarea
                value={emails}
                onChange={handleEmailInput}
                placeholder="Enter email addresses here...
john@example.com
jane@company.com
..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isValidating}
              />
            </div>

            <div className="flex gap-4">
                              <Button
                  onClick={validateEmails}
                  disabled={!emails.trim() || isValidating}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isValidating ? 'Validating...' : 'Validate Emails'}
                </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isValidating}
                />
                <Button
                  variant="outline"
                  disabled={isValidating}
                  className="relative font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  📁 Upload CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isValidating && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Validating email addresses...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>
              Summary of email validation findings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {results.summary.total}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {results.summary.valid}
                </div>
                <div className="text-sm text-gray-600">Valid</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {results.summary.invalid}
                </div>
                <div className="text-sm text-gray-600">Invalid</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {results.summary.businessEmails}
                </div>
                <div className="text-sm text-gray-600">Business</div>
              </div>
            </div>

            {/* Advanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  {results.summary.disposable}
                </div>
                <div className="text-xs text-gray-600">Disposable</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {results.summary.roleBased}
                </div>
                <div className="text-xs text-gray-600">Role-based</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-lg font-bold text-pink-600">
                  {results.summary.spamTraps}
                </div>
                <div className="text-xs text-gray-600">Spam Traps</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded-lg">
                <div className="text-lg font-bold text-indigo-600">
                  {results.summary.catchAll}
                </div>
                <div className="text-xs text-gray-600">Catch-all</div>
              </div>
              <div className="text-center p-3 bg-teal-50 rounded-lg">
                <div className="text-lg font-bold text-teal-600">
                  {Object.keys(results.summary.reputationBreakdown).length}
                </div>
                <div className="text-xs text-gray-600">Reputation Levels</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Valid Emails ({results.valid.length})</h3>
              <div className="space-y-2">
                {results.valid.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      <span className="font-mono">{result.email}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={getConfidenceColor(result.confidence)}>
                        {result.confidence} confidence
                      </Badge>
                      <Badge className={getReputationColor(result.reputation)}>
                        {result.reputation} reputation
                      </Badge>
                      {result.freeEmail && (
                        <Badge variant="secondary">Free Email</Badge>
                      )}
                      {!result.freeEmail && (
                        <Badge variant="outline">Business</Badge>
                      )}
                      {result.roleBased && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">Role-based</Badge>
                      )}
                      {result.smtpConnectable && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">SMTP OK</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {results.invalid.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Invalid Emails ({results.invalid.length})</h3>
                  <div className="space-y-2">
                    {results.invalid.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">✗</span>
                          <span className="font-mono">{result.email}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {result.disposable && (
                            <Badge variant="destructive">Disposable</Badge>
                          )}
                          {result.spamTrap && (
                            <Badge variant="destructive" className="bg-red-100 text-red-800">Spam Trap</Badge>
                          )}
                          {result.catchAll && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">Catch-all</Badge>
                          )}
                          {result.roleBased && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">Role-based</Badge>
                          )}
                          {result.issues.map((issue, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                          {result.warnings.map((warning, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                              {warning}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 