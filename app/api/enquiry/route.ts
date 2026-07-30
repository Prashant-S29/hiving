import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, company, message } = body;

  if (!name || !email || !email.includes("@") || !company || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // TODO: wire this up to your email provider or CRM (Resend, HubSpot, etc.)
  // For now this just logs server-side so you can confirm the form works end to end.
  console.log("New consultancy enquiry:", { name, email, company, message, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
