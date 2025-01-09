/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useContext } from "react";
import { IoSend } from "react-icons/io5";
import { FiPlus, FiMoreVertical } from "react-icons/fi";
import { IoGameController } from "react-icons/io5";
import { BiBlock } from "react-icons/bi";
import { Chat, Message } from "@/constants/chat";
import { useUser } from "@/context/GlobalContext";
import { MessageBubble } from "@/components/chat/MessageBubb";
import { chatService } from "@/services/chatService";
import FriendServices from "@/services/friendServices";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { GameInviteContext } from "@/context/gameInviteConetx";
interface MessagesProps {
  chatId: number;
  currentChat: Chat;
  receiverId: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const Messages: React.FC<MessagesProps> = ({
  chatId,
  currentChat,
  messages,
  setMessages,
  receiverId,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const { setLastMessages } = useUser();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const { chats, user, setChats } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const { sendGameInvite } = useContext(GameInviteContext);
  const handleBlockUser = async () => {
    if (isBlocked === true) {
      console.log("Unblocking user:", currentChat?.receiver.username);
      try {
        await FriendServices.unblockFriend(currentChat?.receiver.username);
        setIsBlocked(false);
        setChatBar(true);
      } catch (error) {
        toast({
          title: "User is already unblocked",
          description: "You cannot unblock this user",
          variant: "destructive",
          className: "bg-primary-dark border-none text-white bg-opacity-20",
        });
      }
    } else {
      console.log("Blocking user:", currentChat?.receiver.username);
      try {
        await FriendServices.blockFriend(currentChat?.receiver.username);
        setIsBlocked(true);
        setChatBar(false);
      } catch (error) {
        toast({
          title: "User is already blocked",
          description: "You cannot block this user",
          variant: "destructive",
          className: "bg-primary-dark border-none text-white bg-opacity-20",
        });
      }
    }
  };

  useChatWebSocket({
    chatId,
    setMessages,
    setChats,
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      if (currentUserId !== null) {
        await chatService.sendMessage(
          chatId,
          newMessage,
          currentUserId,
          receiverId,
        );
        setLastMessages(
          (prevLastMessages: { [key: number]: string } | null) => {
            if (!prevLastMessages) return prevLastMessages;
            let newObject = {
              ...prevLastMessages,
              [chatId]: newMessage,
            };
            return newObject;
          },
        );
      }
      setNewMessage("");
    } catch (error) {
      console.log("Failed to send message", error);
    }
  };

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const [chatBar, setChatBar] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  React.useEffect(() => {
    if (user) setCurrentUserId(user.id);
    if (chats) {
      const currentchat = chats.find((chat: Chat) => chat.id === chatId);
      if (currentchat && currentchat.is_blocked === true) {
        setIsBlocked(true);
      }
      if (currentchat && (currentchat.is_blocked || currentchat.blocked_by)) {
        setChatBar(false);
      } else {
        setChatBar(true);
      }
      if (currentchat) {
        setIsPartnerOnline(currentchat.is_online);
      }
    }
  }, [user?.id, chats]);

  const handleGameInvite = async () => {
    try {
      sendGameInvite(currentChat?.receiver.usernameGame);
      setShowMoreOptions(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send game invite",
        variant: "destructive",
        className: "bg-primary-dark border-none text-white bg-opacity-20",
      });
    }
  };

  return (
    <div className="costum-little-shadow flex size-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-black-crd bg-[url('/chat-bg.png')] pb-4">
      <div className="costum-little-shadow flex h-[120px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 font-dayson text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <FiMoreVertical
              className="size-8 text-white"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
            />
            {showMoreOptions && (
              <div className="absolute left-0 top-16 z-50 min-w-[200px] rounded-lg bg-[#252525] py-2 shadow-lg">
                <button
                  onClick={handleGameInvite}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-white hover:bg-[#303030]"
                >
                  <IoGameController className="size-5" />
                  <span>Invite to Game</span>
                </button>
                <button
                  onClick={handleBlockUser}
                  className="flex w-full items-center gap-3 px-4 py-2 text-left text-white hover:bg-[#303030]"
                >
                  <BiBlock className="size-5" />
                  {isBlocked === true ? "Unblock User" : "Block User"}
                </button>
              </div>
            )}
          </div>
          <div className="flex size-[70px] items-center justify-center rounded-full bg-slate-400">
            <Image
              onClick={() =>
                router.push(`/Profile/${currentChat?.receiver.id}`)
              }
              src={process.env.NEXT_PUBLIC_HOST + currentChat?.receiver.avatar}
              alt={`${currentChat?.receiver.username}'s profile`}
              className="rounded-full"
              width={70}
              height={70}
              unoptimized={true}
            />
          </div>
          <div>
            <h2>{currentChat?.receiver.username}</h2>
            <h3
              className={`text-sm ${isPartnerOnline ? "text-green-500" : "text-gray-400"}`}
            >
              {isPartnerOnline ? "online" : "offline"}
            </h3>
          </div>
        </div>
      </div>
      <div
        ref={messagesContainerRef}
        className="custom-scrollbar-container flex h-full w-[90%] flex-col gap-2 overflow-scroll py-2"
      >
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isCurrentUser={
                currentChat?.receiver.username === message.receiver
              }
            />
          ))}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex h-[60px] w-11/12 items-center gap-4 rounded-md bg-[rgb(0,0,0,0.7)] px-4 py-1"
      >
        <div className="flex size-full items-center gap-3 px-4">
          <FiPlus className="dark size-[30px] text-white" />
          {chatBar ? (
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Start a new conversation"
              className="size-full bg-transparent text-white focus:outline-none"
            />
          ) : (
            <h1 className="size-full bg-transparent text-white focus:outline-none">
              You can&apos;t send messages to this user
            </h1>
          )}
        </div>
        <button
          type="submit"
          className="flex size-[40px] items-center justify-center rounded-md bg-primary dark:bg-primary-dark"
        >
          <IoSend className="size-[20px] text-white" />
        </button>
      </form>
    </div>
  );
};
