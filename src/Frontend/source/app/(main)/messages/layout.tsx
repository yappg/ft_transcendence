/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { Chat } from "@/constants/chat";
import { useUser } from "@/context/GlobalContext";
import { useRouter } from "next/navigation";
import { ChatCard } from "@/components/chat/ChatCard";
import { IoChevronBackOutline } from "react-icons/io5";
import { chatService } from "@/services/chatService";
import { SideBarContext } from "@/context/SideBarContext";
import { useContext } from "react";
import { GameInviteProvider } from "@/context/gameInviteConetx";

import { Skeleton } from "@/components/ui/skeleton";
export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(7);
  }, []);
  const router = useRouter();
  const {
    chats,
    messages,
    user,
    setMessages,
    setChats,
    lastMessages,
    setLastMessages,
  } = useUser();
  const [showChat, setShowChat] = useState(false);
  // I need to fecth only once the chats not every time the page is loaded
  // but once the user make a new chat i need to fetch the chats again
  
  const fetchChats = async () => {
    try {
      const fetchedChats = await chatService.getChatList();
      console.log("this is the fetched chat: ", fetchedChats);
      setChats(fetchedChats);
    } catch (error) {
      console.log("Failed to fetch chats or user details", error);
    }
  };
  
  useEffect(() => {
    fetchChats();
  }, []);
  
  useEffect(() => {
    if (messages && messages.length > 0) {
      setShowChat(true);
      console.log("called", user?.id);
    }
  }, [messages]);
  
  useEffect(() => {
    if (chats) {
      const messagesMap = chats.reduce(
        (acc: any, chat: any) => ({
          ...acc,
          [chat.id]: chat.last_message?.content,
        }),
        {},
      );
      setLastMessages(messagesMap);
      setChats(chats);
    }
  }, [chats]);
  // The user should be able to access other players profiles through the chat interface.
  if (!user)
    return (
      <div className="flex size-full gap-10">
        <Skeleton className="h-full w-[60%] rounded-[50px] bg-black-crd" />
        <Skeleton className="h-full w-[40%] rounded-[50px] bg-black-crd" />
      </div>
    );
  return (
    <GameInviteProvider>

    <div className="flex w-full overflow-hidden lg:p-4">
      <div className="relative flex size-full gap-8">
        <div className="hidden h-full items-center justify-center lg:flex lg:w-3/5 lg:flex-row">
          <div className="costum-little-shadow hidden size-full flex-col items-center justify-center rounded-2xl bg-black-crd lg:flex">
            {children}
          </div>
        </div>
        {showChat && (
          <button
            onClick={() => {
              setShowChat(false);
              setMessages([]);
              router.push("/messages");
            }}
            className="absolute right-8 top-8 z-[99] size-[50px] rounded-[50px] lg:hidden"
          >
            <IoChevronBackOutline className="size-6" />
          </button>
        )}
        {showChat && (
          <div className="absolute z-[80] flex size-full items-center justify-center bg-black lg:hidden">
            {children}
          </div>
        )}
        <div className="size-full lg:w-2/5">
          <div
            className={`costum-little-shadow size-full overflow-hidden rounded-[15px] bg-black-crd lg:block ${!showChat ? "block" : "hidden"}`}
            >
            <div className="costum-little-shadow flex h-[120px] w-full items-center justify-between bg-black-crd px-4 font-dayson text-white">
              <h2>Listed Conversations</h2>
            </div>
            <div className="custom-scrollbar-container flex size-full flex-col items-center justify-start gap-5">
              {chats &&
                chats.map((chat: Chat, index: number) => (
                  <ChatCard
                  key={chat.id}
                  chatContent={chat}
                  lastMessage={lastMessages?.[chat.id] || ""}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
                </GameInviteProvider>
  );
}
