'use client';
import React, { 
    createContext, 
    useContext, 
    useState, 
    useEffect, 
    ReactNode 
} from 'react';
import axios from 'axios';
import FriendServices from '@/services/friendServices';

const USER_BASE_URL = 'http://localhost:8080/api';

const userApi = axios.create({
  baseURL: USER_BASE_URL,
  withCredentials: true,
});

// Define the User interface based on your requirements
interface User {
  id: number;
  username: string;
  // Add other user properties as needed
  [key: string]: any;
}

// Context type definition
interface UserContextType {
  user: User | null;
  userId: number | null;
  isLoading: boolean;
  error: Error | null;
  fetchCurrentUserDetails: () => Promise<void>;
}

// User Service
const userService = {

  async getUserDetailsByUsername(username: string): Promise<User> {
    const response = await userApi.get(`/users/${username}`);
    return response.data;
  },

  async getCurrentUserId(): Promise<User> {
    const response = await userApi.get(`/users/me/`);
    return response.data;
  }
};

// Create the context
const UserContext = createContext<UserContextType>({
  user: null,
  userId: null,
  isLoading: false,
  error: null,
  fetchCurrentUserDetails: async () => {},
  fetchPlayers: async () => {}
});

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [players, setplayers] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);


  const fetchCurrentUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await userService.getCurrentUserId();
      setUser(userData);
      setUserId(userData.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch current user'));
      setUser(null);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await FriendServices.getPlayers();
      if (data.message) {
          setplayers(data.data);
          setIsLoading(false);
        }
        return data.data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user details'));
      setplayers(null);
    } finally {
      setIsLoading(false);
    }
    return []
  }

  // Optional: Auto-fetch current user on provider mount
  useEffect(() => {
    fetchCurrentUserDetails();
    fetchPlayers();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      userId,
      isLoading,
      players,
      error,
      fetchCurrentUserDetails,
      fetchPlayers
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};

// Export the userApi and userService for use in other parts of the application
export { userApi, userService };