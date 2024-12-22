import { Message } from '@/constants/chat';

export const MessageBubble: React.FC<{ message: Message; isCurrentUser: boolean }> = ({
  message,
  isCurrentUser,
}) => {
  const sendAt = message.send_at ? new Date(message.send_at) : new Date();
  const formattedTime = sendAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div
      className={`flex h-fit w-full text-gray-100 ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`h-fit max-w-[400px] rounded-md bg-black-crd px-3 py-2 ${isCurrentUser ? 'bg-primary' : 'bg-secondary'}`}
      >
        <h1>{message.sender}</h1>
        <p className="h-fit w-full break-words font-thin">{message.content}</p>
        <h3 className="text-end text-sm text-[rgb(255,255,255,0.5)]">{formattedTime}</h3>
      </div>
    </div>
  );
};
