/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import Cookies from 'js-cookie';
import { ChatList, Messages } from '@/components/chat/Messages';
import { SideBarContext } from '@/context/SideBarContext';
import { chatService } from '@/services/chatService';
import { Message, User, Chat } from '@/constants/chat';

const App: React.FC = () => {
  const {} = useContext(SideBarContext);



  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);


  useEffect(() => {
    // Fetch the current user's ID
    const fetchCurrentUserId = async () => {
      try {
        const response = await chatService.getCurrentUserId();
        setCurrentUserId(response.id);
      } catch (error) {
        console.error('Failed to fetch current user ID', error);
      }
    };

    fetchCurrentUserId();
  }, []);

  
  useEffect(() => {
    if (currentUserId === null) return;
    // Fetch the list of chats
    const fetchChats = async () => {
      try {
        const fetchedChats = await chatService.getChatList();
        console.log(fetchChats);
        setChats(fetchedChats);

        // Fetch user details for all participants except the current user
        const userIds = new Set<number>();
        fetchedChats.forEach(chat => {
          chat.senders.forEach(sender => {
            if (sender.id !== currentUserId) {
              userIds.add(sender.id);
            }
          });
        });

        const userDetailsPromises = Array.from(userIds).map(id => chatService.getUserDetails(id));
        const userDetails = await Promise.all(userDetailsPromises);
        const usersMap = userDetails.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as { [key: number]: User });

        setUsers(usersMap);
      } catch (error) {
        console.error('Failed to fetch chats or user details', error);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);

    // Fetch chat partner details
    const chatPartnerId = chat.senders.find(sender => sender.id !== parseInt(Cookies.get('user_id') || '0'))?.id;
    if (chatPartnerId) {
      setChatPartner(users[chatPartnerId]);
    }

    // Fetch existing messages
    try {
      const fetchedMessages = await chatService.getChatMessages(chat.id);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 w-full pl-4">
      <div className="grid size-full grid-cols-3 gap-6 overflow-hidden p-[12px]">
        {selectedChat && chatPartner ? (
          <Messages 
            chatId={selectedChat.id} 
            chatPartner={chatPartner} 
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className="col-span-2 flex items-center justify-center text-white">
            Select a chat to start messaging
          </div>
        )}
        <ChatList onChatSelect={handleChatSelect} selectedChat={selectedChat} chats={chats} users={users} />
      </div>
    </div>
  );
};

export default App;