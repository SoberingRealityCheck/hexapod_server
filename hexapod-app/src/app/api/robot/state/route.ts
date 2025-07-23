import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { networkConfig } from '@/config/network';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const targetUrl = `${networkConfig.api.baseUrl}/robot-state`;
    
    console.log(`Proxying request to: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.text();
    
    try {
      const json = JSON.parse(data);
      return NextResponse.json(json, { status: response.status });
    } catch {
      return new NextResponse(data, {
        status: response.status,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to proxy request',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}