// useConversations - Manage conversations list (admin only)
'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePusher } from './usePusher';
import type { Conversation } from '@/types/chat';

export function useConversations(status: 'active' | 'archived' | 'closed' = 'active') {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to admin notifications channel for real-time updates
  const { channel } = usePusher('private-admin-notifications');

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/conversations?status=${status}`);
      const data = await response.json();

      if (data.success) {
        setConversations(data.data);
      } else {
        setError(data.error || 'Failed to fetch conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to fetch conversations');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  // Update conversation status
  const updateConversation = useCallback(
    async (conversationId: number, updates: { status?: string; visitorName?: string; visitorEmail?: string }) => {
      try {
        const response = await fetch(`/api/chat/conversations/${conversationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (data.success) {
          // Refetch to get updated data
          await fetchConversations();
          return true;
        } else {
          console.error('Failed to update conversation:', data.error);
          return false;
        }
      } catch (err) {
        console.error('Error updating conversation:', err);
        return false;
      }
    },
    [fetchConversations]
  );

  // Archive conversation
  const archiveConversation = useCallback(
    async (conversationId: number) => {
      return updateConversation(conversationId, { status: 'archived' });
    },
    [updateConversation]
  );

  // Close conversation
  const closeConversation = useCallback(
    async (conversationId: number) => {
      return updateConversation(conversationId, { status: 'closed' });
    },
    [updateConversation]
  );

  // Reopen conversation
  const reopenConversation = useCallback(
    async (conversationId: number) => {
      return updateConversation(conversationId, { status: 'active' });
    },
    [updateConversation]
  );

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for conversation updates via Pusher (when admin replies)
  useEffect(() => {
    if (!channel) return;

    const handleConversationUpdated = (data: { conversationId: number; unreadCount: number }) => {
      console.log(`📥 Received Pusher event: conversation-updated`, data);
      // Update the conversation in the list
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === data.conversationId) {
            console.log(`✅ Updated unreadCount from ${conv.unreadCount} to ${data.unreadCount}`);
            return { ...conv, unreadCount: data.unreadCount };
          }
          return conv;
        })
      );
    };

    channel.bind('conversation-updated', handleConversationUpdated);

    return () => {
      channel.unbind('conversation-updated', handleConversationUpdated);
    };
  }, [channel]);

  // Poll for updates every 30 seconds (DISABLED - rely on Pusher events instead)
  useEffect(() => {
    // Polling disabled to prevent stale data from overwriting real-time Pusher updates
    // Instead, we use:
    // 1. Pusher events for real-time updates
    // 2. Manual refetch on user actions (send message, close conversation)
    return () => {};
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    updateConversation,
    archiveConversation,
    closeConversation,
    reopenConversation,
  };
}
