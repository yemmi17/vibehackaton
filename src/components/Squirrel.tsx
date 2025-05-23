import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, HTMLMotionProps } from 'framer-motion';
import confetti from 'canvas-confetti';
import { addNuts, updateClickCount } from '../store/gameSlice';
import { RootState } from '../store/store';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
}

const Squirrel: React.FC = () => {
  const dispatch = useDispatch();
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);
  const [particleId, setParticleId] = useState(0);
  
  const { baseNutsPerClick, bonusNutsPerClick } = useSelector((state: RootState) => state.game);
  const totalNutsPerClick = baseNutsPerClick + bonusNutsPerClick;

  const handleClick = useCallback(() => {
    // Visual feedback
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    // Create particles
    const newParticles: ClickParticle[] = [];
    const particleCount = Math.min(5 + Math.floor(totalNutsPerClick / 2), 15);
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: particleId + i,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40
      });
    }
    
    setParticleId(prev => prev + particleCount);
    setParticles(prev => [...prev, ...newParticles]);

    // Play sound
    const audio = new Audio('click.mp3');
    audio.play().catch(() => {}); // Ignore errors if sound can't play

    // Update game state
    dispatch(addNuts(totalNutsPerClick));
    dispatch(updateClickCount());

    // Confetti effect for big clicks
    if (totalNutsPerClick >= 5) {
      confetti({
        particleCount: Math.min(totalNutsPerClick * 2, 30),
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [dispatch, totalNutsPerClick, particleId]);

  // Cleanup particles after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setParticles([]);
    }, 700);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        style={{
          width: '16rem',
          height: '16rem',
          backgroundImage: 'url(squirrel_idle.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          cursor: 'pointer',
        }}
        animate={{ scale: isClicked ? 0.95 : 1 }}
        transition={{ duration: 0.15 }}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
      />
      
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute text-yellow-500 font-bold pointer-events-none"
            initial={{ 
              opacity: 1,
              scale: 1,
              x: particle.x,
              y: particle.y
            }}
            animate={{
              opacity: 0,
              scale: 0,
              y: particle.y - 100,
              x: particle.x + (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            +{totalNutsPerClick}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Squirrel; 