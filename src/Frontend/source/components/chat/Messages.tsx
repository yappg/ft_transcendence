/* eslint-disable @next/next/no-img-element */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useState, useEffect, useRef } from 'react';
import { RiCheckDoubleLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import { FiPlus } from 'react-icons/fi';
import { chatService } from '@/services/chatService';
import { Chat, Message, ReceiverData, User } from '@/constants/chat';
import { useUser } from '@/context/GlobalContext';
import { MessageBubble } from '@/components/chat/MessageBubb';

interface MessagesProps {
  chatId: number;
  chatPartner: Chat | null;
  receiverId: number;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export const Messages: React.FC<MessagesProps> = ({
  chatId,
  chatPartner,
  messages,
  setMessages,
  receiverId,
}) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const socketRef = useRef<WebSocket | null>(null);
  // const currentChatIdRef = useRef<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  let socketRef = useRef<WebSocket | null>(null);

  const { user } = useUser();
  useEffect(() => {
    if (user) setCurrentUserId(user.id);
  }, [user]);

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
    setNewMessage('');

   
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
    };
  }, [chatId]);

  // Scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        chat: chatId,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log('Sending message:', newMessage);
    try {
      if (currentUserId !== null) {
        console.log(
          'Sending message from user:',
          currentUserId,
          'to receiver:',
          receiverId,
          'in room where chatId:',
          chatId
        );
        await chatService.sendMessage(chatId, newMessage, currentUserId, receiverId);
      }
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  // -----------divs---//
  return (
    <div className=" costum-little-shadow flex size-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-black-crd bg-[url('/chat-bg.png')] pb-4">
      {/* headbar */}
      <div className="costum-little-shadow flex h-[120px] w-full items-center justify-between bg-[rgb(0,0,0,0.7)] px-4 font-dayson text-white">
        <div className="flex items-start gap-4">
          <div className="flex size-[70px] items-center justify-center rounded-full bg-slate-400">
            <img
              src={chatPartner?.receiver.avatar}
              alt={`${chatPartner?.receiver.username}'s profile`}
              className="rounded-full"
            />
          </div>
          <div>
            <h2>{chatPartner?.receiver.username}</h2>
            <h3 className="font-poppins text-primary dark:text-primary-dark">online</h3>
          </div>
        </div>
      </div>
      {/* messages */}
      <div className="custom-scrollbar-container flex h-full w-[90%] flex-col gap-2 overflow-scroll py-2">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isCurrentUser={chatPartner?.receiver.username == message.receiver}
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
          className="flex size-[40px] items-center justify-center rounded-md bg-primary dark:bg-primary-dark"
        >
          <IoSend className="size-[20px] text-white" />
        </button>
      </form>
    </div>
  );
};
