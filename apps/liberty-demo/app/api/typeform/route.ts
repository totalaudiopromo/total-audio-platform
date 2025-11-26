import { NextRequest, NextResponse } from 'next/server';
import type { TypeformSubmission } from '@/lib/types';

const TYPEFORM_API_URL = 'https://api.typeform.com';

// GET /api/typeform?formId=xxx
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const formId = searchParams.get('formId') || process.env.TYPEFORM_INTAKE_FORM_ID;

  if (!formId) {
    return NextResponse.json({ error: 'Form ID required' }, { status: 400 });
  }

  const token = process.env.TYPEFORM_API_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'TYPEFORM_API_TOKEN not configured' }, { status: 500 });
  }

  try {
    // Fetch form responses
    const responsesRes = await fetch(`${TYPEFORM_API_URL}/forms/${formId}/responses?page_size=50`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!responsesRes.ok) {
      throw new Error(`Typeform API error: ${responsesRes.status}`);
    }

    const responsesData = await responsesRes.json();

    // Fetch form definition to get field titles
    const formRes = await fetch(`${TYPEFORM_API_URL}/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const formData = await formRes.json();
    const requiredFields =
      formData.fields?.filter((f: any) => f.validations?.required)?.map((f: any) => f.title) || [];

    const submissions: TypeformSubmission[] = responsesData.items.map((item: any) => {
      const answers = item.answers || [];
      const answeredFields = answers
        .map((a: any) => {
          const field = formData.fields?.find((f: any) => f.id === a.field.id);
          return field?.title;
        })
        .filter(Boolean);

      const missingFields = requiredFields.filter((f: string) => !answeredFields.includes(f));

      // Try to extract artist name from answers
      const artistNameAnswer = answers.find((a: any) => {
        const field = formData.fields?.find((f: any) => f.id === a.field.id);
        return (
          field?.title?.toLowerCase().includes('artist') ||
          field?.title?.toLowerCase().includes('name')
        );
      });

      const artistName =
        artistNameAnswer?.text ||
        artistNameAnswer?.email ||
        item.hidden?.artist_name ||
        'Unknown Artist';

      const completeness =
        requiredFields.length > 0
          ? Math.round(
              ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
            )
          : 100;

      return {
        id: item.response_id || item.token,
        artistName,
        submittedAt: item.submitted_at,
        completeness,
        missingFields,
      };
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('[Typeform API]', error);
    return NextResponse.json({ error: 'Failed to fetch Typeform submissions' }, { status: 500 });
  }
}
