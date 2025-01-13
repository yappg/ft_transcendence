import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { Chat } from "@/constants/chat";
import { toast, useToast } from "@/hooks/use-toast";
import router from "next/router";
import { Button } from "@/components/ui/button";

interface UseGameChatWebSocketProps {
  currentChat: Chat;
  onclicked: boolean;
}

// Add type for toast action
type ToastAction = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function useGameChatWebSocket({
  currentChat,
  onclicked,
}: UseGameChatWebSocketProps) {
  const socketRef = useRef<WebSocket | null>(null);
  // Handle all WebSocket message events
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);

    if (data.type === "game_invite" && data.action === "receive") {
      const inviteDiv = document.createElement("div");
      inviteDiv.className =
        "fixed top-4 right-4 bg-primary-dark text-white p-4 rounded-lg shadow-lg";
      inviteDiv.innerHTML = `
        <h3 class="font-bold">Game Invite</h3>
        <p>${data.sender_username} invited you to play a game</p>
      `;
      document.body.appendChild(inviteDiv);
      setTimeout(() => inviteDiv.remove(), 5000);
    } else if (data.type === "game_found") {
      const gameFoundDiv = document.createElement("div");
      gameFoundDiv.className =
        "fixed top-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg";
      gameFoundDiv.innerHTML = `
        <h3 class="font-bold">Game Found!</h3>
        <p>Redirecting to game...</p>
      `;
      document.body.appendChild(gameFoundDiv);
      setTimeout(() => gameFoundDiv.remove(), 3000);
      router.push(`/game/${data.game_id}`);
    }
  }, []);

  // Handle invite responses
  const handleInviteResponse = useCallback(
    (inviteId: string, accepted: boolean) => {
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
        return;

      socketRef.current.send(
        JSON.stringify({
          action: accepted ? "accept_invite" : "reject_invite",
          invite_id: inviteId,
        }),
      );

      toast({
        title: accepted ? "Accepted Game Invite" : "Declined Game Invite",
        description: accepted ? "Joining game..." : "Invite declined",
        className: "bg-primary-dark border-none text-white",
        duration: 8000,
      });
    },
    [],
  );

  // Setup WebSocket connection
  useEffect(() => {
    if (socketRef.current) return;

    socketRef.current = new WebSocket("ws://localhost:8080/ws/game_invite/");

    socketRef.current.onopen = () => {
      if (onclicked) {
        socketRef.current?.send(
          JSON.stringify({
            type: "game_invite",
            action: "send_invite",
            username: currentChat.receiver.usernameGame,
            duration: 8000,
          }),
        );

        toast({
          title: "Game Invite Sent",
          description: `Invite sent to ${currentChat?.receiver.usernameGame}`,
          className: "bg-primary-dark border-none text-white",
          duration: 8000,
        });
      }
    };

    socketRef.current.onmessage = handleWebSocketMessage;

    socketRef.current.onclose = () => {
      socketRef.current = null;
    };

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [currentChat, onclicked, handleWebSocketMessage]);

  return {
    handleInviteResponse,
  };
}
