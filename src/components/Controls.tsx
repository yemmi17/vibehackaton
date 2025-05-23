import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { activateSpeedup, claimDailyBonus, resetDailyBonus } from '../store/gameSlice';
import { RootState } from '../store/store';

const Controls: React.FC = () => {
  const dispatch = useDispatch();
  const {
    nuts,
    isSpeedupActive,
    speedupEndTime,
    speedupCost,
    dailyBonusClaimed,
    nextBonusTime,
  } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(resetDailyBonus());
    }, 60000); // Check every minute
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleSpeedup = () => {
    if (!isSpeedupActive && nuts >= speedupCost) {
      const audio = new Audio('bonus.mp3');
      audio.play().catch(() => {});
      dispatch(activateSpeedup());
    }
  };

  const handleDailyBonus = () => {
    if (!dailyBonusClaimed && Date.now() >= nextBonusTime) {
      const audio = new Audio('collect.mp3');
      audio.play().catch(() => {});
      dispatch(claimDailyBonus());
    }
  };

  const formatTimeLeft = (endTime: number) => {
    const timeLeft = Math.max(0, endTime - Date.now());
    const seconds = Math.ceil(timeLeft / 1000);
    if (seconds < 60) return `${seconds}с`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}м ${remainingSeconds}с`;
  };

  const formatNextBonus = (nextTime: number) => {
    const timeLeft = Math.max(0, nextTime - Date.now());
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      <motion.div
        onClick={handleSpeedup}
        role="button"
        tabIndex={0}
        style={{ pointerEvents: isSpeedupActive || nuts < speedupCost ? 'none' : 'auto' }}
        className={`relative p-4 rounded-lg shadow-lg flex items-center justify-between ${
          isSpeedupActive
            ? 'bg-yellow-100'
            : nuts >= speedupCost
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-gray-300'
        } transition-colors`}
        whileHover={!isSpeedupActive && nuts >= speedupCost ? { scale: 1.02 } : {}}
        whileTap={!isSpeedupActive && nuts >= speedupCost ? { scale: 0.98 } : {}}
      >
        <div className="flex items-center gap-3">
          <img src="icon_speedup.png" alt="" className="w-8 h-8" />
          <div className="text-left">
            <div className="font-bold text-lg">
              {isSpeedupActive ? 'Ускорение активно!' : 'Ускорить!'}
            </div>
            {!isSpeedupActive && (
              <div className="text-sm opacity-75">
                -{speedupCost}{' '}
                <img
                  src="nut_regular.png"
                  alt="орешек"
                  className="inline-block w-4 h-4 ml-1"
                />
              </div>
            )}
          </div>
        </div>
        {isSpeedupActive && speedupEndTime && (
          <div className="text-lg font-bold">{formatTimeLeft(speedupEndTime)}</div>
        )}
      </motion.div>

      <motion.div
        onClick={handleDailyBonus}
        role="button"
        tabIndex={0}
        style={{ pointerEvents: dailyBonusClaimed ? 'none' : 'auto' }}
        className={`relative p-4 rounded-lg shadow-lg flex items-center justify-between ${
          dailyBonusClaimed ? 'bg-gray-100' : 'bg-green-500 hover:bg-green-600'
        } transition-colors`}
        whileHover={!dailyBonusClaimed ? { scale: 1.02 } : {}}
        whileTap={!dailyBonusClaimed ? { scale: 0.98 } : {}}
      >
        <div className="flex items-center gap-3">
          <img src="icon_gift.png" alt="" className="w-8 h-8" />
          <div className="text-left">
            <div className="font-bold text-lg">
              {dailyBonusClaimed ? 'Бонус получен!' : 'Забрать бонус!'}
            </div>
            {dailyBonusClaimed && (
              <div className="text-sm opacity-75">
                Следующий через: {formatNextBonus(nextBonusTime)}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Controls; 