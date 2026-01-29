// Chat utility functions
import { v4 as uuidv4 } from 'uuid';

// Generate unique visitor ID
export function generateVisitorId(): string {
  return `visitor_${uuidv4()}`;
}

// Generate session ID
export function generateSessionId(): string {
  return uuidv4();
}

// Calculate session expiry date
export function getSessionExpiryDate(days: number = 7): Date {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);
  return expiryDate;
}

// Check if session is expired
export function isSessionExpired(expiresAt: Date | string): boolean {
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expiry < new Date();
}

// Format date for display
export function formatMessageDate(date: Date | string): string {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

// Get channel name for conversation
export function getConversationChannel(conversationId: number): string {
  return `private-conversation-${conversationId}`;
}

// Get admin notifications channel
export function getAdminNotificationsChannel(): string {
  return 'private-admin-notifications';
}

// Get admin presence channel
export function getAdminPresenceChannel(): string {
  return 'presence-admin-chat';
}

// Extract visitor name from message (if they introduce themselves)
export function extractNameFromMessage(message: string): string | null {
  // Simple pattern matching for common introduction phrases
  const patterns = [
    /(?:my name is|i'm|i am|this is) ([a-z]+)/i,
    /^([a-z]+) here/i,
    /^hi,? (?:my name is )?([a-z]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      // Capitalize first letter
      return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    }
  }

  return null;
}

// Extract email from message
export function extractEmailFromMessage(message: string): string | null {
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = message.match(emailPattern);
  return match ? match[0] : null;
}

// Truncate message for preview
export function truncateMessage(message: string, maxLength: number = 50): string {
  if (message.length <= maxLength) {
    return message;
  }
  return message.substring(0, maxLength) + '...';
}

// Get IP address from request
export function getClientIP(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return null;
}

// Get user agent from request
export function getUserAgent(request: Request): string | null {
  return request.headers.get('user-agent');
}
