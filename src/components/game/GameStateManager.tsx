import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGameState, saveGameState } from '../../store/gameSlice';
import { RootState } from '../../store/store';

const GameStateManager: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch(loadGameState(parsedState));
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, [dispatch]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  return null;
};

export default GameStateManager; 