/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect, useRef } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { User, Chat } from '@/constants/chat';


interface ChatItemProps {
  chat: Chat;
  onClick: () => void;
  users: { [key: number]: User };
  selectedChat: Chat | null;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onClick, users, selectedChat }) => {
  const { senders, last_message } = chat;
  const participant = senders[0]; // Assuming the first participant is the one to display
  const user = users[participant.id];

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
          {last_message ? new Date(last_message.timestamp).toLocaleTimeString() : ''}
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
    return (
      <div className="chat-list">
        {chats.map(chat => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onClick={() => onChatSelect(chat)}
            users={users}
            selectedChat={selectedChat}
          />
        ))}
      </div>
    );
  };