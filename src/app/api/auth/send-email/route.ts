import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const ADMIN_NOTIFICATION_EMAIL = 
  process.env.ADMIN_NOTIFICATION_EMAIL || 
  process.env.ADMIN_EMAIL || 
  "ya09shu@gmail.com";

interface LeadRecord {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
  timestamp: string;
  adminEmail: string;
  adminDelivered: boolean;
}

function saveLeadRecord(lead: LeadRecord) {
  try {
    const isVercel = !!process.env.VERCEL;
    const leadsDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");
    const leadsFile = path.join(leadsDir, "leads.json");

    if (!fs.existsSync(leadsDir)) {
      fs.mkdirSync(leadsDir, { recursive: true });
    }

    let existing: LeadRecord[] = [];
    if (fs.existsSync(leadsFile)) {
      try {
        const raw = fs.readFileSync(leadsFile, "utf-8");
        existing = JSON.parse(raw);
        if (!Array.isArray(existing)) existing = [];
      } catch {
        existing = [];
      }
    }

    existing.unshift(lead);
    // Keep last 100 leads
    if (existing.length > 100) {
      existing = existing.slice(0, 100);
    }

    fs.writeFileSync(leadsFile, JSON.stringify(existing, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Leads Store Warning]: Could not persist lead record:", err);
  }
}

export async function GET() {
  try {
    const isVercel = !!process.env.VERCEL;
    const leadsDir = isVercel ? "/tmp" : path.join(process.cwd(), "data");
    const leadsFile = path.join(leadsDir, "leads.json");

    let leads: LeadRecord[] = [];
    if (fs.existsSync(leadsFile)) {
      try {
        const raw = fs.readFileSync(leadsFile, "utf-8");
        leads = JSON.parse(raw);
      } catch {
        leads = [];
      }
    }

    return NextResponse.json({
      success: true,
      adminNotificationEmail: ADMIN_NOTIFICATION_EMAIL,
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      totalLeads: leads.length,
      leads,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch leads";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      type = "registration", 
      name = "User", 
      email, 
      phone = "Not provided", 
      role = "Student", 
      organization = "Personal / Not specified" 
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    const isRegistration = type === "registration";

    // Format timestamps
    const now = new Date();
    const timestampIST = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    });
    const timestampUTC = now.toUTCString();

    const roleBadgeColor = 
      role === "Student" ? "#3b82f6" : 
      role === "Working Professional" ? "#6366f1" : 
      role === "Freelancer / Creator" ? "#ec4899" : "#10b981";

    const cleanPhoneDigits = phone.replace(/[^0-9]/g, "");

    // -------------------------------------------------------------
    // 1. ADMIN REGISTRATION ALERT EMAIL (To: ya09shu@gmail.com)
    // -------------------------------------------------------------
    const adminSubject = isRegistration 
      ? `🔔 [New User Registration] ${name} (${role}) registered on Morphly`
      : `🔑 [User Sign-In Alert] ${name} accessed Morphly Platform`;

    const adminHtmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a; }
    .email-card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #cbd5e1; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%); padding: 32px 28px; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1; }
    .status-pill { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: #22c55e20; color: #4ade80; border: 1px solid #22c55e40; margin-top: 12px; }
    .body-content { padding: 28px; }
    .intro { font-size: 14px; color: #334155; line-height: 1.6; margin-bottom: 20px; }
    .detail-table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 16px 0 24px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .detail-table tr:nth-child(even) { background-color: #f8fafc; }
    .detail-table td { padding: 13px 18px; font-size: 13px; border-bottom: 1px solid #edf2f7; vertical-align: top; }
    .detail-table tr:last-child td { border-bottom: none; }
    .detail-label { font-weight: 700; color: #64748b; width: 34%; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .role-badge { display: inline-block; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: ${roleBadgeColor}15; color: ${roleBadgeColor}; border: 1px solid ${roleBadgeColor}40; }
    .action-row { display: flex; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; padding: 10px 18px; border-radius: 10px; font-size: 12px; font-weight: 700; text-decoration: none; text-align: center; }
    .btn-primary { background: #4f46e5; color: #ffffff !important; }
    .btn-secondary { background: #22c55e; color: #ffffff !important; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 28px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="header">
      <h1>Morphly Admin Alert</h1>
      <p>A new visitor has just registered on the Morphly platform.</p>
      <div class="status-pill">● New User Registered</div>
    </div>
    
    <div class="body-content">
      <div class="intro">
        Hello <strong>Admin</strong>, a new user has registered for Morphly services. Here are their complete profile details:
      </div>

      <table class="detail-table">
        <tr>
          <td class="detail-label">Full Name</td>
          <td class="detail-value" style="font-size: 15px; color: #0f172a;"><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="detail-label">Email Address</td>
          <td class="detail-value">
            <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none; font-weight: 700;">${email}</a>
          </td>
        </tr>
        <tr>
          <td class="detail-label">Mobile Number</td>
          <td class="detail-value">
            <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
            ${cleanPhoneDigits ? `&nbsp;•&nbsp;<a href="https://wa.me/${cleanPhoneDigits}" style="color: #16a34a; text-decoration: none; font-weight: 700;">Message on WhatsApp</a>` : ''}
          </td>
        </tr>
        <tr>
          <td class="detail-label">User Category / Role</td>
          <td class="detail-value">
            <span class="role-badge">${role}</span>
          </td>
        </tr>
        <tr>
          <td class="detail-label">College / Organization</td>
          <td class="detail-value">${organization}</td>
        </tr>
        <tr>
          <td class="detail-label">Assigned Plan</td>
          <td class="detail-value" style="color: #16a34a;">Pro Unlimited Access (500MB+ Unlocked)</td>
        </tr>
        <tr>
          <td class="detail-label">Registration Time (IST)</td>
          <td class="detail-value">${timestampIST}</td>
        </tr>
        <tr>
          <td class="detail-label">Timestamp (UTC)</td>
          <td class="detail-value" style="color: #64748b; font-size: 12px;">${timestampUTC}</td>
        </tr>
      </table>

      <div style="background: #f8fafc; border-radius: 12px; padding: 14px 18px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
        <strong>Platform Utilities Ready for User:</strong>
        <ul style="margin: 6px 0 0 0; padding-left: 18px; line-height: 1.6;">
          <li>Universal Any-to-Any File Converter (PDF, Word, Excel, PPTX up to 500MB+)</li>
          <li>All-Options Image Studio (Target KB, Scaling, WebP/AVIF Transcoding)</li>
          <li>Monaco AST Code Formatter with Zero-Retention</li>
        </ul>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${email}?subject=Welcome%20to%20Morphly%20Platform" class="btn btn-primary" style="margin-right: 8px;">Reply to ${name}</a>
        ${cleanPhoneDigits ? `<a href="https://wa.me/${cleanPhoneDigits}" class="btn btn-secondary">Open in WhatsApp</a>` : ''}
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0;">Automated Lead Notification System • Morphly Platform</p>
      <p style="margin: 4px 0 0 0;">This alert was dispatched automatically to <strong>${ADMIN_NOTIFICATION_EMAIL}</strong>.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const adminTextContent = `
MORPHLY ADMIN ALERT - NEW USER REGISTRATION
============================================================
A new visitor has registered on Morphly.

REGISTERED USER DETAILS:
- Full Name: ${name}
- Email Address: ${email}
- Mobile Number: ${phone}
- Role / Category: ${role}
- Organization / College: ${organization}
- Plan: Pro Unlimited (500MB+ Access)
- Registration Time (IST): ${timestampIST}
- Timestamp (UTC): ${timestampUTC}

DISPATCH RECIPIENT:
- Admin Notification Sent To: ${ADMIN_NOTIFICATION_EMAIL}

============================================================
Morphly Automated Lead System
    `.trim();

    // -------------------------------------------------------------
    // 2. USER WELCOME CONFIRMATION EMAIL (To: user's email)
    // -------------------------------------------------------------
    const userSubject = isRegistration 
      ? `Welcome to Morphly - Your Registration Details & Pro Access`
      : `Morphly Sign-In Notification & Account Summary`;

    const userHtmlContent = `
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
          <td class="detail-label">User Profile</td>
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
          <td class="detail-label">Timestamp (IST)</td>
          <td class="detail-value">${timestampIST}</td>
        </tr>
      </table>

      <div class="perks-box">
        <h3>✨ Your Pro Unlimited Features:</h3>
        <ul class="perks-list">
          <li><strong>Universal File Converter:</strong> Convert PDF, Word (.docx), Excel, PowerPoint, Text, Markdown, HTML, and Images up to 500MB+.</li>
          <li><strong>All-Options Image Studio:</strong> Compress in all possible modes (Lossless vs Lossy, Target KB, Scaling) and export to any format (WebP, JPG, PNG, AVIF, BMP, ICO, PDF).</li>
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

    const userTextContent = `
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
- Timestamp: ${timestampIST}

PRIVACY & SECURITY GUARANTEE:
Morphly enforces a strict Zero Retention policy. Image compression executes 100% in your browser. Document conversions run in isolated temporary RAM and are purged immediately.

© 2026 Morphly Platform
    `.trim();

    // -------------------------------------------------------------
    // 3. DISPATCH VIA SMTP IF CONFIGURED (OR LOG LEAD)
    // -------------------------------------------------------------
    let adminDelivered = false;
    let userDelivered = false;

    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || (smtpUser?.includes("@gmail.com") ? "smtp.gmail.com" : undefined);
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (smtpUser && smtpPass && smtpHost) {
      try {
        const isGmail = smtpHost.includes("gmail.com") || smtpUser.includes("@gmail.com");
        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: "gmail",
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
            : {
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465 || process.env.SMTP_SECURE === "true",
                auth: {
                  user: smtpUser,
                  pass: smtpPass,
                },
              }
        );

        // Send Email #1: Admin Registration Alert (To: ya09shu@gmail.com)
        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Morphly Platform" <${smtpUser}>`,
          to: ADMIN_NOTIFICATION_EMAIL,
          subject: adminSubject,
          text: adminTextContent,
          html: adminHtmlContent,
          replyTo: email,
        });
        adminDelivered = true;
        console.log(`[Admin Alert Dispatched via SMTP] to ${ADMIN_NOTIFICATION_EMAIL}`);

        // Send Email #2: User Welcome Email (To: user's email)
        if (email.toLowerCase() !== ADMIN_NOTIFICATION_EMAIL.toLowerCase()) {
          try {
            await transporter.sendMail({
              from: process.env.SMTP_FROM || `"Morphly Platform" <${smtpUser}>`,
              to: email,
              subject: userSubject,
              text: userTextContent,
              html: userHtmlContent,
            });
            userDelivered = true;
            console.log(`[User Confirmation Dispatched via SMTP] to ${email}`);
          } catch (userErr) {
            console.warn("[User Email Dispatch Warning]:", userErr);
          }
        }
      } catch (smtpErr) {
        console.warn("[SMTP Error, recorded to persistent leads]:", smtpErr);
      }
    } else {
      // Direct lead capture without SMTP credentials configured
      console.log(`[NEW REGISTRATION MAILED TO ADMIN ${ADMIN_NOTIFICATION_EMAIL}]:`);
      console.log(`  Name: ${name}`);
      console.log(`  Email: ${email}`);
      console.log(`  Phone: ${phone}`);
      console.log(`  Role: ${role}`);
      console.log(`  Organization: ${organization}`);
      console.log(`  Timestamp: ${timestampIST}`);
    }

    // Persist lead record safely
    saveLeadRecord({
      id: `lead_${Date.now()}`,
      type,
      name,
      email,
      phone,
      role,
      organization,
      timestamp: timestampIST,
      adminEmail: ADMIN_NOTIFICATION_EMAIL,
      adminDelivered,
    });

    return NextResponse.json({
      success: true,
      adminNotificationEmail: ADMIN_NOTIFICATION_EMAIL,
      adminDelivered,
      userDelivered,
      subject: adminSubject,
      emailPreview: {
        to: email,
        adminTo: ADMIN_NOTIFICATION_EMAIL,
        subject: adminSubject,
        html: adminHtmlContent,
        text: adminTextContent,
        userSubject,
        userHtml: userHtmlContent,
        userText: userTextContent,
        sentAt: timestampIST,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to dispatch email";
    console.error("Email dispatch error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
