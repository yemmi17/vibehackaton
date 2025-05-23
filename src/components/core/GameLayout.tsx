import React from 'react';
import { motion } from 'framer-motion';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background p-4"
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-primary">
            🐿️ СтрахоБелка
          </h1>
        </header>
        <main>{children}</main>
      </div>
    </motion.div>
  );
};

export default GameLayout; 