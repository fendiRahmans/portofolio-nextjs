// useChat - Main chat state management hook
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePusher } from './usePusher';
import { getConversationChannel } from '@/lib/chat/utils';
import type { Message, NewMessageEvent } from '@/types/chat';

interface UseChatOptions {
  conversationId: number | null;
  visitorId?: string;
  sessionToken?: string;
  isAdmin?: boolean;
}

export function useChat(options: UseChatOptions) {
  const { conversationId, visitorId, sessionToken, isAdmin = false } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Get channel name
  const channelName = conversationId ? getConversationChannel(conversationId) : null;

  // Connect to Pusher
  const { channel, isConnected } = usePusher(channelName);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      setIsSending(true);
      setError(null);

      try {
        const response = await fetch('/api/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId,
            content: content.trim(),
            visitorId,
            sessionToken,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          setError(data.error || 'Failed to send message');
        }

        // Messages will be added via Pusher events
        return data;
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message');
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, visitorId, sessionToken]
  );

  // Listen for new messages via Pusher
  useEffect(() => {
    if (!channel) return;

    const handleNewMessage = (data: NewMessageEvent) => {
      const newMessage: Message = {
        id: data.id,
        conversationId: data.conversationId,
        senderId: data.senderId,
        senderType: data.senderType,
        content: data.content,
        isRead: false,
        createdAt: data.createdAt,
      };

      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        if (prev.some((msg) => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });

      // Auto-scroll to bottom
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    channel.bind('new-message', handleNewMessage);

    return () => {
      channel.unbind('new-message', handleNewMessage);
    };
  }, [channel]);

  // Initial fetch
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId, fetchMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  return {
    messages,
    isLoading,
    isSending,
    error,
    isConnected,
    sendMessage,
    fetchMessages,
    messageEndRef,
  };
}
