// ChatWindow - Main chat window component
'use client';

import { useEffect, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { AITypingIndicator } from './AITypingIndicator';
import type { Message } from '@/types/chat';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading?: boolean;
  isSending?: boolean;
  isConnected?: boolean;
  isAIEnabled?: boolean;
  isAITyping?: boolean;
  otherIsTyping?: boolean;
  currentUserId?: string;
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

export function ChatWindow({
  messages,
  onSendMessage,
  onTyping,
  isLoading = false,
  isSending = false,
  isConnected = false,
  isAIEnabled = false,
  isAITyping = false,
  otherIsTyping = false,
  currentUserId,
  isAdmin = false,
  title,
  subtitle,
  onClose,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping, otherIsTyping]);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
      <ChatHeader
        title={title}
        subtitle={subtitle}
        isConnected={isConnected}
        isAIEnabled={isAIEnabled}
        onClose={onClose}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
              {isAIEnabled
                ? 'Ask me anything about skills, experience, or projects. I\'m here to help!'
                : 'Send a message to start chatting. We\'ll get back to you soon!'}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              // Determine if this is user's own message
              const isOwnMessage = isAdmin 
                ? message.senderType === 'admin' 
                : currentUserId === message.senderId;
              
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                />
              );
            })}

            {/* AI Typing indicator */}
            {isAITyping && (
              <div className="flex justify-start">
                <AITypingIndicator />
              </div>
            )}

            {/* Other party typing indicator */}
            {otherIsTyping && !isAITyping && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <ChatInput
        onSend={onSendMessage}
        onTyping={onTyping}
        disabled={isSending || isLoading}
        placeholder={isSending ? 'Sending...' : 'Type your message...'}
      />
    </div>
  );
}
