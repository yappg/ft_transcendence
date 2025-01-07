import { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Chat } from '@/constants/chat';
import { chatService } from '@/services/chatService';
import { useUser } from '@/context/GlobalContext';
import { setRequestMeta } from 'next/dist/server/request-meta';
import { toast } from './use-toast';
import router from 'next/router';
interface UseGameChatWebSocketProps {
  currentChat: Chat;
  handleInviteResponse: (inviteId: string, accepted: boolean) => void;
}

export function useGameChatWebSocket({currentChat, handleInviteResponse }: UseGameChatWebSocketProps) {
  
  const socketRef = useRef<WebSocket | null>(null);


  // ---------------------------------------------------------------------
  if (socketRef.current) return;
    
  socketRef.current = new WebSocket('ws://localhost:8080/ws/game_invite/');
  
  socketRef.current.onopen = () => {
    console.log('Game invite WebSocket connected');
    // setGameInviteSocket(socket);
  };

  socketRef.current.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Game invite message received:', data);

    if (data.type === 'game_invite' && data.action === 'receive') {
      toast({
        title: "Game Invite",
        description: `${data.sender_username} invited you to play a game`,
        action: (
          <div className="flex gap-2">
            <button
              onClick={() => handleInviteResponse(data.invite_id, true)}
              className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleInviteResponse(data.invite_id, false)}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          ),
        // className: "bg-primary border-none text-white",
      });
    } else if (data.type === 'game_found') {
      toast({
        title: "Game Found!",
        description: "Redirecting to game...",
        className: "bg-primary border-none text-white",
      });
      router.push(`/game/${data.game_id}`);
    }
  };

  socketRef.current.onclose = () => {
    console.log('Game invite WebSocket disconnected');
    // setGameInviteSocket(null);
  };



  // ---------------------------------CHAT-----------------------------------

  useEffect(() => {
    const setupWebSocket = async () => {
      
    };

    setupWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId, handleWebSocketMessage]);

  //-------------------------------------------------------------------------
  return ;
}
