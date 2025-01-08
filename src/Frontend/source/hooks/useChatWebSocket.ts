import { useState, useEffect, useRef, useCallback } from "react";
import { Message, Chat } from "@/constants/chat";
import { chatService } from "@/services/chatService";
import { useUser } from "@/context/GlobalContext";
import { setRequestMeta } from "next/dist/server/request-meta";
interface UseChatWebSocketProps {
  chatId: number;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null>>;
}

export function useChatWebSocket({
  chatId,
  setMessages,
  setChats,
}: UseChatWebSocketProps) {
  const { setLastMessages } = useUser();
  const socketRef = useRef<WebSocket | null>(null);
  // ---------------------------------------------------------------------
  const handleWebSocketMessage = useCallback(
    (message: any) => {
      setMessages((prevMessages: Message[]) => {
        if (!prevMessages) return prevMessages;
        return [
          ...prevMessages,
          {
            chat: chatId,
            sender: message.sender,
            receiver: message.receiver,
            content: message.content,
            timestamp: new Date().toISOString(),
          },
        ];
      });
      setLastMessages((prevLastMessages: { [key: number]: string } | null) => {
        if (!prevLastMessages) return prevLastMessages;
        let newObject = {
          ...prevLastMessages,
          [chatId]: message.content,
        };
        console.log("this is the newObject: ", newObject);
        return newObject;
      });
    },
    [chatId, setMessages, setChats],
  );

  // ---------------------------------CHAT-----------------------------------

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        socketRef.current = await chatService.createWebSocketConnection(
          chatId,
          handleWebSocketMessage,
          setChats,
        );
      } catch (error) {
        console.log("WebSocket connection failed", error);
      }
    };

    setupWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId, handleWebSocketMessage]);

  //-------------------------------------------------------------------------
  return {
    chatSocket: socketRef.current,
  };
}
