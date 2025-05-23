import { Upgrade } from '../types/game';

export const getInitialUpgrades = (): Record<string, Upgrade> => ({
  clickPower: {
    id: 'clickPower',
    name: 'Сила клика',
    description: 'Увеличивает количество орешков за клик',
    basePrice: 10,
    priceMultiplier: 1.5,
    level: 0,
    maxLevel: 10,
    icon: 'icon_upgrade_home.png',
    effect: {
      type: 'clickPower',
      value: 1
    }
  },
  passiveIncome: {
    id: 'passiveIncome',
    name: 'Пассивный доход',
    description: 'Автоматически собирает орешки каждую секунду',
    basePrice: 50,
    priceMultiplier: 2,
    level: 0,
    maxLevel: 5,
    icon: 'icon_upgrade_passive.png',
    effect: {
      type: 'passiveIncome',
      value: 1
    }
  },
  insurance: {
    id: 'insurance',
    name: 'Страховка',
    description: 'Увеличивает шанс получения редких орешков',
    basePrice: 100,
    priceMultiplier: 2.5,
    level: 0,
    maxLevel: 3,
    icon: 'icon_upgrade_car.png',
    effect: {
      type: 'clickPower',
      value: 2
    }
  }
}); 