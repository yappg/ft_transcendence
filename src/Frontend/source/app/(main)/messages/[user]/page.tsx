/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import React, { useState, useEffect } from 'react';
import { Messages } from '@/components/chat/Messages';
import { usePathname } from 'next/navigation';
import { Message, Chat } from '@/constants/chat';
import { useUser } from '@/context/GlobalContext';
import { chatService } from '@/services/chatService';

export default function Page() {
  const [userId, setUserId] = useState<string>('');
  const [chatSelected, setChatSelected] = useState<Chat | null>(null);
  const { user, players, chats, messages, setMessages } = useUser();
  useEffect(() => {
    const pathname = window.location.pathname; // Get the current pathname
    const segments = pathname.split('/'); // Split the pathname by '/'
    // Extract the last segment which should be the {id} (e.g. `/messages/123`)
    const id = segments[segments.length - 1]; // This will be the `id`

    if (id) {
      setUserId(id); // Set the messageId
    }
  }, []);
  const findChatById = (id: number): Chat | null | undefined => {
    if (chats === null) {
      return null; // If chats are still null, return undefined
    }
    return chats.find((chat) => chat.id === id); // Use find to return the chat with the matching ID
  };

  useEffect(() => {
    if (userId) {
      setChatSelected(findChatById(Number(userId)) as Chat);
      const fetchMessages = async () => {
        try {
          const fetchedMessages = await chatService.getChatMessages(Number(userId));
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      };

      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return (
    <div className="flex size-full flex-row items-center justify-center">
      <Messages
        chatId={Number(userId)}
        chatPartner={chatSelected}
        messages={messages}
        setMessages={setMessages}
        receiverId={chatSelected?.receiver.id || 0}
      />
    </div>
  );
}
