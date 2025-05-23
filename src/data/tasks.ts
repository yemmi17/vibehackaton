import { Task } from '../types/game';

export const getInitialTasks = (): Record<string, Task> => ({
  clicks: {
    id: 'clicks',
    name: 'Кликер',
    description: 'Кликни по белке 100 раз',
    type: 'clicks',
    target: 100,
    progress: 0,
    reward: 50,
    claimed: false,
    icon: 'icon_tasks.png'
  },
  earnNuts: {
    id: 'earnNuts',
    name: 'Коллекционер',
    description: 'Собери 1000 орешков',
    type: 'earnNuts',
    target: 1000,
    progress: 0,
    reward: 100,
    claimed: false,
    icon: 'nut_regular.png'
  },
  upgrades: {
    id: 'upgrades',
    name: 'Улучшатель',
    description: 'Купи 3 улучшения',
    type: 'upgrades',
    target: 3,
    progress: 0,
    reward: 75,
    claimed: false,
    icon: 'icon_upgrades.png'
  },
  speedups: {
    id: 'speedups',
    name: 'Ускоритель',
    description: 'Используй ускорение 2 раза',
    type: 'speedups',
    target: 2,
    progress: 0,
    reward: 60,
    claimed: false,
    icon: 'icon_speedup.png'
  }
}); 