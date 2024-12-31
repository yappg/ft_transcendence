import { useState, useEffect, useRef, useCallback } from 'react'
import { Message, Chat } from '@/constants/chat'
import { chatService } from '@/services/chatService'

interface UseChatWebSocketProps {
  chatId: number
  currentUserId: number
  receiverId: number
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  setChats: (chats: Chat[]) => void
}

export function useChatWebSocket({
  chatId,
  currentUserId,
  receiverId,
  setMessages,
  setChats,
}: UseChatWebSocketProps) {
  const socketRef = useRef<WebSocket | null>(null)

  // ---------------------------------------------------------------------

  const handleWebSocketMessage = useCallback((message: any) => {
    setMessages((prevMessages: Message[]) => [
      ...prevMessages,
      {
        chat: chatId,
        sender: message.sender,
        receiver: message.receiver,
        content: message.content,
        timestamp: new Date().toISOString(),
      },
    ])

    setChats((prevChats: Chat[]) => {
      if (!prevChats) return prevChats
      return prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            last_message: message.content,
          }
        }
        return chat
      })
    })
  }, [chatId, setMessages, setChats])

  // ---------------------------------CHAT-----------------------------------

  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        socketRef.current = await chatService.createWebSocketConnection(
          chatId,
          handleWebSocketMessage
        )
      } catch (error) {
        console.log('WebSocket connection failed', error)
      }
    }

    setupWebSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [chatId, handleWebSocketMessage])
  
  //-------------------------------------------------------------------------
  return {
    chatSocket: socketRef.current
  }
}

