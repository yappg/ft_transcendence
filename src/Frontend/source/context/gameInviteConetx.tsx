"use client";
import { createContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

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

export const GameInviteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const handleWebSocketMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("Game invite message received:", data);

    if (data.type === "game_invite" && data.action === "receive") {
      toast({
        title: "Game Invite",
        description: `${data.sender_username} invited you to play a game`,
        className: "bg-primary border-none text-white",
        action: (
          <div className="flex gap-2">
            <button onClick={() => handleInviteResponse(data.invite_id!, true)}>
              Accept
            </button>
            <button
              onClick={() => handleInviteResponse(data.invite_id!, false)}
            >
              Reject
            </button>
          </div>
        ),
        duration: 8000,
      });
    } else if (data.type === "game_found") {
      toast({
        title: "go game",
        description: `${data.opponent_id} accepted your invite`,
        className: "bg-primary border-none text-white",
        action: (
          <div className="flex gap-2">
            <button
              onClick={() => {
                router.push(
                  `/Game-Arena?mode=one-vs-one&map=earth&game_id=${data.game_id}`,
                );
              }}
            >
              goo game
            </button>
          </div>
        ),
        duration: 8000,
      });
    } else if (data.type === "game_reject" && data.action === "rejected") {
      toast({
        title: "Game Invite Rejected",
        description: `your Invite declined`,
        className: "bg-primary-dark border-none text-white",
        duration: 8000,
      });
    }
  };

  const handleInviteResponse = (inviteId: string, accepted: boolean) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    socketRef.current.send(
      JSON.stringify({
        action: accepted ? "accept_invite" : "reject_invite",
        invite_id: inviteId,
      }),
    );
  };

  const sendGameInvite = (username: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    socketRef.current.send(
      JSON.stringify({
        type: "game_invite",
        action: "send_invite",
        username: username,
      }),
    );

    toast({
      title: "Game Invite Sent",
      description: `successfully to ${username}`,
      className: "bg-primary border-none text-white",
      duration: 8000,
    });
  };

  const InitSocket = () => {
    if (socketRef.current) return;

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL + "/game_invite/");

    ws.onmessage = handleWebSocketMessage;

    ws.onclose = () => {
      socketRef.current = null;
    };
    socketRef.current = ws;

    return () => {
      if (ws) {
        ws.close();
        socketRef.current = null;
      }
    };
  };

  useEffect(() => {
    const cleanup = InitSocket();
    return cleanup;
  }, []);

  return (
    <GameInviteContext.Provider
      value={{
        handleWebSocketMessage,
        handleInviteResponse,
        sendGameInvite,
        socket: socketRef.current,
      }}
    >
      {children}
    </GameInviteContext.Provider>
  );
};
