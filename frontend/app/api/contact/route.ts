import {NextResponse} from 'next/server'
import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const toEmail = process.env.CONTACT_FORM_TO_EMAIL || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body || typeof body !== 'object') {
      return NextResponse.json({error: 'Invalid request body'}, {status: 400})
    }

    // Build email content from form fields
    const lines = Object.entries(body)
      .filter(([, value]) => typeof value === 'string' && value.trim())
      .map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value as string)}</p>`)
      .join('\n')

    if (!lines) {
      return NextResponse.json({error: 'No form data provided'}, {status: 400})
    }

    if (!toEmail) {
      console.error('CONTACT_FORM_TO_EMAIL is not set')
      return NextResponse.json({error: 'Contact form is not configured'}, {status: 500})
    }

    const senderName = (body.name as string) || 'Website Visitor'
    const senderEmail = (body.email as string) || undefined

    await resend.emails.send({
      from: 'Hound Around Website <onboarding@resend.dev>',
      to: toEmail,
      replyTo: senderEmail,
      subject: `New Contact Form Submission from ${senderName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        ${lines}
        <hr />
        <p style="color: #888; font-size: 12px;">Sent from the Hound Around Resort website contact form.</p>
      `,
    })

    return NextResponse.json({success: true})
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({error: 'Failed to send message'}, {status: 500})
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
