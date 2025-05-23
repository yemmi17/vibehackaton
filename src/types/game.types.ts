export interface GameState {
  coins: number;
  clickPower: number;
  lastClickTime: number;
}

export interface GameStats {
  totalClicks: number;
  coinsPerSecond: number;
  totalCoinsEarned: number;
} 