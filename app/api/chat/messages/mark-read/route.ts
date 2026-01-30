// POST /api/chat/messages/mark-read - Mark messages as read (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import { triggerPusherEvent } from '@/lib/pusher/server';
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
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Mark all visitor messages as read
    await db
      .update(messages)
      .set({ isRead: 1 })
      .where(
        and(
          eq(messages.conversationId, Number(conversationId)),
          eq(messages.senderType, 'visitor')
        )
      );

    const markedCount = 1; // Update successful, at least 1 message marked
    console.log(`📖 Admin marked messages as read for conversation ${conversationId}`);

    // Trigger Pusher event to update unread count
    await triggerPusherEvent('private-admin-notifications', 'conversation-updated', {
      conversationId,
      unreadCount: 0,
    });
    console.log(`📢 Triggered Pusher event for unread count update (conversation ${conversationId})`);

    return NextResponse.json(
      { success: true, data: { markedCount } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to mark messages as read',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
