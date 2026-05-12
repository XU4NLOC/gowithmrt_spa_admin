import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params;
    const authHeader = req.headers.get("authorization");
    
    console.log('🔄 Proxying unpublish advertisement request for adId:', adId);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${BACKEND_BASE}/api/admin/advertisements/${adId}/unpublish`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    console.log('📡 Backend unpublish response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend unpublish API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied unpublish advertisement request');
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Unpublish Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}
