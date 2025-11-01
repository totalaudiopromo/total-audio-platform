/**
 * PDF Report Generator
 * Creates beautiful branded campaign reports using @react-pdf/renderer
 * Fixed: All styles now use StyleSheet instead of inline objects
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from '@react-pdf/renderer';
import { format } from 'date-fns';

interface ReportData {
  campaign: {
    name: string;
    artist_name: string;
    platform: string;
    status: string;
    start_date: string;
    end_date?: string;
    budget?: number;
    target_reach?: number;
    actual_reach?: number;
    notes?: string;
  };
  template: {
    logo_url?: string;
    brand_color: string;
    company_name?: string;
    contact_email?: string;
    contact_phone?: string;
  };
  executiveSummary?: string;
  activities?: Array<{
    type: string;
    description: string;
    created_at: string;
  }>;
  metrics?: {
    response_rate?: number;
    cost_per_result?: number;
    days_active?: number;
  };
}

// PDF Styles
const createStyles = (brandColor: string) =>
  StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: 30,
      paddingBottom: 20,
      borderBottomWidth: 3,
      borderBottomColor: brandColor,
    },
    logo: {
      width: 120,
      height: 40,
      marginBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: brandColor,
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 3,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: brandColor,
      marginBottom: 10,
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e5e5',
    },
    text: {
      fontSize: 11,
      color: '#333',
      lineHeight: 1.6,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      fontSize: 10,
      color: '#666',
      fontWeight: 'bold',
    },
    value: {
      fontSize: 11,
      color: '#333',
    },
    metricBox: {
      backgroundColor: '#f8f9fa',
      padding: 15,
      borderRadius: 5,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: brandColor,
    },
    metricLabel: {
      fontSize: 9,
      color: '#666',
      textTransform: 'uppercase',
      marginBottom: 5,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: brandColor,
    },
    activity: {
      marginBottom: 10,
      paddingLeft: 15,
      borderLeftWidth: 2,
      borderLeftColor: '#e5e5e5',
    },
    activityDate: {
      fontSize: 9,
      color: '#999',
      marginBottom: 3,
    },
    activityText: {
      fontSize: 10,
      color: '#333',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 40,
      right: 40,
      textAlign: 'center',
      fontSize: 9,
      color: '#999',
      borderTopWidth: 1,
      borderTopColor: '#e5e5e5',
      paddingTop: 10,
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexRowWithMargin: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    halfWidth: {
      width: '48%',
    },
    footerText: {
      marginTop: 5,
    },
  });

// PDF Document Component
const CampaignReportPDF: React.FC<{ data: ReportData }> = ({ data }) => {
  const styles = createStyles(data.template.brand_color);
  const { campaign, template, executiveSummary, activities, metrics } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {template.logo_url && (
            <Image src={template.logo_url} style={styles.logo} />
          )}
          <Text style={styles.title}>Campaign Report</Text>
          <Text style={styles.subtitle}>{campaign.name}</Text>
          <Text style={styles.subtitle}>
            {campaign.artist_name} • {campaign.platform}
          </Text>
          <Text style={styles.subtitle}>
            {format(new Date(), 'dd MMMM yyyy')}
          </Text>
        </View>

        {/* Executive Summary */}
        {executiveSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.text}>{executiveSummary}</Text>
          </View>
        )}

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.flexRow}>
            <View style={styles.halfWidth}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Target Reach</Text>
                <Text style={styles.metricValue}>
                  {campaign.target_reach || 0}
                </Text>
              </View>
            </View>
            <View style={styles.halfWidth}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Actual Reach</Text>
                <Text style={styles.metricValue}>
                  {campaign.actual_reach || 0}
                </Text>
              </View>
            </View>
          </View>

          {metrics && (
            <View style={styles.flexRowWithMargin}>
              {metrics.response_rate !== undefined && (
                <View style={styles.halfWidth}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Success Rate</Text>
                    <Text style={styles.metricValue}>
                      {(metrics.response_rate * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>
              )}
              {metrics.cost_per_result !== undefined && (
                <View style={styles.halfWidth}>
                  <View style={styles.metricBox}>
                    <Text style={styles.metricLabel}>Cost Per Result</Text>
                    <Text style={styles.metricValue}>
                      £{metrics.cost_per_result.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Campaign Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campaign Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Platform:</Text>
            <Text style={styles.value}>{campaign.platform}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{campaign.status}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>
              {format(new Date(campaign.start_date), 'dd MMM yyyy')}
            </Text>
          </View>
          {campaign.end_date && (
            <View style={styles.row}>
              <Text style={styles.label}>End Date:</Text>
              <Text style={styles.value}>
                {format(new Date(campaign.end_date), 'dd MMM yyyy')}
              </Text>
            </View>
          )}
          {campaign.budget && (
            <View style={styles.row}>
              <Text style={styles.label}>Budget:</Text>
              <Text style={styles.value}>£{campaign.budget.toFixed(2)}</Text>
            </View>
          )}
        </View>

        {/* Activity Timeline */}
        {activities && activities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Timeline</Text>
            {activities.slice(0, 10).map((activity, index) => (
              <View key={index} style={styles.activity}>
                <Text style={styles.activityDate}>
                  {format(new Date(activity.created_at), 'dd MMM yyyy, HH:mm')}
                </Text>
                <Text style={styles.activityText}>{activity.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Notes */}
        {campaign.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.text}>{campaign.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          {template.company_name && <Text>{template.company_name}</Text>}
          {template.contact_email && <Text>{template.contact_email}</Text>}
          <Text style={styles.footerText}>
            Generated by Tracker • {format(new Date(), 'dd MMMM yyyy')}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Generate PDF blob from report data
 */
export async function generateCampaignReportPDF(
  data: ReportData
): Promise<Blob> {
  const doc = <CampaignReportPDF data={data} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Generate PDF and return base64 string (for storage)
 */
export async function generateCampaignReportBase64(
  data: ReportData
): Promise<string> {
  const blob = await generateCampaignReportPDF(data);
  const buffer = await blob.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

export type { ReportData };
