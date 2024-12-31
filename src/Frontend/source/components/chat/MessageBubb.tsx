import { Message } from '@/constants/chat';

export function MessageBubble({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) {
  const sendAt = message?.send_at ? new Date(message.send_at) : new Date();
  const formattedTime = sendAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`flex h-fit w-full ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2.5`}
    >
      <div
        className={`h-fit max-w-[400px] rounded-xl px-4 py-3 ${
          isCurrentUser ? 'dark:bg-[#DF3925] bg-aqua   text-primary-foreground' : 'bg-[#CCCCCC80]  text-muted-foreground'
        }`}
      >
        <p className="h-fit w-full break-words text-sm text-black">{message.content}</p>
        <h3 className="text-end text-xs opacity-70 mt-1 text-black">{formattedTime}</h3>
      </div>
    </div>
  );
}
