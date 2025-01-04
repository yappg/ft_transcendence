// Define the Achievement interface
export interface Achievement {
  id: number;
  title: string;
  description: string;
  points: number;
  progress: number;
  xpReward: number;
  iconUrl: string;
  gained: boolean;
  dateEarned: Date | null;
  ratio: number;
  achievement: Achievement;
}
