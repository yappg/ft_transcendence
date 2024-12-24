'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';

interface OnlineFriendsContextType {
  onlineFriends: Set<number>;
  isUserOnline: (userId: number) => boolean;
  onlineFriendsCount: number;
}

const OnlineFriendsContext = createContext<OnlineFriendsContextType | undefined>(undefined);

export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onlineFriends, setOnlineFriends] = useState<Set<number>>(new Set());
  const { user, setNotifications, setNotificationCount } = useUser();

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:8080/ws/notifications/?user_id=${user.id}`);
    console.log("I am here -----------");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'status_update':
          if (data.is_friend) {
            setOnlineFriends(prev => {
              const newSet = new Set(prev);
              if (data.status === 'online') {
                newSet.add(data.user_id);
              } else {
                newSet.delete(data.user_id);
              }
              return newSet;
            });
          }
          break;

        case 'notification':
          // Handle regular notifications
          setNotifications(prev => [data, ...prev]);
          setNotificationCount(prev => prev + 1);
          break;

        default:
          console.log('Received message:', data);
          break;
      }
    };

    return () => ws.close();
  }, [user, setNotifications, setNotificationCount]);

  const value = {
    onlineFriends,
    isUserOnline: (userId: number) => onlineFriends.has(userId),
    onlineFriendsCount: onlineFriends.size
  };

  return (
    <OnlineFriendsContext.Provider value={value}>
      {children}
    </OnlineFriendsContext.Provider>
  );
};

// Export the custom hook
export const useOnlineFriends = () => {
  const context = useContext(OnlineFriendsContext);
  if (context === undefined) {
    throw new Error('useOnlineFriends must be used within an OnlineFriendsProvider');
  }
  return context;
};

// Export the context if needed elsewhere
export default OnlineFriendsContext;