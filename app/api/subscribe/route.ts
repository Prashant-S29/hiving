import { NextRequest, NextResponse } from "next/server";
import { EmailServiceConfigurationError, registerSubscriber } from "@/lib/unosend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: { name?: unknown; email?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role.trim().slice(0, 120) : "";

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  try {
    await registerSubscriber({ name: name || undefined, email, role: role || undefined });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof EmailServiceConfigurationError) {
      console.error(`[Subscribe] ${error.message}`);
      return NextResponse.json({ error: "Subscription service is not configured." }, { status: 503 });
    }

    console.error("[Subscribe] UnoSend request failed", error);
    return NextResponse.json({ error: "Could not complete the subscription." }, { status: 502 });
  }
}
