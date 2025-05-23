import React from 'react';
import { motion } from 'framer-motion';

const GameLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '1rem' }}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center">Garanti Squirrel</h1>
        </header>
        {children}
      </div>
    </motion.div>
  );
};

export default GameLayout; 