// Visitor Chat Page Client Component
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { useChat, useChatSession, useTyping, useAIStatus, usePusher } from '@/hooks';
import { getConversationChannel, generateVisitorId } from '@/lib/chat/utils';

export default function ChatPageClient() {
  const [visitorId, setVisitorId] = useState<string>('');
  const { sessionToken, conversationId, isLoading: sessionLoading, updateConversationId } = useChatSession();

  // Initialize visitor ID
  useEffect(() => {
    const storedVisitorId = localStorage.getItem('chat_visitor_id');
    if (storedVisitorId) {
      setVisitorId(storedVisitorId);
    } else {
      const newVisitorId = generateVisitorId();
      localStorage.setItem('chat_visitor_id', newVisitorId);
      setVisitorId(newVisitorId);
    }
  }, []);

  // Chat hook
  const {
    messages,
    isLoading,
    isSending,
    isConnected,
    sendMessage,
  } = useChat({
    conversationId,
    visitorId,
    sessionToken: sessionToken || undefined,
    isAdmin: false,
  });

  // Get channel
  const channelName = conversationId ? getConversationChannel(conversationId) : null;
  const { channel } = usePusher(channelName);

  // Typing indicator
  const { otherIsTyping, sendTypingIndicator } = useTyping(channel, 'visitor');

  // AI status
  const { isAITyping, isAIEnabled } = useAIStatus(channel);

  // Handle send message
  const handleSendMessage = async (content: string) => {
    const result = await sendMessage(content);
    
    // If this is first message and conversation was created, update conversation ID
    if (result?.success && result.data?.conversationId && !conversationId) {
      updateConversationId(result.data.conversationId);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>

        <div className="h-[calc(100vh-8rem)]">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            onTyping={sendTypingIndicator}
            isLoading={isLoading}
            isSending={isSending}
            isConnected={conversationId ? isConnected : true}
            isAIEnabled={isAIEnabled}
            isAITyping={isAITyping}
            otherIsTyping={otherIsTyping}
            currentUserId={visitorId}
            title="Chat with Us"
            subtitle="Powered by AI Assistant"
          />
        </div>
      </div>
    </div>
  );
}
