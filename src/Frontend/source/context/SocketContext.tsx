// context/SocketContext.js
// context/SocketContext.js
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
      throw new Error("SoketContext error");
  }
  return context;
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
      const socket = new WebSocket('ws://localhost:8080/ws/notifications/');
      
      socket.onopen = () => {
          console.log('Connected to WebSocket server');
        };
        
        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };
        
        setSocket(socket); 

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (error instanceof Event) {
            console.error('Error details:', {
              type: error.type,
              target: error.target,
              currentTarget: error.currentTarget,
              eventPhase: error.eventPhase,
              timeStamp: error.timeStamp,
            });
          }
        };
    
        
        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

      return () => {
        socket.close();
      };
    } ,[]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};