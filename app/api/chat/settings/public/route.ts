// GET /api/chat/settings/public - Get AI settings (public, no auth required)
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { chatSettings } from '@/db/schema';
import type { ApiResponse, ChatSettings } from '@/types/chat';

export async function GET() {
  try {
    // Get current settings (only aiEnabled field for public)
    const settings = await db.query.chatSettings.findFirst({
      columns: {
        aiEnabled: true,
      },
    });

    if (!settings) {
      // Return default if not found
      return NextResponse.json({
        success: true,
        data: { aiEnabled: true },
      } as ApiResponse<{ aiEnabled: boolean }>);
    }

    return NextResponse.json({
      success: true,
      data: { aiEnabled: settings.aiEnabled },
    } as ApiResponse<{ aiEnabled: boolean }>);
  } catch (error) {
    console.error('Get public settings error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch settings',
      } as ApiResponse,
      { status: 500 }
    );
  }
}
