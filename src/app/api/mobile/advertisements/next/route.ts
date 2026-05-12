import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("user-id");
    
    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const url = `${BACKEND_BASE}/api/mobile/advertisements/next`;
    
    const response = await fetch(url, {
      method: "GET",
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
