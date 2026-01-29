// Pusher Client Instance
'use client';

import PusherClient from 'pusher-js';

if (!process.env.NEXT_PUBLIC_PUSHER_KEY) {
  throw new Error('NEXT_PUBLIC_PUSHER_KEY is not defined');
}

if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error('NEXT_PUBLIC_PUSHER_CLUSTER is not defined');
}

// Singleton instance
let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      // Suppress empty error logs
      enabledTransports: ['ws', 'wss'],
    });
  }

  return pusherInstance;
}

export function disconnectPusher() {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
