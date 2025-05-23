import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../types/game';

const initialState: GameState = {
  nuts: 0,
  baseNutsPerClick: 1,
  bonusNutsPerClick: 0,
  clickCount: 0,
  totalNuts: 0,
  isSpeedupActive: false,
  speedupEndTime: 0,
  speedupCost: 100,
  dailyBonusClaimed: false,
  nextBonusTime: Date.now(),
  upgrades: [],
  tasks: []
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addNuts: (state, action: PayloadAction<number>) => {
      state.nuts += action.payload;
      state.totalNuts += action.payload;
    },
    updateClickCount: (state) => {
      state.clickCount += 1;
    },
    activateSpeedup: (state) => {
      if (!state.isSpeedupActive && state.nuts >= state.speedupCost) {
        state.nuts -= state.speedupCost;
        state.isSpeedupActive = true;
        state.speedupEndTime = Date.now() + 30000; // 30 seconds
        state.speedupCost = Math.floor(state.speedupCost * 1.5);
      }
    },
    claimDailyBonus: (state) => {
      if (!state.dailyBonusClaimed && Date.now() >= state.nextBonusTime) {
        const bonus = Math.floor(100 + Math.random() * 100);
        state.nuts += bonus;
        state.totalNuts += bonus;
        state.dailyBonusClaimed = true;
        state.nextBonusTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      }
    },
    resetDailyBonus: (state) => {
      if (state.dailyBonusClaimed && Date.now() >= state.nextBonusTime) {
        state.dailyBonusClaimed = false;
      }
    },
    loadGameState: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    }
  }
});

export const {
  addNuts,
  updateClickCount,
  activateSpeedup,
  claimDailyBonus,
  resetDailyBonus,
  loadGameState
} = gameSlice.actions;

export default gameSlice.reducer; 