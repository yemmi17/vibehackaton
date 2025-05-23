import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Upgrade } from '../types/game';

interface UpgradeItemProps {
  upgrade: Upgrade;
  canAfford: boolean;
  onClick: () => void;
}

const UpgradeItem: React.FC<UpgradeItemProps> = ({ upgrade, canAfford, onClick }) => {
  return (
    <motion.div
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem',
        backgroundColor: canAfford ? 'rgb(220, 252, 231)' : 'rgb(243, 244, 246)',
        cursor: canAfford ? 'pointer' : 'not-allowed'
      }}
      whileHover={canAfford ? { scale: 1.02 } : {}}
      whileTap={canAfford ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold mb-1">{upgrade.name}</h3>
          <p className="text-sm text-gray-600">{upgrade.description}</p>
        </div>
        <div className="text-right">
          <div className="font-bold">
            {upgrade.cost}{' '}
            <img src="nut_regular.png" alt="орешек" className="inline w-4 h-4" />
          </div>
          <div className="text-sm text-gray-500">
            Уровень: {upgrade.level}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UpgradesList: React.FC = () => {
  const { upgrades, nuts } = useSelector((state: RootState) => state.game);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Улучшения</h2>
      {upgrades.map(upgrade => (
        <UpgradeItem
          key={upgrade.id}
          upgrade={upgrade}
          canAfford={nuts >= upgrade.cost}
          onClick={() => {
            if (nuts >= upgrade.cost) {
              const audio = new Audio('upgrade.mp3');
              audio.play().catch(() => {});
              // dispatch upgrade action here
            }
          }}
        />
      ))}
    </div>
  );
};

export default UpgradesList; 