// Admin Chat Dashboard Page
import ChatClient from './ChatClient';

export const metadata = {
  title: 'Chat Management - Admin',
  description: 'Manage visitor conversations and AI settings',
};

export default function AdminChatPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Chat Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and respond to visitor conversations
        </p>
      </div>

      <ChatClient />
    </div>
  );
}
