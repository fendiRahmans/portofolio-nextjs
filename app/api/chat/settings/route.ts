// GET/PATCH /api/chat/settings - Manage chat settings (admin only)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import { triggerPusherEvent } from '@/lib/pusher/server';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { buildPortfolioContext } from '@/lib/ai/context-builder';
import type { ApiResponse, ChatSettings } from '@/types/chat';

// GET - Get current chat settings
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

    let settings = await db.query.chatSettings.findFirst();

    // If no settings exist, create default
    if (!settings) {
      const portfolioContext = await buildPortfolioContext();
      const defaultPrompt = buildSystemPrompt(portfolioContext);

      const [result] = await db.insert(chatSettings).values({
        aiEnabled: 1,
        aiModel: 'gpt-4o-mini',
        aiTemperature: 70,
        systemPrompt: defaultPrompt,
        autoReplyDelay: 2000,
      });

      settings = await db.query.chatSettings.findFirst();
    }

    const response: ApiResponse<ChatSettings> = {
      success: true,
      data: settings ? {
        id: settings.id,
        aiEnabled: settings.aiEnabled === 1,
        aiModel: settings.aiModel,
        aiTemperature: settings.aiTemperature,
        systemPrompt: settings.systemPrompt,
        autoReplyDelay: settings.autoReplyDelay,
        createdAt: settings.createdAt!,
        updatedAt: settings.updatedAt!,
      } : undefined,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch settings',
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// PATCH - Update chat settings
export async function PATCH(request: NextRequest) {
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
    const { aiEnabled, aiModel, aiTemperature, systemPrompt, autoReplyDelay } = body;

    // Get existing settings
    let settings = await db.query.chatSettings.findFirst();

    // Build update object
    const updateData: any = {};
    if (aiEnabled !== undefined) updateData.aiEnabled = aiEnabled ? 1 : 0;
    if (aiModel) updateData.aiModel = aiModel;
    if (aiTemperature !== undefined) updateData.aiTemperature = aiTemperature;
    if (systemPrompt) updateData.systemPrompt = systemPrompt;
    if (autoReplyDelay !== undefined) updateData.autoReplyDelay = autoReplyDelay;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' } as ApiResponse,
        { status: 400 }
      );
    }

    if (settings) {
      // Update existing settings
      await db
        .update(chatSettings)
        .set(updateData)
        .where(eq(chatSettings.id, settings.id));
    } else {
      // Create new settings if none exist
      const portfolioContext = await buildPortfolioContext();
      const defaultPrompt = buildSystemPrompt(portfolioContext);

      await db.insert(chatSettings).values({
        aiEnabled: updateData.aiEnabled ?? 1,
        aiModel: updateData.aiModel ?? 'gpt-4o-mini',
        aiTemperature: updateData.aiTemperature ?? 70,
        systemPrompt: updateData.systemPrompt ?? defaultPrompt,
        autoReplyDelay: updateData.autoReplyDelay ?? 2000,
      });
    }

    // Get updated settings
    const updatedSettings = await db.query.chatSettings.findFirst();

    // Notify admin about AI settings change
    if (aiEnabled !== undefined) {
      await triggerPusherEvent('private-admin-notifications', 'ai-settings-changed', {
        aiEnabled: aiEnabled,
        changedBy: 'Admin',
      });
    }

    const response: ApiResponse<ChatSettings> = {
      success: true,
      data: updatedSettings ? {
        id: updatedSettings.id,
        aiEnabled: updatedSettings.aiEnabled === 1,
        aiModel: updatedSettings.aiModel,
        aiTemperature: updatedSettings.aiTemperature,
        systemPrompt: updatedSettings.systemPrompt,
        autoReplyDelay: updatedSettings.autoReplyDelay,
        createdAt: updatedSettings.createdAt!,
        updatedAt: updatedSettings.updatedAt!,
      } : undefined,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update settings',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
