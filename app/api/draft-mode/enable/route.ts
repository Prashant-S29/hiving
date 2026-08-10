import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!client || !token) {
    return Response.json(
      { error: "Sanity preview is not configured." },
      { status: 503 }
    );
  }

  const enableDraftMode = defineEnableDraftMode({
    client: client.withConfig({ token, useCdn: false }),
  });

  return enableDraftMode.GET(request);
}
