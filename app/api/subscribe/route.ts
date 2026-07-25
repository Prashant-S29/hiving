import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, role } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // TODO: wire this up to your email provider (Resend, ConvertKit, Beehiiv, etc.)
  // For now this just logs server-side so you can confirm the form works end to end.
  console.log("New subscriber:", { name, email, role, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
