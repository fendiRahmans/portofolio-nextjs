// useChatSession - Manage visitor chat session
'use client';

import { useEffect, useState } from 'react';
import type { SessionResponse } from '@/types/chat';

const SESSION_STORAGE_KEY = 'chat_session_token';

export function useChatSession() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check for existing session token
        const existingToken = localStorage.getItem(SESSION_STORAGE_KEY);

        const response = await fetch('/api/chat/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionToken: existingToken,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const sessionData: SessionResponse = data.data;
          
          setSessionToken(sessionData.sessionToken);
          setConversationId(sessionData.conversationId);
          
          // Store in localStorage
          localStorage.setItem(SESSION_STORAGE_KEY, sessionData.sessionToken);

          // Extract visitorId from token (format: visitor_uuid)
          // We'll get this from the session response in a real implementation
          // For now, we'll store it when we create a conversation
        } else {
          setError(data.error || 'Failed to initialize session');
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to initialize session');
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  // Update conversation ID when a new conversation is created
  const updateConversationId = (id: number) => {
    setConversationId(id);
  };

  // Clear session (logout)
  const clearSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setSessionToken(null);
    setConversationId(null);
    setVisitorId(null);
  };

  return {
    sessionToken,
    conversationId,
    visitorId,
    isLoading,
    error,
    updateConversationId,
    clearSession,
  };
}
