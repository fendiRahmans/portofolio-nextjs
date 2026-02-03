// POST /api/chat/send - Send a message (visitor or admin)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { messages, conversations, chatSettings } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import { triggerPusherEvent } from '@/lib/pusher/server';
import { getConversationChannel, extractNameFromMessage, extractEmailFromMessage } from '@/lib/chat/utils';
import { generateAIResponse } from '@/lib/ai/openai';
import type { ApiResponse, SendMessageResponse, SenderType } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, content, visitorId, sessionToken } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Message content is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Determine sender type and ID
    let senderType: SenderType = 'visitor';
    let senderId = visitorId;

    // Check if sender is admin
    const session = await verifySession();
    if (session) {
      senderType = 'admin';
      senderId = (session.userId as number).toString();
    }

    // If no conversation ID, create new conversation for visitor
    let activeConversationId = conversationId;
    if (!activeConversationId && senderType === 'visitor') {
      if (!visitorId) {
        return NextResponse.json(
          { success: false, error: 'Visitor ID is required' } as ApiResponse,
          { status: 400 }
        );
      }

      // Create new conversation
      const [newConversation] = await db.insert(conversations).values({
        visitorId,
        status: 'active',
      });

      activeConversationId = newConversation.insertId;

      // Try to extract name and email from first message
      const extractedName = extractNameFromMessage(content);
      const extractedEmail = extractEmailFromMessage(content);

      if (extractedName || extractedEmail) {
        await db
          .update(conversations)
          .set({
            visitorName: extractedName,
            visitorEmail: extractedEmail,
          })
          .where(eq(conversations.id, activeConversationId));
      }

      // Notify admin about new conversation
      await triggerPusherEvent('private-admin-notifications', 'new-conversation', {
        conversationId: activeConversationId,
        visitorName: extractedName,
        firstMessage: content,
        createdAt: new Date().toISOString(),
      });
    }

    // Validate conversation exists
    if (!activeConversationId) {
      return NextResponse.json(
        { success: false, error: 'Conversation ID is required' } as ApiResponse,
        { status: 400 }
      );
    }

    // Insert message
    const [messageResult] = await db.insert(messages).values({
      conversationId: activeConversationId,
      senderId,
      senderType,
      content: content.trim(),
    });

    const messageId = messageResult.insertId;

    // If admin is replying, mark all visitor messages as read (regardless of current status)
    if (senderType === 'admin') {
      try {
        console.log(`🔍 Attempting to mark messages read for ConvID: ${activeConversationId} (Type: ${typeof activeConversationId})`);
        
        const updateResult = await db
          .update(messages)
          .set({ isRead: 1 })
          .where(
            and(
              eq(messages.conversationId, Number(activeConversationId)),
              eq(messages.senderType, 'visitor')
            )
          )
          .execute();
        
        console.log(`✅ Update operation result:`, updateResult);
        console.log(`✅ Marked ${(updateResult as any).affectedRows ?? 0} messages as read for conversation ${activeConversationId}`);
      } catch (err) {
        console.error('❌ Error marking messages as read:', err);
      }
    }

    // Update conversation lastMessageAt
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, activeConversationId));

    // Trigger Pusher event for new message
    const channel = getConversationChannel(activeConversationId);
    await triggerPusherEvent(channel, 'new-message', {
      id: messageId,
      conversationId: activeConversationId,
      content: content.trim(),
      senderType,
      senderId,
      createdAt: new Date().toISOString(),
    });

    // If admin replied, trigger event to notify conversations list to refresh
    if (senderType === 'admin') {
      console.log(`📢 Triggering Pusher event: conversation-updated for ID ${activeConversationId}`);
      await triggerPusherEvent('private-admin-notifications', 'conversation-updated', {
        conversationId: activeConversationId,
        unreadCount: 0,
      });
    }

    // Check if AI should respond (only for visitor messages)
    let aiResponse: { messageId: number; content: string } | undefined;
    if (senderType === 'visitor') {
      // Get AI settings
      const settings = await db.query.chatSettings.findFirst();
      
      if (settings && settings.aiEnabled === 1) {
        // Trigger AI typing indicator
        await triggerPusherEvent(channel, 'ai-typing', {
          isTyping: true,
          conversationId: activeConversationId,
        });

        // Get conversation history for context
        const conversationHistory = await db.query.messages.findMany({
          where: eq(messages.conversationId, activeConversationId),
          orderBy: [asc(messages.createdAt)],
          limit: 10, // Last 10 messages for context
        });

        const history = conversationHistory
          .slice(0, -1) // Exclude current message
          .map((msg: any) => ({
            role: (msg.senderType === 'visitor' ? 'user' : 'assistant') as 'user' | 'assistant',
            content: msg.content,
          }));

        // Generate AI response
        const aiResult = await generateAIResponse(content.trim(), {
          conversationHistory: history,
          temperature: settings.aiTemperature,
          model: settings.aiModel,
        });

        // Stop typing indicator
        await triggerPusherEvent(channel, 'ai-typing', {
          isTyping: false,
          conversationId: activeConversationId,
        });

        if (!aiResult.error) {
          // Insert AI message
          const [aiMessageResult] = await db.insert(messages).values({
            conversationId: activeConversationId,
            senderId: 'ai',
            senderType: 'ai',
            content: aiResult.content,
          });

          const aiMessageId = aiMessageResult.insertId;

          // Update conversation lastMessageAt
          await db
            .update(conversations)
            .set({ lastMessageAt: new Date() })
            .where(eq(conversations.id, activeConversationId));

          // Trigger Pusher event for AI message
          await triggerPusherEvent(channel, 'new-message', {
            id: aiMessageId,
            conversationId: activeConversationId,
            content: aiResult.content,
            senderType: 'ai',
            senderId: 'ai',
            createdAt: new Date().toISOString(),
          });

          aiResponse = {
            messageId: aiMessageId,
            content: aiResult.content,
          };
        }
      }
    }

    const response: ApiResponse<SendMessageResponse> = {
      success: true,
      data: {
        messageId,
        conversationId: activeConversationId,
        aiResponse,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
