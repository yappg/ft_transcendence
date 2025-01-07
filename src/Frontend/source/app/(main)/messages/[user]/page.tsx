/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line react-hooks/exhaustive-deps
"use client";
import React, { useState, useEffect } from "react";
import { Messages } from "@/components/chat/Messages";
import { chatService } from "@/services/chatService";
import { Chat, Message } from "@/constants/chat";
import { useUser } from "@/context/GlobalContext";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
export default function Page() {
  const [chatSelected, setChatSelected] = useState<Chat | null>(null);
  const { chats, messages, setMessages, setChats } = useUser();
  const param = useParams();
  const chat_id = parseInt(param.user as string);

  const findChatById = (id: number): Chat | null => {
    if (chats === null) {
      return null;
    }
    const temp = chats.find((chat: Chat) => chat.id === id);
    return temp as Chat;
  };

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await chatService.getChatMessages(chat_id);
      if (fetchedMessages.length > 0) {
        const lastMessage = fetchedMessages[fetchedMessages.length - 1];
        if (chats) {
          const updatedChats = chats.map((chat: Chat) =>
            chat.id === chat_id ? { ...chat, last_message: lastMessage } : chat,
          );
          setChats(updatedChats as Chat[]);
          setMessages(fetchedMessages);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.log("Failed to fetch messages", error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chat_id > 0) {
      setChatSelected(findChatById(chat_id) as Chat);
    }
  }, [chat_id]);

  if (!chatSelected) {
    return (
      <Skeleton className="size-full rounded-md bg-black-crd" />
    );
  }

  return (
    <div className="flex size-full flex-row items-center justify-center">
      <Messages
        chatId={chat_id}
        currentChat={chatSelected}
        messages={messages as Message[]}
        setMessages={
          setMessages as React.Dispatch<React.SetStateAction<Message[]>>
        }
        receiverId={chatSelected?.receiver.id}
      />
    </div>
  );
}
