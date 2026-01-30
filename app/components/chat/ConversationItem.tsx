// ConversationItem - Single conversation in list
'use client';

import { formatMessageDate, truncateMessage } from '@/lib/chat/utils';
import type { Conversation } from '@/types/chat';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
  onClose?: () => void;
}

export function ConversationItem({ conversation, isActive = false, onClick, onClose }: ConversationItemProps) {
  const lastMessage = conversation.messages?.[0];
  const hasUnread = (conversation.unreadCount ?? 0) > 0;

  return (
    <div
      className={`w-full text-left p-4 rounded-lg transition-colors cursor-pointer ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
          : 'bg-white dark:bg-gray-800 border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            hasUnread ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}>
            <span className="text-white font-semibold">
              {conversation.visitorName?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h4 className={`font-medium ${hasUnread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
              {conversation.visitorName || `Visitor ${conversation.visitorId.slice(-4)}`}
            </h4>
            {conversation.visitorEmail && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.visitorEmail}</p>
            )}
          </div>
        </div>

        {hasUnread && (
          <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      {lastMessage && (
        <div className="ml-12">
          <p className={`text-sm ${hasUnread ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
            {truncateMessage(lastMessage.content, 60)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatMessageDate(lastMessage.createdAt!)}
          </p>
        </div>
      )}

      {/* Status badge & Close button */}
      <div className="ml-12 mt-2 flex items-center justify-between">
        <div>
          {conversation.status === 'active' && onClose ? (
            <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
              active
            </span>
          ) : (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              conversation.status === 'archived'
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {conversation.status === 'archived' ? 'Archived' : 'Closed'}
            </span>
          )}
        </div>
        
        {conversation.status === 'active' && onClose && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-xs px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
            title="Close conversation"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
