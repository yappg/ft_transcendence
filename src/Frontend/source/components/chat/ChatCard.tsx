/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import { Chat } from "@/constants/chat";
import { useUser } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ChatCardProps {
  chatContent: Chat;
  lastMessage: string;
}

export const ChatCard = ({ chatContent, lastMessage }: ChatCardProps) => {
  const { setMessages } = useUser();
  const router = useRouter();
  let message = lastMessage || chatContent?.last_message?.content || "...";
  if (message.length > 10) {
    message = message.slice(0, 17) + "...";
  }
console.log("message DEBU ----", message);
  const handleChatClick = async () => {
    const currentPath = window.location.pathname;
    const targetPath = `/messages/${chatContent.id}`;

    if (currentPath !== targetPath) {
      setMessages([]);
      router.push(targetPath);
    }
  };

  return (
    <div
      onClick={handleChatClick}
      className="bg-color-cdr flex w-full cursor-pointer items-center justify-between px-4 py-3 hover:bg-[#252525]"
    >
      <div className="flex items-center gap-5">
        <Image
          className="size-12 rounded-full object-cover"
          src={process.env.NEXT_PUBLIC_HOST + chatContent.receiver.avatar}
          alt="avatar"
          width={10}
          height={10}
          unoptimized={true}
        />
        <div className="flex flex-col">
          <span className="text-base font-medium text-white">
            {chatContent.receiver?.username}
          </span>
          <p className="text-sm text-gray-400">
            {message}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        {chatContent?.last_message?.send_at && (
          <span className="text-xs text-gray-400">
            {new Date(chatContent.last_message.send_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
};
