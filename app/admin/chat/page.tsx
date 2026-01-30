// Admin Chat Dashboard Page
import ChatClient from './ChatClient';
import Link from 'next/link';

export const metadata = {
  title: 'Chat Management - Admin',
  description: 'Manage visitor conversations and AI settings',
};

export default function AdminChatPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
        >
          <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="font-medium">Kembali ke Dashboard</span>
        </Link>
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
