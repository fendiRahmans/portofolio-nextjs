// useTyping - Manage typing indicators
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Channel } from 'pusher-js';

export function useTyping(channel: Channel | null, senderType: 'visitor' | 'admin') {
  const [isTyping, setIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send typing indicator
  const sendTypingIndicator = (typing: boolean) => {
    if (!channel) return;

    setIsTyping(typing);
    
    // Trigger client event (requires presence or private channel)
    channel.trigger('client-typing', {
      senderType,
      isTyping: typing,
    });

    // Auto-stop typing after 3 seconds of inactivity
    if (typing) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        channel.trigger('client-typing', {
          senderType,
          isTyping: false,
        });
      }, 3000);
    }
  };

  // Listen for typing from other party
  useEffect(() => {
    if (!channel) return;

    const handleTyping = (data: { senderType: string; isTyping: boolean }) => {
      // Only show typing if it's from the other party
      if (data.senderType !== senderType) {
        setOtherIsTyping(data.isTyping);
      }
    };

    channel.bind('client-typing', handleTyping);

    return () => {
      channel.unbind('client-typing', handleTyping);
    };
  }, [channel, senderType]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isTyping,
    otherIsTyping,
    sendTypingIndicator,
  };
}
