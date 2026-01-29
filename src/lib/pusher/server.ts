// Pusher Server Instance
import Pusher from 'pusher';

if (!process.env.PUSHER_APP_ID) {
  throw new Error('PUSHER_APP_ID is not defined');
}

if (!process.env.PUSHER_KEY) {
  throw new Error('PUSHER_KEY is not defined');
}

if (!process.env.PUSHER_SECRET) {
  throw new Error('PUSHER_SECRET is not defined');
}

if (!process.env.PUSHER_CLUSTER) {
  throw new Error('PUSHER_CLUSTER is not defined');
}

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Helper function to trigger events
export async function triggerPusherEvent(
  channel: string,
  event: string,
  data: any
) {
  try {
    await pusherServer.trigger(channel, event, data);
    return { success: true };
  } catch (error) {
    console.error('Pusher trigger error:', error);
    return { success: false, error };
  }
}

// Helper for authenticating private channels
export function authenticateChannel(socketId: string, channelName: string) {
  return pusherServer.authorizeChannel(socketId, channelName);
}

// Helper for authenticating presence channels
export function authenticatePresenceChannel(
  socketId: string,
  channelName: string,
  userId: string,
  userInfo: { name: string }
) {
  return pusherServer.authorizeChannel(socketId, channelName, {
    user_id: userId,
    user_info: userInfo,
  });
}
