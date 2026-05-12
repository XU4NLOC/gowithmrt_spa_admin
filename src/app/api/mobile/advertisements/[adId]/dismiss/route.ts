import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params;
    const userId = req.headers.get("user-id");
    
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!adId) {
      return Response.json({ error: "Ad ID is required" }, { status: 400 });
    }

    const url = `${BACKEND_BASE}/api/mobile/advertisements/${encodeURIComponent(adId)}/dismiss`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-ID": userId,
      },
      cache: "no-store",
    });

    const text = await response.text();
    const json = text ? JSON.parse(text) : {};
    return Response.json(json, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}
