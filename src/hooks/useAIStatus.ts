// useAIStatus - Monitor AI status and typing
'use client';

import { useEffect, useState } from 'react';
import type { Channel } from 'pusher-js';

export function useAIStatus(channel: Channel | null) {
  const [isAITyping, setIsAITyping] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  useEffect(() => {
    if (!channel) return;

    // Listen for AI typing indicator
    const handleAITyping = (data: { isTyping: boolean; conversationId: number }) => {
      setIsAITyping(data.isTyping);
    };

    channel.bind('ai-typing', handleAITyping);

    return () => {
      channel.unbind('ai-typing', handleAITyping);
    };
  }, [channel]);

  // Fetch AI settings (use public endpoint for visitors)
  useEffect(() => {
    const fetchAISettings = async () => {
      try {
        const response = await fetch('/api/chat/settings/public');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setIsAIEnabled(data.data.aiEnabled);
          }
        }
      } catch (error) {
        // Ignore error - default to true
      }
    };

    fetchAISettings();

    // Poll every 30 seconds to sync AI settings
    const interval = setInterval(fetchAISettings, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    isAITyping,
    isAIEnabled,
  };
}
