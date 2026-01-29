// usePusher - Manage Pusher connection and subscriptions
'use client';

import { useEffect, useRef, useState } from 'react';
import { getPusherClient, disconnectPusher } from '@/lib/pusher/client';
import type { Channel } from 'pusher-js';

export function usePusher(channelName: string | null) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef<ReturnType<typeof getPusherClient> | null>(null);

  useEffect(() => {
    if (!channelName) return;

    // Initialize Pusher client
    if (!pusherRef.current) {
      pusherRef.current = getPusherClient();

      // Connection state listeners
      pusherRef.current.connection.bind('connected', () => {
        console.log('✅ Pusher connected');
        setIsConnected(true);
      });

      pusherRef.current.connection.bind('disconnected', () => {
        console.log('⚠️ Pusher disconnected');
        setIsConnected(false);
      });

      pusherRef.current.connection.bind('error', (err: any) => {
        // Only log if error has meaningful content
        if (err && Object.keys(err).length > 0) {
          // console.error('Pusher connection error:', err);
        }
        // Ignore empty error objects (normal connection lifecycle)
      });
    }

    // Subscribe to channel
    const subscribedChannel = pusherRef.current.subscribe(channelName);

    subscribedChannel.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Successfully subscribed to ${channelName}`);
      setChannel(subscribedChannel);
    });

    subscribedChannel.bind('pusher:subscription_error', (error: any) => {
      // Only log if it's not a 403 (normal for unauthorized channels like admin)
      if (error?.status !== 403) {
        console.error(`❌ Failed to subscribe to ${channelName}:`, error);
      }
    });

    // Cleanup on unmount or channel change
    return () => {
      if (pusherRef.current && channelName) {
        pusherRef.current.unsubscribe(channelName);
      }
    };
  }, [channelName]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      disconnectPusher();
      pusherRef.current = null;
    };
  }, []);

  return { channel, isConnected, pusher: pusherRef.current };
}
