// GET /api/chat/messages - Get messages for a conversation
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { ApiResponse, Message } from '@/types/chat';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' } as ApiResponse,
        { status: 400 }
      );
    }

    const conversationMessages = await db.query.messages.findMany({
      where: eq(messages.conversationId, parseInt(conversationId)),
      orderBy: (messages, { asc }) => [asc(messages.createdAt)],
    });

    const response: ApiResponse<Message[]> = {
      success: true,
      data: conversationMessages.map((msg) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        senderId: msg.senderId,
        senderType: msg.senderType as 'visitor' | 'admin' | 'ai',
        content: msg.content,
        isRead: msg.isRead === 1,
        createdAt: msg.createdAt!,
      })),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch messages',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
