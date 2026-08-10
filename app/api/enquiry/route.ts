import { NextRequest, NextResponse } from "next/server";
import { EmailServiceConfigurationError, sendEnquiryNotification } from "@/lib/unosend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; company?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (
    !name ||
    name.length > 100 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !company ||
    company.length > 160 ||
    !message ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "Please provide valid values for all fields." }, { status: 400 });
  }

  try {
    await sendEnquiryNotification({ name, email, company, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailServiceConfigurationError) {
      console.error(`[Enquiry] ${error.message}`);
      return NextResponse.json({ error: "Enquiry service is not configured." }, { status: 503 });
    }

    console.error("[Enquiry] UnoSend request failed", error);
    return NextResponse.json({ error: "Could not send the enquiry." }, { status: 502 });
  }
}
