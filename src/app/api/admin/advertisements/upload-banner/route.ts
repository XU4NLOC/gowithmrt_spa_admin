import { NextRequest } from "next/server";
import { getBackendApiBase } from "@/config/api";

const BACKEND_BASE = getBackendApiBase();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const formData = await req.formData();
    
    console.log('🔄 Proxying upload banner request to backend');

    const headers: Record<string, string> = {};

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(`${BACKEND_BASE}/api/admin/advertisements/upload-banner`, {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    });

    console.log('📡 Backend upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Backend upload API Error:', response.status, errorText);
      return Response.json({ 
        error: `Backend API error: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    console.log('✅ Successfully proxied upload banner request');
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Upload Proxy error:', error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: `Proxy error: ${message}` }, { status: 502 });
  }
}
