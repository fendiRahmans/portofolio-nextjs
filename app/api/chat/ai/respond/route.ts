// POST /api/chat/ai/respond - Generate AI response manually (admin can test AI)
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai/openai';
import { db } from '@/db';
import { messages, chatSettings } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { ApiResponse } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Message is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Get AI settings
    const settings = await db.query.chatSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Chat settings not found' } as ApiResponse,
        { status: 404 }
      );
    }

    // Get conversation history if conversationId provided
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    if (conversationId) {
      const messageHistory = await db.query.messages.findMany({
        where: eq(messages.conversationId, parseInt(conversationId)),
        orderBy: [asc(messages.createdAt)],
        limit: 10,
      });

      conversationHistory = messageHistory.map((msg: any) => ({
        role: (msg.senderType === 'visitor' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      }));
    }

    // Generate AI response
    const aiResult = await generateAIResponse(message.trim(), {
      conversationHistory,
      temperature: settings.aiTemperature,
      model: settings.aiModel,
    });

    if (aiResult.error) {
      return NextResponse.json(
        { success: false, error: aiResult.error } as ApiResponse,
        { status: 500 }
      );
    }

    const response: ApiResponse = {
      success: true,
      data: {
        content: aiResult.content,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('AI respond error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate AI response',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
