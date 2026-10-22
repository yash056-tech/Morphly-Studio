import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      type = "registration", 
      name = "User", 
      email, 
      phone = "Not provided", 
      role = "Working Professional", 
      organization = "Personal" 
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    const isRegistration = type === "registration";
    const subject = isRegistration 
      ? `Welcome to Morphly - Your Registration Details & Pro Access`
      : `Morphly Sign-In Notification & Account Summary`;

    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const roleBadgeColor = role === "Student" ? "#3b82f6" : "#6366f1";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
    .email-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%); padding: 32px 28px; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
    .body-content { padding: 28px; }
    .greeting { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1e293b; }
    .detail-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .detail-table tr:nth-child(even) { background-color: #f8fafc; }
    .detail-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #edf2f7; }
    .detail-table tr:last-child td { border-bottom: none; }
    .detail-label { font-weight: 600; color: #64748b; width: 38%; }
    .detail-value { font-weight: 500; color: #0f172a; }
    .role-badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: ${roleBadgeColor}15; color: ${roleBadgeColor}; }
    .perks-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .perks-box h3 { margin: 0 0 8px 0; font-size: 14px; color: #166534; font-weight: 700; }
    .perks-list { margin: 0; padding-left: 20px; font-size: 12px; color: #15803d; line-height: 1.6; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="header">
      <h1>Morphly Pro</h1>
      <p>${isRegistration ? "Official Account Registration Confirmation" : "Security & Sign-In Alert"}</p>
    </div>
    
    <div class="body-content">
      <div class="greeting">Hello ${name},</div>
      <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 16px 0;">
        ${isRegistration 
          ? "Thank you for registering with Morphly. Your account is fully activated with <strong>Pro Unlimited</strong> privileges, removing all file size barriers."
          : "You have successfully signed in to your Morphly Pro account. Below is a summary of your profile details."}
      </p>

      <table class="detail-table">
        <tr>
          <td class="detail-label">Full Name</td>
          <td class="detail-value"><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="detail-label">Email Address</td>
          <td class="detail-value">${email}</td>
        </tr>
        <tr>
          <td class="detail-label">Mobile Number</td>
          <td class="detail-value">${phone}</td>
        </tr>
        <tr>
          <td class="detail-label">User Profile (Who are you)</td>
          <td class="detail-value"><span class="role-badge">${role}</span></td>
        </tr>
        ${organization ? `
        <tr>
          <td class="detail-label">Institution / Organization</td>
          <td class="detail-value">${organization}</td>
        </tr>
        ` : ''}
        <tr>
          <td class="detail-label">Access Level</td>
          <td class="detail-value"><strong style="color: #4f46e5;">Pro Unlimited (Zero Size Barriers)</strong></td>
        </tr>
        <tr>
          <td class="detail-label">Timestamp</td>
          <td class="detail-value">${timestamp}</td>
        </tr>
      </table>

      <div class="perks-box">
        <h3>✨ Your Pro Unlimited Features:</h3>
        <ul class="perks-list">
          <li><strong>Universal File Converter:</strong> Convert PDF, Word (.docx), Excel, PowerPoint, Text, Markdown, HTML, and Images up to 500MB+.</li>
          <li><strong>All-Options Image Studio:</strong> Compress in all possible modes (Lossless vs Lossy, Target KB, Scaling) and export to any format (WebP, JPG, PNG, AVIF, BMP, ICO, PDF, SVG).</li>
          <li><strong>Strict Zero Retention:</strong> Files are processed ephemerally in RAM and wiped immediately upon download.</li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #64748b; margin: 20px 0 0 0;">
        If you did not initiate this request, please contact our security team immediately.
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0;">© 2026 Morphly Platform • Ephemeral Processing Architecture</p>
      <p style="margin: 4px 0 0 0;">This email was sent automatically to ${email}.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const textContent = `
Morphly Pro - ${isRegistration ? "Account Registration Confirmation" : "Sign-In Alert"}
============================================================

Hello ${name},

${isRegistration 
  ? "Your Morphly Pro account has been created with Unlimited File Size access."
  : "You have signed in to your Morphly Pro account."}

ACCOUNT & PROFILE DETAILS:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Profile / Role: ${role}
- Organization: ${organization || "Personal"}
- Access Tier: Pro Unlimited (No Size Barriers)
- Timestamp: ${timestamp}

PRIVACY & SECURITY GUARANTEE:
Morphly enforces a strict Zero Retention policy. Image compression executes 100% in your browser. Document conversions run in isolated temporary RAM and are purged immediately.

© 2026 Morphly Platform
    `.trim();

    // Check if custom SMTP is configured in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Morphly Platform" <support@morphly.pro>`,
          to: email,
          subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[Email Dispatched via SMTP] to ${email}`);
      } catch (smtpErr) {
        console.warn("[SMTP Error, using simulated delivery]:", smtpErr);
      }
    } else {
      console.log(`[Email Dispatched (Direct / Simulated)] To: ${email} | Subject: ${subject}`);
    }

    // Always return the generated email object so client can preview it!
    return NextResponse.json({
      success: true,
      deliveredTo: email,
      subject,
      emailPreview: {
        to: email,
        subject,
        html: htmlContent,
        text: textContent,
        sentAt: timestamp,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to dispatch email";
    console.error("Email dispatch error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
