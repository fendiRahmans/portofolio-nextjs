// Visitor Chat Page
import { redirect } from 'next/navigation';
import ChatPageClient from './ChatPageClient';
import { getChatEnabled } from '@/actions/settings';

export const metadata = {
  title: 'Chat Support',
  description: 'Chat with us - Get instant answers from our AI assistant',
};

export default async function ChatPage() {
  const isChatEnabled = await getChatEnabled();

  // Redirect to home if chat is disabled
  if (!isChatEnabled) {
    redirect('/');
  }

  return <ChatPageClient />;
}
