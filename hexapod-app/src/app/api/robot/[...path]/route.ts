import { NextResponse } from 'next/server';
import { networkConfig } from '@/config/network';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const targetUrl = `${networkConfig.api.baseUrl}/${path}`;
  
  console.log(`Proxying request to: ${targetUrl}`);
  
  try {
    // Forward the request to the actual API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    // Clone the response to read it multiple times if needed
    const responseClone = response.clone();
    
    try {
      // Try to get the response as JSON
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (jsonError) {
      // If JSON parsing fails, try to get the response as text
      console.log('Failed to parse JSON, trying text:', jsonError);
      const text = await responseClone.text();
      return new NextResponse(text, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error('Proxy error details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      targetUrl,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy request',
        details: error instanceof Error ? error.message : String(error),
        targetUrl,
      },
      { status: 500 }
    );
  }
}
