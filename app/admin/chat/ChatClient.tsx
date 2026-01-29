// Admin Chat Dashboard Client Component
'use client';

import { useState } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ConversationList } from '@/components/chat/ConversationList';
import { AIToggleSwitch } from '@/components/chat/AIToggleSwitch';
import { useChat, useConversations, useChatSettings, useTyping, useAIStatus, usePusher, useAdminNotifications } from '@/hooks';
import { getConversationChannel } from '@/lib/chat/utils';

export default function ChatClient() {
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'closed'>('active');

  // Fetch conversations
  const { conversations, isLoading: conversationsLoading, closeConversation, fetchConversations } = useConversations(activeTab);

  // Chat settings
  const { settings, toggleAI, isSaving } = useChatSettings();

  // Admin notifications
  const { newConversationAlert, newMessageCount, clearAlert } = useAdminNotifications();

  // Chat for active conversation
  const {
    messages,
    isLoading: messagesLoading,
    isSending,
    isConnected,
    sendMessage,
  } = useChat({
    conversationId: activeConversationId,
    isAdmin: true,
  });

  // Get channel for active conversation
  const channelName = activeConversationId ? getConversationChannel(activeConversationId) : null;
  const { channel } = usePusher(channelName);

  // Typing indicator
  const { otherIsTyping, sendTypingIndicator } = useTyping(channel, 'admin');

  // AI status
  const { isAITyping } = useAIStatus(channel);

  const handleToggleAI = async () => {
    if (settings) {
      await toggleAI(!settings.aiEnabled);
    }
  };

  const handleSelectConversation = async (conversationId: number) => {
    setActiveConversationId(conversationId);
    clearAlert();

    // Mark messages as read when admin opens conversation
    try {
      await fetch('/api/chat/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
    // Refetch conversations to update unread count after a small delay
    // to ensure database has been updated
    setTimeout(() => {
      fetchConversations();
    }, 500);
  };

  const handleCloseConversation = async (conversationId: number) => {
    try {
      const success = await closeConversation(conversationId);
      
      if (success) {
        // Refetch conversations list
        await fetchConversations();
        // Reset active conversation if it was the closed one
        if (activeConversationId === conversationId) {
          setActiveConversationId(null);
        }
      }
    } catch (error) {
      console.error('Failed to close conversation:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      {/* Sidebar - Conversations List */}
      <div className="w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Conversations</h2>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* New message notification */}
          {newConversationAlert && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                New conversation from {newConversationAlert.visitorName || 'Visitor'}
              </p>
            </div>
          )}

          {/* AI Toggle */}
          {showSettings && settings && (
            <div className="mb-4">
              <AIToggleSwitch
                enabled={settings.aiEnabled}
                onChange={handleToggleAI}
                disabled={isSaving}
              />
            </div>
          )}

          {/* Tabs untuk filter status */}
          <div className="flex gap-2 mb-4">
            {(['active', 'archived', 'closed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setActiveConversationId(null);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto p-4">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onCloseConversation={handleCloseConversation}
            isLoading={conversationsLoading}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {activeConversationId ? (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={sendTypingIndicator}
            isLoading={messagesLoading}
            isSending={isSending}
            isConnected={true}
            isAIEnabled={settings?.aiEnabled ?? false}
            isAITyping={isAITyping}
            otherIsTyping={otherIsTyping}
            currentUserId="admin"
            isAdmin={true}
            title="Admin Chat"
            subtitle="Responding to visitor"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-center px-4">
            <div>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose a conversation from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
