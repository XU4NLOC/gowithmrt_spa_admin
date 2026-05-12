import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.toString();
    const url = `${BACKEND_BASE}/api/admin/customers${search ? `?${search}` : ""}`;

    const authHeader = req.headers.get("authorization") || undefined;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    });

    const text = await response.text();
    const body = text ? JSON.parse(text) : {};
    return Response.json(body, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 502 });
  }
}





