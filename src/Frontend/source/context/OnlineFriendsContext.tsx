'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/GlobalContext';
import { onlineService } from '@/services/onlineService';

interface OnlineFriendsContextType {
  onlineFriends: Set<number>;
  isUserOnline: (userId: number) => boolean;
  onlineFriendsCount: number;
}

const OnlineFriendsContext = createContext<OnlineFriendsContextType | undefined>(undefined);

export const OnlineFriendsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  
  const [onlineFriends, setOnlineFriends] = useState<Set<number>>(new Set());
  const { user, userId } = useUser();

  useEffect(() => {
    if (!user) return;
    
    const ws = onlineService.createWebSocketConnection(user);
 
    

    return () => ws.closeConnection();
  }, []);

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