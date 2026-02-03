// GET /api/chat/conversations - List all conversations (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import type { ApiResponse, Conversation } from '@/types/chat';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';

    // Get conversations with message count
    const allConversations = await db
      .select({
        id: conversations.id,
        visitorId: conversations.visitorId,
        visitorName: conversations.visitorName,
        visitorEmail: conversations.visitorEmail,
        status: conversations.status,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
        unreadCount: sql<number>`(
          SELECT COUNT(*) 
          FROM ${messages} 
          WHERE ${messages.conversationId} = ${conversations.id} 
          AND ${messages.isRead} = 0 
          AND ${messages.senderType} = 'visitor'
        )`,
      })
      .from(conversations)
      .where(eq(conversations.status, status))
      .orderBy(sql`${conversations.lastMessageAt} DESC`);

    // Get last message for each conversation
    const conversationsWithMessages = await Promise.all(
      allConversations.map(async (conv: any) => {
        const lastMessage = await db.query.messages.findFirst({
          where: eq(messages.conversationId, conv.id),
          orderBy: [desc(messages.createdAt)],
        });

        return {
          ...conv,
          messages: lastMessage ? [{
            id: lastMessage.id,
            conversationId: lastMessage.conversationId,
            senderId: lastMessage.senderId,
            senderType: lastMessage.senderType as 'visitor' | 'admin' | 'ai',
            content: lastMessage.content,
            isRead: lastMessage.isRead === 1,
            createdAt: lastMessage.createdAt!,
          }] : [],
          unreadCount: Number(conv.unreadCount),
        };
      })
    );

    const response: ApiResponse<Conversation[]> = {
      success: true,
      data: conversationsWithMessages as Conversation[],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conversations',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
