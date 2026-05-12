import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params;
    const authHeader = req.headers.get("authorization");
    const body = await req.text();
    
    console.log('🔄 Proxying PUT advertisement request for adId:', adId);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${BACKEND_BASE}/api/admin/advertisements/${adId}`, {
      method: "PUT",
      headers,
      body,
      cache: "no-store",
    });

    console.log('📡 Backend PUT response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend PUT API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied PUT advertisement request');
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ PUT Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ adId: string }> }
) {
  try {
    const { adId } = await params;
    const authHeader = req.headers.get("authorization");
    
    console.log('🔄 Proxying DELETE advertisement request for adId:', adId);

    const headers: Record<string, string> = {};

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${BACKEND_BASE}/api/admin/advertisements/${adId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    console.log('📡 Backend DELETE response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend DELETE API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied DELETE advertisement request');
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ DELETE Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}
