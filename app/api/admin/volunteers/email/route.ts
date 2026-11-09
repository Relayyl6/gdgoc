import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isAdminRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Recipient {
  email: string;
  name?: string;
}

interface EmailPayload {
  recipients: Recipient[];
  subject: string;
  messageHtml: string;
}

/**
 * Builds a clean, mobile-responsive HTML template for GDGOC UNIBEN emails.
 */
function buildEmailTemplate(contentHtml: string, recipientName: string = 'Volunteer'): string {
  // Replace {{name}} or {name} tags
  const personalizedContent = contentHtml
    .replace(/\{\{name\}\}/gi, recipientName)
    .replace(/\{name\}/gi, recipientName);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GDG on Campus UNIBEN</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Google Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 600px;
      margin: 24px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .accent-bar {
      height: 6px;
      background: linear-gradient(90deg, #4285F4 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75%);
    }
    .header {
      padding: 28px 32px 20px 32px;
      border-bottom: 1px solid #f1f5f9;
      text-align: left;
    }
    .header-logo {
      display: inline-block;
      vertical-align: middle;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #0f172a;
    }
    .header-badge {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      background: #eff6ff;
      color: #2563eb;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 9999px;
      border: 1px solid #bfdbfe;
    }
    .content {
      padding: 32px;
      font-size: 15px;
      line-height: 1.65;
      color: #334155;
    }
    .content h1, .content h2, .content h3 {
      color: #0f172a;
      margin-top: 0;
      font-weight: 700;
      line-height: 1.3;
    }
    .content h1 { font-size: 22px; }
    .content h2 { font-size: 19px; }
    .content h3 { font-size: 17px; }
    .content p {
      margin: 0 0 16px 0;
    }
    .content a {
      color: #2563eb;
      text-decoration: underline;
      font-weight: 500;
    }
    .content img {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 12px;
      margin: 16px 0;
      display: block;
    }
    .content ul, .content ol {
      margin: 0 0 16px 0;
      padding-left: 24px;
    }
    .content li {
      margin-bottom: 6px;
    }
    .btn-container {
      margin: 24px 0;
      text-align: left;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      padding: 12px 28px;
      border-radius: 9999px;
      font-weight: 600;
      text-decoration: none !important;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      border-top: 1px solid #f1f5f9;
      font-size: 12px;
      color: #64748b;
      text-align: center;
      line-height: 1.5;
    }
    .footer a {
      color: #64748b;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="accent-bar"></div>
    <div class="header">
      <div class="header-logo">
        <span style="color: #4285F4;">G</span><span style="color: #EA4335;">D</span><span style="color: #FBBC04;">G</span> on Campus
      </div>
      <span class="header-badge">UNIBEN Chapter</span>
    </div>
    <div class="content">
      ${personalizedContent}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>Google Developer Groups on Campus — University of Benin</strong></p>
      <p style="margin: 0 0 6px 0;">Empowering students to transform ideas into reality. Learn, build, and grow together.</p>
      <p style="margin: 0;">Sent via GDGOC UNIBEN Admin Portal</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  // 1. Authenticate admin
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
  }

  try {
    const body: EmailPayload = await request.json();
    const { recipients, subject, messageHtml } = body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Please select at least one recipient.' }, { status: 400 });
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }

    if (!messageHtml || !messageHtml.trim()) {
      return NextResponse.json({ error: 'Email content cannot be empty.' }, { status: 400 });
    }

    // 2. Setup SMTP credentials from environment variables (NEVER hardcoded!)
    const smtpUser = process.env.SMTP_USER || 'yemuelinc@gmail.com';
    const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
    const smtpFrom = process.env.SMTP_FROM || `GDG on Campus UNIBEN <${smtpUser}>`;

    if (!smtpPass) {
      return NextResponse.json(
        { error: 'SMTP_PASS is not configured in environment variables. Please check .env.local.' },
        { status: 500 }
      );
    }

    // 3. Initialize nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
    } catch (verifyErr: any) {
      console.error('SMTP verification failed:', verifyErr);
      return NextResponse.json(
        { error: `SMTP Authentication failed: ${verifyErr.message || 'Check username and app password'}` },
        { status: 500 }
      );
    }

    // 4. Send emails
    let sentCount = 0;
    const failures: { email: string; error: string }[] = [];

    // Process recipients
    for (const recipient of recipients) {
      if (!recipient.email || !recipient.email.includes('@')) {
        failures.push({ email: recipient.email || 'unknown', error: 'Invalid email address' });
        continue;
      }

      const recipientName = recipient.name?.trim() || 'Volunteer';
      const fullHtml = buildEmailTemplate(messageHtml, recipientName);

      try {
        await transporter.sendMail({
          from: smtpFrom,
          to: recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email,
          subject: subject.trim(),
          html: fullHtml,
        });
        sentCount++;
      } catch (sendErr: any) {
        console.error(`Failed to send to ${recipient.email}:`, sendErr);
        failures.push({ email: recipient.email, error: sendErr.message || 'Failed to send' });
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      total: recipients.length,
      failures,
    });
  } catch (error: any) {
    console.error('Mass email route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
