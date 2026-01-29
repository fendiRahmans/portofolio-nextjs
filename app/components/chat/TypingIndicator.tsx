// TypingIndicator - Animated typing indicator
'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 rounded-lg max-w-fit">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500">Typing...</span>
    </div>
  );
}
