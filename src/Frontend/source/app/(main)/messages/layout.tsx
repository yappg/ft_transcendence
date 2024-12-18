/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { ChatItem } from '@/components/chat/chatList';
import { Chat, Message, User } from '@/constants/chat';
import { chatService } from '@/services/chatService';
import { useUser } from '@/context/GlobalContext';
import { useRouter } from 'next/navigation';
import { ChatCard } from '@/components/chat/ChatCard';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { chats, messages, user, setMessages } = useUser();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const [listChat, setListChat] = useState<Chat[] | null>(chats);
  //   // const [users, setUsers] = useState<User[] | null>(null);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);
  // -----------User Id--------------///
  useEffect(() => {
    if (messages.length > 0) {
      setCurrentUserId(user?.id as number);
      setShowChat(true);
      console.log('called', user?.id);
    }
  }, [messages]);

  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 flex w-full">
      <div className="relative flex size-full gap-2">
        <div className="hidden h-full items-center justify-center lg:flex lg:w-3/5 lg:flex-row">
          <div className="costum-little-shadow hidden size-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-black-crd lg:flex">
            {children}
          </div>
        </div>
        {showChat && (
          <div
            onClick={() => {
              setShowChat(false);
              setMessages([]);
              router.back();
            }}
            className="absolute lg:hidden right-8 top-8 z-[99] size-[50px] cursor-pointer rounded-md bg-white"
          ></div>
        )}
        {showChat && (
          <div className="absolute z-[80] flex size-full items-center justify-center bg-black lg:hidden">
            {children}
          </div>
        )}
        <div className="size-full lg:w-2/5">
          {/* <ChatList
            onChatSelect={handleChatSelect}
            selectedChat={selectedChat}
            chats={chats}
            users={users}
          /> */}
          <div
            className={`costum-little-shadow size-full overflow-hidden rounded-[15px] bg-black-crd lg:block ${!showChat ? 'block' : 'hidden'}`}
          >
            <div className="costum-little-shadow flex h-[120px] w-full items-center justify-between bg-black-crd px-4 font-dayson text-white">
              <h2>Chat List</h2>
            </div>
            <div className="custom-scrollbar-container flex size-full flex-col items-center justify-start gap-1">
              {listChat &&
                listChat.map((chat, index) => <ChatCard key={index} chatContent={chat} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
