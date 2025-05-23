import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './store/gameSlice';
import Squirrel from './components/Squirrel';
import Controls from './components/Controls';
import UpgradesList from './components/UpgradesList';
import TasksList from './components/TasksList';
import { Screen } from './types/game';

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  // Load saved game state
  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        store.dispatch({ type: 'game/loadGameState', payload: state });
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  // Save game state periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      const state = store.getState().game;
      localStorage.setItem('gameState', JSON.stringify(state));
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <img src="logo.png" alt="Energogarant Logo" className="h-12" />
            <button className="p-2 rounded hover:bg-gray-100">
              <img src="icon_rules.png" alt="Rules" className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {currentScreen === 'home' && (
            <div className="space-y-8">
              <Squirrel />
              <Controls />
            </div>
          )}
          {currentScreen === 'upgrades' && <UpgradesList />}
          {currentScreen === 'tasks' && <TasksList />}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-around">
              {[
                { id: 'home', icon: 'icon_home.png', label: 'Главная' },
                { id: 'upgrades', icon: 'icon_upgrades.png', label: 'Апгрейды' },
                { id: 'tasks', icon: 'icon_tasks.png', label: 'Задачи' },
                { id: 'rating', icon: 'icon_rating.png', label: 'Рейтинг' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`flex flex-col items-center p-3 flex-1 ${
                    currentScreen === item.id
                      ? 'text-green-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <img src={item.icon} alt="" className="w-6 h-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </Provider>
  );
};

export default App; 