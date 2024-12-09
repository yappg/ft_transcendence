/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Messages } from '@/components/chat/Messages';
import { ChatList } from '@/components/chat/chatList';
import { SideBarContext } from '@/context/SideBarContext';
import { chatService } from '@/services/chatService';
import { Message, User, Chat } from '@/constants/chat';

const App: React.FC = () => {
  const {} = useContext(SideBarContext);


  // 
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({});
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<number | null>(null);

// -----------User Id--------------///
  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const response = await chatService.getCurrentUserId();
        setCurrentUserId(response.id);
        console.log(response.id)
      } catch (error) {
        console.error('Failed to fetch current user ID', error);
      }
    };

    fetchCurrentUserId();
  }, []);

// -------fetch chat list, get User object-----------//
  useEffect(() => {
    if (currentUserId === null) return;
    const fetchChats = async () => {
      try {
        const fetchedChats = await chatService.getChatList();
        console.log('this is the fetched chat: ', fetchedChats);
        setChats(fetchedChats);

        
        // fetch user details for all participants except the current user //
        if (currentUserId){
        const userDetails = await chatService.getUserDetails(currentUserId)
        const usersMap = {
          [userDetails.id]: {
            id: userDetails.id,
            username: userDetails.username,
            email: userDetails.email,
            avatar: userDetails.avatar,
          }
        }
        // fetch details for all users involved in the chats //
        for (const chat of fetchedChats) {
          for (const sender of chat.senders) {
            if (!Object.values(usersMap).some(user => user.username === sender)) {
              const senderDetails = await chatService.getUserDetailsByUsername(sender);
              usersMap[senderDetails.id] = {
                id: senderDetails.id,
                username: senderDetails.username,
                email: senderDetails.email,
                avatar: senderDetails.avatar,
              };
            }
          }
        }
        setUsers(usersMap);
      }} catch (error) {
        console.error('Failed to fetch chats or user details', error);
      }
    };
    fetchChats();
  }, [currentUserId]);


  // -------------select a chat----------------------------//
  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.senders.length !== 2) {
      console.error('Chat must have exactly two senders');
      return;
    }
    console.log('Users object:', users);
    const currentUser = users[currentUserId];
    const chatPartnerUsername = chat.senders.find(sender => sender !== currentUser?.username);
    const chatPartner = Object.values(users).find(user => user.username === chatPartnerUsername);
    console.log('Chat partner:', chatPartner);
    if (chatPartner) {
      setChatPartner(chatPartner);
      setReceiverId(chatPartner.id); // Update receiverId here //
    } else {
      console.log('Chat partner not found');
    }
    // fetch existing messages //
    try {
      const fetchedMessages = await chatService.getChatMessages(chat.id);
      console.log('Fetched messages:', fetchedMessages);
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
            receiverId={receiverId}
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