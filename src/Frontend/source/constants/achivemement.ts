export interface Achievement {
  player: number;
  achievement: Achievement2;
  gained: boolean;
  progress: number;
  date_earned: string;
  image: string;
}
export interface Achievement2 {
  name: string;
  description: string;
  condition: number;
  xp_gain: number;
}
