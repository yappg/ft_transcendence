'use client';
import { useState,createContext, useEffect, useRef, useCallback, ReactNode } from 'react';
// import { useRouter } from 'next/router';
import { toast, useToast } from "@/hooks/use-toast";
import { CustomToast } from '@/components/ui/custom-toast';

interface GameInviteContextProps {
  handleWebSocketMessage: (event: MessageEvent) => void;
  handleInviteResponse: (inviteId: string, accepted: boolean) => void;
  sendGameInvite: (username: string) => void;
  socket: WebSocket | null;
}

export const GameInviteContext = createContext<GameInviteContextProps>({
  handleWebSocketMessage: (event: MessageEvent) => {},
  handleInviteResponse: (inviteId: string, accepted: boolean) => {},
  sendGameInvite: (username: string) => {},
  socket: null,
});

export const GameInviteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const socketRef = useRef<WebSocket | null>(null);

  const handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log('Game invite message received:', data);

    if (data.type === 'game_invite' && data.action === 'receive') {

      toast({
        title: "Game Invite",
        description: `${data.sender_username} invited you to play a game`,
        action: (
          <div className="flex gap-2">
            <button onClick={() => handleInviteResponse(data.invite_id!, true)}>Accept</button>
            <button onClick={() => handleInviteResponse(data.invite_id!, false)}>Reject</button>
          </div>
        ),
      });
    //   document.body.appendChild(inviteDiv);
    //   setTimeout(() => inviteDiv.remove(), 5000);
    } else if (data.type === 'game_found') {
      const gameFoundDiv = document.createElement('div'); 
      gameFoundDiv.className = 'fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg';
      gameFoundDiv.innerHTML = `
        <h3 class="font-bold">Game Found!</h3>
        <p>Redirecting to game...</p>
      `;
      document.body.appendChild(gameFoundDiv);
      setTimeout(() => gameFoundDiv.remove(), 3000);
      window.location.href = `/Game-Arena?mode=one-vs-one&map=earth&game_id=${data.game_id}`;
    }
    else if (data.type === 'invite_rejected') {
      toast({
        title: "Game Invite Rejected",
        description: `${data.sender_username} declined your invite`,
        className: "bg-primary-dark border-none text-white",
      });
    }
  };

  // Handle invite responses
  const handleInviteResponse = (inviteId: string, accepted: boolean) => {
    console.log("readyState", socketRef.current);
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
      console.log("handleInviteResponse", inviteId, accepted);
    
    socketRef.current.send(JSON.stringify({
      action: accepted ? 'accept_invite' : 'reject_invite',
      invite_id: inviteId
    }));
    
    toast({
      title: accepted ? "Accepted Game Invite" : "Declined Game Invite",
      description: accepted ? "Joining game..." : "Invite declined",
      className: "bg-primary-dark border-none text-white",
    });
  };

  const sendGameInvite = (username: string) => {
    console.log("sendGameInvite", username);
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({
        type: 'game_invite',
        action: 'send_invite',
        username: username,
      }));
      
      toast({
        title: "Game Invite Sent",
        description: `Invite sent to ${username}`,
        className: "bg-primary-dark border-none text-white",
      });
  };

const InitSocket = () => {
    if (socketRef.current) return;

    const ws = new WebSocket('ws://localhost:8080/ws/game_invite/');
    console.log('Game invite WebSocket connected');

    ws.onmessage = handleWebSocketMessage;
    
    ws.onclose = () => {
      console.log('Game invite WebSocket disconnected');
      socketRef.current = null;
    };
    socketRef.current = ws;


    return () => {
      if (ws) {
        ws.close();
      }
    };
}

  useEffect(() => {
    InitSocket();
  }, []);
  return (
    <GameInviteContext.Provider value={{ handleWebSocketMessage, handleInviteResponse, sendGameInvite, socketRef }}>
      {children}
    </GameInviteContext.Provider>
  );
};
