// usePusher - Manage Pusher connection and subscriptions
'use client';

import { useEffect, useRef, useState } from 'react';
import { getPusherClient, disconnectPusher } from '@/lib/pusher/client';
import type { Channel } from 'pusher-js';

// Initialize pusher instance outside component to avoid re-initialization
let pusherInstance: ReturnType<typeof getPusherClient> | null = null;

function getPusherInstance() {
  if (typeof window === 'undefined') return null;
  if (!pusherInstance) {
    pusherInstance = getPusherClient();
  }
  return pusherInstance;
}

export function usePusher(channelName: string | null) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pusher = getPusherInstance();

  // Set up connection listeners once
  useEffect(() => {
    if (!pusher) return;

    const handleConnected = () => {
      console.log('✅ Pusher connected');
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      console.log('⚠️ Pusher disconnected');
      setIsConnected(false);
    };

    const handleError = (err: unknown) => {
      // Only log if error has meaningful content
      if (err && typeof err === 'object' && Object.keys(err).length > 0) {
        // console.error('Pusher connection error:', err);
      }
      // Ignore empty error objects (normal connection lifecycle)
    };

    pusher.connection.bind('connected', handleConnected);
    pusher.connection.bind('disconnected', handleDisconnected);
    pusher.connection.bind('error', handleError);

    return () => {
      pusher.connection.unbind('connected', handleConnected);
      pusher.connection.unbind('disconnected', handleDisconnected);
      pusher.connection.unbind('error', handleError);
    };
  }, [pusher]);

  // Subscribe to channel
  useEffect(() => {
    if (!channelName || !pusher) return;

    const subscribedChannel = pusher.subscribe(channelName);

    subscribedChannel.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Successfully subscribed to ${channelName}`);
      setChannel(subscribedChannel);
    });

    subscribedChannel.bind('pusher:subscription_error', (error: unknown) => {
      // Only log if it's not a 403 (normal for unauthorized channels like admin)
      const errorStatus = error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : undefined;
      if (errorStatus !== 403) {
        console.error(`❌ Failed to subscribe to ${channelName}:`, error);
      }
    });

    // Cleanup on unmount or channel change
    return () => {
      if (pusher && channelName) {
        pusher.unsubscribe(channelName);
      }
    };
  }, [channelName, pusher]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      disconnectPusher();
    };
  }, []);

  return { channel, isConnected, pusher };
}
