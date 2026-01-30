// POST /api/pusher/auth - Pusher channel authentication
import { NextRequest, NextResponse } from 'next/server';
import { authenticateChannel, authenticatePresenceChannel } from '@/lib/pusher/server';
import { verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Pusher sends application/x-www-form-urlencoded
    const text = await request.text();
    const params = new URLSearchParams(text);
    const socket_id = params.get('socket_id');
    const channel_name = params.get('channel_name');

    if (!socket_id || !channel_name) {
      return NextResponse.json(
        { error: 'Missing socket_id or channel_name' },
        { status: 400 }
      );
    }

    // Check if it's an admin channel (requires authentication)
    if (channel_name.includes('admin')) {
      const session = await verifySession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // For presence channels
      if (channel_name.startsWith('presence-')) {
        const auth = authenticatePresenceChannel(
          socket_id,
          channel_name,
          (session.userId as number).toString(),
          { name: 'Admin' }
        );
        return NextResponse.json(auth);
      }

      // For private channels
      const auth = authenticateChannel(socket_id, channel_name);
      return NextResponse.json(auth);
    }

    // For visitor conversation channels (private-conversation-*)
    if (channel_name.startsWith('private-conversation-')) {
      // Allow authentication (visitor can subscribe to their own conversation)
      const auth = authenticateChannel(socket_id, channel_name);
      return NextResponse.json(auth);
    }

    return NextResponse.json({ error: 'Invalid channel' }, { status: 403 });
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
