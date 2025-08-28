'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { Download, Mail, FileText, BarChart3, Search, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { exportToCsv } from '@/utils/exportToCsv';
import { exportToExcel } from '@/utils/exportToExcel';
import { exportAnalyticsToPdf, exportContactsToPdf } from '@/utils/exportToPdf';

interface ExportSystemProps {
  type: 'contacts' | 'analytics' | 'search-results';
  data: any;
  title?: string;
  description?: string;
  whiteLabel?: {
    companyName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  className?: string;
}

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  emailDelivery: boolean;
  recipientEmail: string;
  recipientName: string;
  customMessage: string;
  filename: string;
  whiteLabel: {
    companyName: string;
    primaryColor: string;
  };
}

export function ExportSystem({
  type,
  data,
  title,
  description,
  whiteLabel,
  className
}: ExportSystemProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    emailDelivery: false,
    recipientEmail: '',
    recipientName: '',
    customMessage: '',
    filename: `audio-intel-${type}-${new Date().toISOString().split('T')[0]}`,
    whiteLabel: {
      companyName: whiteLabel?.companyName || '',
      primaryColor: whiteLabel?.primaryColor || '#1E88E5'
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const getTypeIcon = () => {
    switch (type) {
      case 'contacts': return <FileText className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'search-results': return <Search className="w-5 h-5" />;
      default: return <Download className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'contacts': return 'Enriched Contacts';
      case 'analytics': return 'Analytics Report';
      case 'search-results': return 'Search Results';
      default: return 'Data Export';
    }
  };

  const getDataCount = () => {
    if (type === 'analytics') {
      return data.totalContacts || 0;
    }
    return Array.isArray(data) ? data.length : 0;
  };

  const handleQuickExport = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      switch (format) {
        case 'csv':
          if (type === 'analytics') {
            // Handle analytics CSV export
            const csvData = [
              ['Metric', 'Value'],
              ['Total Contacts', data.totalContacts || 0],
              ['Total Enrichments', data.totalEnrichments || 0],
              ['Success Rate', `${data.successRate || 0}%`],
              ['Average Confidence', `${data.averageConfidence || 0}%`]
            ];
            const csvContent = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${exportOptions.filename}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          } else {
            const csvContent = exportToCsv(data);
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${exportOptions.filename}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }
          break;
        
        case 'excel':
          if (type === 'analytics') {
            // Create analytics data in the correct format for Excel export
            const analyticsData = [
              { name: 'Total Contacts', email: '', contactIntelligence: data.totalContacts || 0, researchConfidence: '', lastResearched: '', platform: '', role: '', company: '' },
              { name: 'Total Enrichments', email: '', contactIntelligence: data.totalEnrichments || 0, researchConfidence: '', lastResearched: '', platform: '', role: '', company: '' },
              { name: 'Success Rate', email: '', contactIntelligence: `${data.successRate || 0}%`, researchConfidence: '', lastResearched: '', platform: '', role: '', company: '' },
              { name: 'Average Confidence', email: '', contactIntelligence: `${data.averageConfidence || 0}%`, researchConfidence: '', lastResearched: '', platform: '', role: '', company: '' }
            ];
            exportToExcel(analyticsData, `${exportOptions.filename}.xlsx`);
          } else {
            exportToExcel(data, `${exportOptions.filename}.xlsx`);
          }
          break;
        
        case 'pdf':
          if (type === 'analytics') {
            exportAnalyticsToPdf(data, `${exportOptions.filename}.pdf`);
          } else {
            exportContactsToPdf(data, `${exportOptions.filename}.pdf`);
          }
          break;
      }
      
      setExportStatus('success');
      setStatusMessage(`${format.toUpperCase()} export completed successfully!`);
      
      // Track export in analytics
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'export_download',
            data: {
              type,
              format,
              contactsCount: getDataCount()
            }
          })
        });
      } catch (error) {
        console.error('Analytics tracking failed:', error);
      }
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setStatusMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleProfessionalExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          format: exportOptions.format,
          data,
          emailDelivery: exportOptions.emailDelivery ? {
            enabled: true,
            recipientEmail: exportOptions.recipientEmail,
            recipientName: exportOptions.recipientName,
            customMessage: exportOptions.customMessage,
            whiteLabel: exportOptions.whiteLabel
          } : undefined,
          filename: exportOptions.filename
        })
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.downloadUrl) {
          // Handle direct download
          const a = document.createElement('a');
          a.href = result.downloadUrl;
          a.download = result.filename;
          a.click();
        }
        
        setExportStatus('success');
        setStatusMessage(
          exportOptions.emailDelivery 
            ? `Export completed and sent to ${exportOptions.recipientEmail}!`
            : `${exportOptions.format.toUpperCase()} export completed successfully!`
        );
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error: any) {
      console.error('Professional export failed:', error);
      setExportStatus('error');
      setStatusMessage(error.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        {getTypeIcon()}
        <div>
          <h3 className="text-lg font-semibold">
            {title || `Export ${getTypeLabel()}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {description || `Export your ${type.replace('-', ' ')} in multiple formats`}
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {getDataCount().toLocaleString()} items
        </Badge>
      </div>

      {/* Quick Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Export</CardTitle>
          <CardDescription>
            One-click export in your preferred format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('csv')}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('excel')}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickExport('pdf')}
              disabled={isExporting}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Professional Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Professional Export</CardTitle>
          <CardDescription>
            Advanced options with email delivery and white-labeling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'csv' | 'excel' | 'pdf') =>
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filename">Filename</Label>
              <Input
                value={exportOptions.filename}
                onChange={(e) =>
                  setExportOptions(prev => ({ ...prev, filename: e.target.value }))
                }
                placeholder="Enter filename"
              />
            </div>
          </div>

          {/* Email Delivery Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Delivery</Label>
              <p className="text-sm text-muted-foreground">
                Send export results via email with professional templates
              </p>
            </div>
            <Switch
              checked={exportOptions.emailDelivery}
              onCheckedChange={(checked) =>
                setExportOptions(prev => ({ ...prev, emailDelivery: checked }))
              }
            />
          </div>

          {/* Email Options */}
          {exportOptions.emailDelivery && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    type="email"
                    value={exportOptions.recipientEmail}
                    onChange={(e) =>
                      setExportOptions(prev => ({ ...prev, recipientEmail: e.target.value }))
                    }
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Input
                    value={exportOptions.recipientName}
                    onChange={(e) =>
                      setExportOptions(prev => ({ ...prev, recipientName: e.target.value }))
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customMessage">Custom Message</Label>
                <Textarea
                  value={exportOptions.customMessage}
                  onChange={(e) =>
                    setExportOptions(prev => ({ ...prev, customMessage: e.target.value }))
                  }
                  placeholder="Add a personal message to the email..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* White Label Options */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>White Label Options</Label>
              <p className="text-sm text-muted-foreground">
                Customize branding for agency clients
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Toggle white label form visibility
                const whiteLabelSection = document.getElementById('white-label-section');
                if (whiteLabelSection) {
                  whiteLabelSection.classList.toggle('hidden');
                }
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>

          {/* White Label Form */}
          <div id="white-label-section" className="hidden space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  value={exportOptions.whiteLabel.companyName}
                  onChange={(e) =>
                    setExportOptions(prev => ({
                      ...prev,
                      whiteLabel: { ...prev.whiteLabel, companyName: e.target.value }
                    }))
                  }
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  type="color"
                  value={exportOptions.whiteLabel.primaryColor}
                  onChange={(e) =>
                    setExportOptions(prev => ({
                      ...prev,
                      whiteLabel: { ...prev.whiteLabel, primaryColor: e.target.value }
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Export Button */}
          <Button
            onClick={handleProfessionalExport}
            disabled={isExporting || (exportOptions.emailDelivery && !exportOptions.recipientEmail)}
            className="w-full"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                {exportOptions.emailDelivery ? <Mail className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                {exportOptions.emailDelivery ? 'Export & Send Email' : 'Export Now'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {exportStatus !== 'idle' && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          exportStatus === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {exportStatus === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm">{statusMessage}</span>
        </div>
      )}
    </div>
  );
} 