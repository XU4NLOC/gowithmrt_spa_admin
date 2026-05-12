import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const url = `${BACKEND_BASE}/api/admin/customers/${encodeURIComponent(userId)}/status`;

    const authHeader = req.headers.get("authorization") || undefined;
    const body = await req.text();

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body,
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


