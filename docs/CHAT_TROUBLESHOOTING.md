# Chat Feature - Troubleshooting Guide

## Common Issues & Solutions

### 1. "Pusher connection error"

**Problem**: Chat not connecting to Pusher

**Solutions**:
```bash
# Check environment variables
- Verify PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET in .env.local
- Verify NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER
- Make sure cluster matches (default: ap1)
- Restart dev server after changing .env
```

### 2. "AI not responding"

**Problem**: Messages sent but no AI reply

**Solutions**:
```bash
# Check OpenAI API key
- Verify OPENAI_API_KEY is set correctly
- Check API key has credits
- Verify AI is enabled in admin settings (/admin/chat)
- Check console for errors
```

### 3. "Session not persisting"

**Problem**: Chat resets on page refresh

**Solutions**:
- Check localStorage is enabled in browser
- Check browser console for errors
- Clear localStorage and try again: `localStorage.clear()`

### 4. "Messages not showing in realtime"

**Problem**: Have to refresh to see new messages

**Solutions**:
- Check Pusher connection status
- Verify channel authentication is working
- Check browser console for Pusher errors
- Try different browser

### 5. "Admin can't see conversations"

**Problem**: Conversation list is empty

**Solutions**:
```bash
# Verify admin authentication
- Make sure you're logged in as admin
- Check /admin routes are protected
- Try logout and login again
- Check database has conversations: SELECT * FROM conversations;
```

### 6. "Database errors"

**Problem**: SQL errors in console

**Solutions**:
```bash
# Regenerate database
npm run db:generate
npm run db:push

# Reseed default settings
npm run db:seed
```

### 7. "Typing indicators not working"

**Problem**: Can't see when other party is typing

**Solutions**:
- Check Pusher connection
- Verify channel is private (starts with `private-`)
- Check client-events are enabled in Pusher dashboard
- Make sure both parties are in same conversation

### 8. "Module not found errors"

**Problem**: TypeScript can't find imports

**Solutions**:
```bash
# Check tsconfig.json paths
- Verify @/* alias includes src, types, and app folders
- Restart TypeScript server in VS Code
- Delete .next folder and rebuild: rm -rf .next && npm run dev
```

## Testing Checklist

### Visitor Flow
- [ ] Can access /chat without login
- [ ] Can send first message
- [ ] Receives AI response (if enabled)
- [ ] Session persists on refresh
- [ ] Can see typing indicators
- [ ] Messages appear in realtime

### Admin Flow  
- [ ] Can login to /admin
- [ ] Can access /admin/chat
- [ ] Can see conversation list
- [ ] Can toggle AI on/off
- [ ] Can reply to messages
- [ ] Receives realtime updates

### AI Flow
- [ ] AI responds to visitor messages
- [ ] AI uses portfolio context
- [ ] AI typing indicator shows
- [ ] Can toggle AI off/on
- [ ] Manual reply works when AI is off

## Debug Mode

Enable debug logging:

```typescript
// In ChatPageClient.tsx or ChatClient.tsx
useEffect(() => {
  console.log('Debug Info:', {
    sessionToken,
    conversationId,
    visitorId,
    isConnected,
    messagesCount: messages.length,
  });
}, [sessionToken, conversationId, visitorId, isConnected, messages]);
```

## Pusher Debug

Enable Pusher logging:

```typescript
// In src/lib/pusher/client.ts
export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
      enabledTransports: ['ws', 'wss'],
      forceTLS: true,
      // Add debug logging
      logToConsole: true,
    });
  }
  return pusherInstance;
}
```

## Performance Tips

1. **Limit message history**: Only fetch last 50 messages
2. **Debounce typing**: Already implemented (3 seconds)
3. **Optimize images**: Use next/image for avatars
4. **Lazy load**: Load older messages on scroll
5. **Cache settings**: Store AI settings in memory

## Need Help?

1. Check browser console for errors
2. Check server console for API errors
3. Verify all environment variables are set
4. Try in incognito mode (rules out extensions)
5. Check Pusher dashboard for connection stats
6. Review REALTIME_CHAT_PLAN.md for implementation details

## Quick Reset

If everything is broken, do a complete reset:

```bash
# 1. Stop server
# 2. Clear database
mysql -u root -p your_database < reset.sql

# 3. Regenerate schema
npm run db:generate
npm run db:push
npm run db:seed

# 4. Clear browser data
# - localStorage
# - Session storage
# - Cookies

# 5. Restart server
npm run dev

# 6. Test again
```

## Still Having Issues?

Create an issue with:
- Error messages from console
- Steps to reproduce
- Browser & OS version
- Screenshots if relevant
