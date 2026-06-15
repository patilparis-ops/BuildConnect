import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@buildconnect.in";

let resend: Resend | null = null;

if (RESEND_API_KEY) {
  try {
    resend = new Resend(RESEND_API_KEY);
    console.log("[email] Resend client initialized");
  } catch (err) {
    console.warn("[email] Failed to initialize Resend client:", (err as Error).message);
  }
} else {
  console.warn("[email] RESEND_API_KEY not set — emails will be logged to console instead of sent");
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!resend) {
    // Fallback: log to console in development
    console.log("\n========================================");
    console.log(`[email] TO: ${options.to}`);
    console.log(`[email] SUBJECT: ${options.subject}`);
    console.log(`[email] BODY: ${options.text || options.html.replace(/<[^>]*>/g, "")}`);
    console.log("========================================\n");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      console.error("[email] Failed to send email:", error);
    } else {
      console.log(`[email] Sent to ${options.to}: ${options.subject}`);
    }
  } catch (err) {
    console.error("[email] Failed to send email:", (err as Error).message);
  }
}

export function buildPasswordResetEmail(resetToken: string): { subject: string; html: string; text: string } {
  const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

  return {
    subject: "Reset your BuildConnect password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">Reset your password</h2>
        <p style="color: #64748b; line-height: 1.6;">
          We received a request to reset the password for your BuildConnect account.
          Click the button below to set a new password. This link expires in 30 minutes.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `Reset your BuildConnect password\n\nWe received a request to reset the password for your BuildConnect account.\n\nVisit this link to set a new password (expires in 30 minutes):\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`,
  };
}
