// Visitor session management
import { db } from '@/db';
import { chatSessions, conversations } from '@/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';
import {
  generateVisitorId,
  generateSessionId,
  getSessionExpiryDate,
  isSessionExpired,
} from './utils';

export interface SessionData {
  sessionToken: string;
  visitorId: string;
  conversationId: number | null;
  expiresAt: Date;
}

// Create a new visitor session
export async function createSession(
  ipAddress: string | null,
  userAgent: string | null
): Promise<SessionData> {
  const visitorId = generateVisitorId();
  const sessionToken = generateSessionId();
  const expiryDays = parseInt(process.env.CHAT_SESSION_EXPIRY_DAYS || '7', 10);
  const expiresAt = getSessionExpiryDate(expiryDays);

  try {
    // Insert session into database
    await db.insert(chatSessions).values({
      sessionId: sessionToken,
      visitorId,
      ipAddress,
      userAgent,
      expiresAt,
    });

    return {
      sessionToken,
      visitorId,
      conversationId: null,
      expiresAt,
    };
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session');
  }
}

// Validate existing session
export async function validateSession(
  sessionToken: string
): Promise<SessionData | null> {
  try {
    // Find session in database
    const session = await db.query.chatSessions.findFirst({
      where: eq(chatSessions.sessionId, sessionToken),
    });

    if (!session) {
      return null;
    }

    // Check if expired
    if (isSessionExpired(session.expiresAt)) {
      return null;
    }

    // Update last active timestamp
    await db
      .update(chatSessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(chatSessions.sessionId, sessionToken));

    // Find active conversation for this visitor
    const conversation = await db.query.conversations.findFirst({
      where: and(
        eq(conversations.visitorId, session.visitorId),
        eq(conversations.status, 'active')
      ),
      columns: {
        id: true,
      },
    });

    return {
      sessionToken,
      visitorId: session.visitorId,
      conversationId: conversation?.id || null,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

// Get or create session
export async function getOrCreateSession(
  sessionToken: string | null,
  ipAddress: string | null,
  userAgent: string | null
): Promise<SessionData> {
  // Try to validate existing session
  if (sessionToken) {
    const validSession = await validateSession(sessionToken);
    if (validSession) {
      return validSession;
    }
  }

  // Create new session if validation failed or no token provided
  return createSession(ipAddress, userAgent);
}

// Clean up expired sessions (should be called periodically)
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const now = new Date();
    await db
      .delete(chatSessions)
      .where(lt(chatSessions.expiresAt, now));

    return 0; // MySQL2 doesn't return rowsAffected in delete
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

// Get session by visitor ID
export async function getSessionByVisitorId(
  visitorId: string
): Promise<SessionData | null> {
  try {
    const session = await db.query.chatSessions.findFirst({
      where: and(
        eq(chatSessions.visitorId, visitorId),
        gt(chatSessions.expiresAt, new Date())
      ),
    });

    if (!session) {
      return null;
    }

    // Find active conversation
    const conversation = await db.query.conversations.findFirst({
      where: and(
        eq(conversations.visitorId, visitorId),
        eq(conversations.status, 'active')
      ),
      columns: {
        id: true,
      },
    });

    return {
      sessionToken: session.sessionId,
      visitorId: session.visitorId,
      conversationId: conversation?.id || null,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error('Error getting session by visitor ID:', error);
    return null;
  }
}
