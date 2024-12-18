'use client';
import { Chat } from '@/constants/chat';
import { useRouter } from 'next/navigation';

export const ChatCard = ({ chatContent }: { chatContent: Chat }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        console.log('routed to chat ', chatContent.id);
        router.push(`/messages/${chatContent.id}`);
      }}
      className="flex h-[120px] w-full cursor-pointer items-center justify-start gap-8 bg-black-crd px-8"
    >
      <img
        className="size-[75px] rounded-full"
        src={'http://localhost:8080' + chatContent.receiver.avatar}
        alt="avatar"
      />
      <div className="flex h-full w-fit flex-col items-center justify-center gap-4">
        <h1 className=" font-dayson text-[20px] text-white ">{chatContent.receiver?.username}</h1>
        <h1 className=" font-coustard text-[16px] text-[#B7B7B799]">
          {chatContent.last_message?.content}
        </h1>
      </div>
    </div>
  );
};
