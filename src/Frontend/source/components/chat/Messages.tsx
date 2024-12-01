/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect, useRef } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { chatService  } from '@/services/chatService';
import { Message, User, Chat } from '@/constants/chat';

interface MessagesProps {
  chatId: number;
  chatPartner: User;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const MessageBubble: React.FC<{ message: Message, isCurrentUser: boolean }> = ({
  message,
  isCurrentUser
}) => {
  return (
    <div className={`h-fit w-full text-gray-100 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`bg-black-crd h-fit max-w-[400px] rounded-md px-3 py-2 ${isCurrentUser ? 'bg-primary' : ''}`}>
        <h1>{message.sender.username}</h1>
        <p className="h-fit w-full font-thin">
          {message.content}
        </p>
        <h3 className="text-end text-sm text-[rgb(255,255,255,0.5)]">
          {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
        </h3>
      </div>
    </div>
  );
};

export const Messages: React.FC<MessagesProps> = ({ chatId, chatPartner, messages, setMessages }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const currentUserId = Cookies.get('user_id');

  useEffect(() => {
    // Establish WebSocket connection
    const setupWebSocket = async () => {
      try {
        socketRef.current = await chatService.createWebSocketConnection(
          chatId,
          handleWebSocketMessage
        );
      } catch (error) {
        console.error('WebSocket connection failed', error);
      }
    };

    setupWebSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleWebSocketMessage = (message: any) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        chat: chatId,
        sender: {
          id: parseInt(message.sender),
          username: message.sender
        },
        content: message.content,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage(chatId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="costum-little-shadow bg-black-crd col-start-1 col-end-3 hidden items-center justify-center overflow-hidden rounded-2xl bg-[url('/chat-bg.png')] pb-4 lg:flex lg:flex-col">
      {/* Header */}
      <div className="costum-little-shadow font-dayson flex h-[120px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 text-white">
        <div className="flex items-start gap-4">
          <div className="flex size-[70px] items-center justify-center rounded-full bg-slate-400">
            <img
              src={chatPartner.profile_picture || ''}
              alt={`${chatPartner.username}'s profile`}
              className="rounded-full"
            />
          </div>
          <div>
            <h2>{chatPartner.username}</h2>
            <h3 className="text-primary dark:text-primary-dark font-poppins">online</h3>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="custom-scrollbar-container flex h-full w-[90%] flex-col gap-2 overflow-scroll py-2">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={message.sender.id === parseInt(currentUserId || '0')}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex h-[60px] w-11/12 items-center gap-4 rounded-md bg-[rgb(0,0,0,0.7)] px-4 py-1"
      >
        <div className="flex size-full items-center gap-3 px-4">
          <FiPlus className="dark: size-[30px] text-white" />
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Start a new conversation"
            className="size-full bg-transparent text-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-primary dark:bg-primary-dark flex size-[40px] items-center justify-center rounded-md"
        >
          <IoSend className="size-[20px] text-white" />
        </button>
      </form>
    </div>
  );
};

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
    <div onClick={onClick} className={`flex h-[100px] w-full items-center justify-between gap-2 border-b border-gray-400 px-2 text-white cursor-pointer ${selectedChat && selectedChat.id === chat.id ? 'bg-gray-700' : ''}`}>
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
          className={`${0 > 0 ? 'dark:bg-primary-dark bg-green-300' : 'border border-[rgb(255,255,255,0.5)] bg-transparent text-[rgb(255,255,255,0.5)]'} flex size-[20px] items-center justify-center rounded-full text-xs`}
        >
          {0 > 0 ? 0 : <RiCheckDoubleLine />}
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