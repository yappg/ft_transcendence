/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import React, { useState } from 'react';
import { ChatList, Messages } from '@/components/chat/Messages';
import { SideBarContext } from '@/context/SideBarContext';
import { useContext } from 'react';

// Import the interfaces
import { Chat, User } from '@/constants/chat';
import { chatService } from '@/services/chatService';

const App = () => {
  const {} = useContext(SideBarContext);
  
  // State to manage selected chat and chat partner
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);

  // Handler for selecting a chat
  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    
    // Find the chat partner (the other participant)
    try {
      const currentUserId = parseInt(localStorage.getItem('user_id') || '0');
      const partner = chat.participants.find(
        participant => participant.id !== currentUserId
      );

      if (partner) {
        const partnerDetails = await chatService.getUserDetails(partner.id);
        setChatPartner(partnerDetails);
      }
    } catch (error) {
      console.error('Failed to fetch chat partner details', error);
    }
  };

  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 w-full pl-4">
      <div className="grid size-full grid-cols-3 gap-6 overflow-hidden p-[12px]">
        {selectedChat && chatPartner ? (
          <Messages 
            chatId={selectedChat.id} 
            chatPartner={chatPartner} 
          />
        ) : (
          <div className="col-span-2 flex items-center justify-center text-white">
            Select a chat to start messaging
          </div>
        )}
        <ChatList onChatSelect={handleChatSelect} />
      </div>
    </div>
  );
};

export default App;