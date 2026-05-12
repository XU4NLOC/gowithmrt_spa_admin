import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Build the backend URL with query parameters
    const backendUrl = new URL(`${BACKEND_BASE}/api/admin/advertisements`);
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value);
    });

    console.log('🔄 Proxying advertisements request to:', backendUrl.toString());

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied advertisements data');
    
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.text();
    
    console.log('🔄 Proxying POST advertisements request to backend');

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${BACKEND_BASE}/api/admin/advertisements`, {
      method: "POST",
      headers,
      body,
      cache: "no-store",
    });

    console.log('📡 Backend POST response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend POST API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied POST advertisements request');
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ POST Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}
