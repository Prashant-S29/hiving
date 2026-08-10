import { Unosend } from "@unosend/node";

export class EmailServiceConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailServiceConfigurationError";
  }
}

interface SubscriberInput {
  name?: string;
  email: string;
  role?: string;
}

interface EnquiryInput {
  name: string;
  email: string;
  company: string;
  message: string;
}

let unosendClient: Unosend | null = null;

function getClient() {
  const apiKey = process.env.UNOSEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) {
    throw new EmailServiceConfigurationError("UNOSEND_API_KEY is not configured");
  }

  unosendClient ??= new Unosend({ apiKey, baseUrl: "https://api.unosend.co/v1" });
  return unosendClient;
}

function getFromAddress() {
  return process.env.UNOSEND_FROM_EMAIL || "Hivig <hello@hivig.com>";
}

function getNotificationAddress() {
  const address = process.env.UNOSEND_NOTIFICATION_EMAIL;
  if (!address) {
    throw new EmailServiceConfigurationError("UNOSEND_NOTIFICATION_EMAIL is not configured");
  }
  return address;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function splitName(name?: string) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) || [];
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
}

export async function registerSubscriber({ name, email, role }: SubscriberInput) {
  const unosend = getClient();
  const destination = getNotificationAddress();
  const { firstName } = splitName(name);
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : "Hello,";
  const textGreeting = firstName ? `Hi ${firstName},` : "Hello,";
  const safeName = name ? escapeHtml(name) : "Not provided";
  const safeRole = role ? escapeHtml(role) : "Not provided";

  // UnoSend's live API currently supports delivery but not the contacts/audiences
  // advertised by its SDK. Send separate welcome and internal notification
  // messages until a private subscriber store is introduced.
  const result = await unosend.emails.batch([
    {
      from: getFromAddress(),
      to: email,
      replyTo: destination,
      subject: "Welcome to Hivig",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:32px 20px;font-family:Arial,sans-serif;line-height:1.65;color:#171717">
          <p>${greeting}</p>
          <h1 style="font-size:28px;line-height:1.2">Welcome to Hivig.</h1>
          <p>You are now subscribed to independent intelligence on agentic AI.</p>
          <p>We will send platform verdicts, implementation guides, and clear-eyed analysis—without vendor sponsorship.</p>
          <p style="margin-top:32px">— The Hivig Editorial Team</p>
        </div>
      `,
      text: `${textGreeting}\n\nWelcome to Hivig. You are now subscribed to independent intelligence on agentic AI.\n\nWe will send platform verdicts, implementation guides, and clear-eyed analysis—without vendor sponsorship.\n\n— The Hivig Editorial Team`,
      tags: [{ name: "message_type", value: "subscription_welcome" }],
    },
    {
      from: getFromAddress(),
      to: destination,
      replyTo: email,
      subject: "New Hivig subscriber",
      html: `
        <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,sans-serif;line-height:1.6;color:#171717">
          <h1 style="font-size:24px">New subscriber</h1>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Role:</strong> ${safeRole}</p>
        </div>
      `,
      text: `New Hivig subscriber\n\nName: ${name || "Not provided"}\nEmail: ${email}\nRole: ${role || "Not provided"}`,
      tags: [{ name: "message_type", value: "subscription_notification" }],
    },
  ]);

  if (result.error) {
    throw new Error(`UnoSend subscription emails failed: ${result.error.message}`);
  }

  return { queued: true };
}

export async function sendEnquiryNotification({ name, email, company, message }: EnquiryInput) {
  const unosend = getClient();
  const destination = getNotificationAddress();
  const result = await unosend.emails.send({
    from: getFromAddress(),
    to: destination,
    replyTo: email,
    subject: `New Hivig consultancy enquiry from ${name}`,
    html: `
      <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,sans-serif;line-height:1.6;color:#171717">
        <h1 style="font-size:24px">New consultancy enquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company)}</p>
        <h2 style="font-size:18px;margin-top:28px">What they are building</h2>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `,
    text: `New consultancy enquiry\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nWhat they are building:\n${message}`,
    tags: [{ name: "message_type", value: "consultancy_enquiry" }],
  });

  if (result.error) {
    throw new Error(`UnoSend enquiry notification failed: ${result.error.message}`);
  }

  return { emailId: result.data?.id };
}
