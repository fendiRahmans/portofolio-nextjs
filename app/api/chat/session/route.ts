// POST /api/chat/session - Create or validate visitor session
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateSession } from '@/lib/chat/session';
import { getClientIP, getUserAgent } from '@/lib/chat/utils';
import type { ApiResponse, SessionResponse } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    const ipAddress = getClientIP(request);
    const userAgent = getUserAgent(request);

    // Get or create session
    const sessionData = await getOrCreateSession(
      sessionToken || null,
      ipAddress,
      userAgent
    );

    const response: ApiResponse<SessionResponse> = {
      success: true,
      data: {
        sessionToken: sessionData.sessionToken,
        conversationId: sessionData.conversationId,
        expiresAt: sessionData.expiresAt.toISOString(),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create session',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
