import axios from '@/lib/axios';
import { User, History, LeaderBoard } from '@/context/GlobalContext';

export const userService = {
  async getUserProfile(): Promise<User> {
    const response = await axios.get(`accounts/user-profile/`);
    return response.data;
  },
  async getPlayerMatches(): Promise<History[]> {
    const response = await axios.get(`accounts/user-history/`);
    return response.data;
  },
  async getPlayerLeaderBoard(): Promise<LeaderBoard[]> {
    const response = await axios.get(`accounts/leaderboard/`);
    return response.data;
  },
};
