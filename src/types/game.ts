export interface Upgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  cost: number;
  effect: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'clicks' | 'nuts';
  target: number;
  claimed: boolean;
  reward: number;
}

export interface GameState {
  nuts: number;
  baseNutsPerClick: number;
  bonusNutsPerClick: number;
  clickCount: number;
  totalNuts: number;
  isSpeedupActive: boolean;
  speedupEndTime: number;
  speedupCost: number;
  dailyBonusClaimed: boolean;
  nextBonusTime: number;
  upgrades: Upgrade[];
  tasks: Task[];
}

export type Screen = 'home' | 'upgrades' | 'tasks' | 'rating'; 