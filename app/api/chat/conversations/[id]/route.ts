// PATCH /api/chat/conversations/[id] - Update conversation (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { conversations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import type { ApiResponse } from '@/types/chat';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Verify admin authentication
    const session = await verifySession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiResponse,
        { status: 401 }
      );
    }

    // Handle both Promise and direct params (Next.js 15+ compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const conversationId = parseInt(resolvedParams.id);
    if (isNaN(conversationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid conversation ID' } as ApiResponse,
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, visitorName, visitorEmail } = body;

    // Build update object
    const updateData: any = {};
    if (status) updateData.status = status;
    if (visitorName !== undefined) updateData.visitorName = visitorName;
    if (visitorEmail !== undefined) updateData.visitorEmail = visitorEmail;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' } as ApiResponse,
        { status: 400 }
      );
    }

    // Update conversation
    await db
      .update(conversations)
      .set(updateData)
      .where(eq(conversations.id, conversationId));

    // Get updated conversation
    const updatedConversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    });

    const response: ApiResponse = {
      success: true,
      data: updatedConversation,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Update conversation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update conversation',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
