/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect, useRef } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { User, Chat } from '@/constants/chat';
import { useUser } from '@/context/GlobalContext';


interface ChatItemProps {
  chat: Chat;
  onClick: () => void;
  users: { [key: number]: User };
  selectedChat: Chat | null;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onClick, users, selectedChat, currentUser }) => {
  const { senders, last_message } = chat;
  const participant = (currentUser.username == senders[0] ? senders[1] : senders[0]); 
  const user = users[participant];
  // console.log(users);
  // console.log(senders[0]);
  const sendAt = (last_message && last_message.send_at) ? new Date(last_message.send_at) : new Date();
  const formattedTime = sendAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div
      onClick={onClick}
      className={`flex h-[100px] w-full items-center justify-between gap-2 border-b border-gray-400 px-2 text-white cursor-pointer ${selectedChat && selectedChat.id === chat.id ? 'bg-gray-700' : ''}`}
    >
      <div className="flex h-full w-3/4 items-center justify-start gap-2 p-2">
        <div className="flex size-[60px] items-center justify-center rounded-full">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt={`${user.username} PDP`} />
          ) : (
            <div className="bg-gray-500 rounded-full w-full h-full flex items-center justify-center">
              <span>{user?.username.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="w-4/5">
          <h1>{user?.username}</h1>
          <p className="line-clamp-1 w-full text-ellipsis text-[rgb(255,255,255,0.5)]">{last_message?.content || 'No messages yet'}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm text-[rgb(255,255,255,0.5)]">
          {formattedTime}
        </h3>
        <div
          className={`${chat.unreadMessagesCount > 0 ? 'dark:bg-primary-dark bg-green-300' : 'border border-[rgb(255,255,255,0.5)] bg-transparent text-[rgb(255,255,255,0.5)]'} flex size-[20px] items-center justify-center rounded-full text-xs`}
        >
          {chat.unreadMessagesCount > 0 ? chat.unreadMessagesCount : <RiCheckDoubleLine />}
        </div>
      </div>
    </div>
  );
};
  
  interface ChatListProps {
    onChatSelect: (chat: Chat) => void;
    selectedChat: Chat | null;
    chats: Chat[];
    users: { [key: number]: User };
  }
  
  export const ChatList: React.FC<ChatListProps> = ({ onChatSelect, selectedChat, chats, users }) => {
    const {user} = useUser();
    useEffect(()=>{},[user]);
    return (
      <div>
        <div className="costum-little-shadow font-dayson flex h-[80px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 text-white">
          <h2>Chat List</h2>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentUser={user}
              onClick={() => onChatSelect(chat)}
              users={users}
              selectedChat={selectedChat}
            />
          ))}
        </div>
      </div>
    );
  };