import React from 'react';
import { GameProvider } from './components/game/GameStateManager';
import GameLayout from './components/core/GameLayout';
import Tutorial from './components/ui/Tutorial';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <GameProvider>
      <GameLayout>
        <Tutorial />
        {/* Здесь будут добавлены остальные компоненты игры */}
      </GameLayout>
    </GameProvider>
  );
};

export default App; 