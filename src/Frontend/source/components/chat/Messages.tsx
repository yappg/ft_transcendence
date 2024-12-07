/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect, useRef } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { chatService  } from '@/services/chatService';
import { Message, User } from '@/constants/chat';

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
    <div className={`h-fit w-full text-gray-100 flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`bg-black-crd h-fit max-w-[400px] rounded-md px-3 py-2 ${isCurrentUser ? 'bg-primary' : 'bg-secondary'}`}>
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

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);


  useEffect(() => {
    // Fetch the current user's ID
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

  useEffect(() => {
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

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId]);

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
    console.log('Sending message:', newMessage); // Debug log
    try {
      await chatService.sendMessage(chatId, newMessage, currentUserId);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="costum-little-shadow bg-black-crd col-start-1 col-end-3 hidden items-center justify-center overflow-hidden rounded-2xl bg-[url('/chat-bg.png')] pb-4 lg:flex lg:flex-col">
      {/* headbar */}
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
      {/* messages */}
      <div className="custom-scrollbar-container flex h-full w-[90%] flex-col gap-2 overflow-scroll py-2">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={message.sender.id === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* message input */}
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
