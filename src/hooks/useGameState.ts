import { useState, useCallback } from 'react';
import { GameState, GameStats } from '../types/game.types';

const INITIAL_GAME_STATE: GameState = {
  coins: 0,
  clickPower: 1,
  lastClickTime: Date.now(),
};

const INITIAL_GAME_STATS: GameStats = {
  totalClicks: 0,
  coinsPerSecond: 0,
  totalCoinsEarned: 0,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [gameStats, setGameStats] = useState<GameStats>(INITIAL_GAME_STATS);

  const handleClick = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      coins: prevState.coins + prevState.clickPower,
      lastClickTime: Date.now(),
    }));

    setGameStats(prevStats => ({
      ...prevStats,
      totalClicks: prevStats.totalClicks + 1,
      totalCoinsEarned: prevStats.totalCoinsEarned + gameState.clickPower,
    }));
  }, [gameState.clickPower]);

  return {
    gameState,
    gameStats,
    handleClick,
  };
}; 