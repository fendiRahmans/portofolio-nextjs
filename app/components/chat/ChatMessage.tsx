// ChatMessage - Single message component
'use client';

import { formatMessageDate } from '@/lib/chat/utils';
import { AIBadge } from './AIBadge';
import type { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  isOwnMessage?: boolean;
}

export function ChatMessage({ message, isOwnMessage = false }: ChatMessageProps) {
  const isAI = message.senderType === 'ai';
  const isAdmin = message.senderType === 'admin';
  const isVisitor = message.senderType === 'visitor';

  // Determine alignment and styling
  const alignmentClass = isOwnMessage ? 'justify-end' : 'justify-start';
  const bgClass = isOwnMessage
    ? 'bg-blue-600 text-white'
    : isAI
    ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-gray-900 dark:text-gray-100 border border-blue-200 dark:border-blue-800'
    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';

  return (
    <div className={`flex ${alignmentClass} mb-4`}>
      <div className={`max-w-[80%] md:max-w-[70%]`}>
        {/* Sender badge */}
        {!isOwnMessage && (
          <div className="mb-1 px-1">
            {isAI ? (
              <AIBadge />
            ) : isAdmin ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Admin
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {message.senderId}
              </span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 ${bgClass} shadow-sm`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div className={`mt-1 px-1 text-xs text-gray-500 dark:text-gray-400 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {formatMessageDate(message.createdAt)}
          {isOwnMessage && message.isRead && (
            <span className="ml-1 text-blue-500">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
