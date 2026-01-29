// useAdminNotifications - Listen for admin notifications
'use client';

import { useEffect, useState } from 'react';
import { usePusher } from './usePusher';
import { getAdminNotificationsChannel } from '@/lib/chat/utils';
import type { NewConversationAlert } from '@/types/chat';

export function useAdminNotifications() {
  const [newConversationAlert, setNewConversationAlert] = useState<NewConversationAlert | null>(null);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const channelName = getAdminNotificationsChannel();
  const { channel } = usePusher(channelName);

  useEffect(() => {
    if (!channel) return;

    // Listen for new conversation alerts
    const handleNewConversation = (data: NewConversationAlert) => {
      setNewConversationAlert(data);
      setNewMessageCount((prev) => prev + 1);

      // Auto-clear alert after 5 seconds
      setTimeout(() => {
        setNewConversationAlert(null);
      }, 5000);

      // Play notification sound (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Chat Conversation', {
          body: data.firstMessage.substring(0, 100),
          icon: '/favicon.ico',
        });
      }
    };

    // Listen for new message alerts
    const handleNewMessageAlert = (data: { conversationId: number; messagePreview: string }) => {
      setNewMessageCount((prev) => prev + 1);

      // Play notification sound (optional)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Message', {
          body: data.messagePreview.substring(0, 100),
          icon: '/favicon.ico',
        });
      }
    };

    // Listen for AI settings changes
    const handleAISettingsChanged = (data: { aiEnabled: boolean; changedBy: string }) => {
      console.log('AI settings changed:', data);
    };

    channel.bind('new-conversation', handleNewConversation);
    channel.bind('new-message-alert', handleNewMessageAlert);
    channel.bind('ai-settings-changed', handleAISettingsChanged);

    return () => {
      channel.unbind('new-conversation', handleNewConversation);
      channel.unbind('new-message-alert', handleNewMessageAlert);
      channel.unbind('ai-settings-changed', handleAISettingsChanged);
    };
  }, [channel]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const clearAlert = () => {
    setNewConversationAlert(null);
  };

  const clearMessageCount = () => {
    setNewMessageCount(0);
  };

  return {
    newConversationAlert,
    newMessageCount,
    clearAlert,
    clearMessageCount,
  };
}
