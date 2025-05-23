import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tutorialSteps = [
  {
    title: 'Добро пожаловать!',
    content: 'Познакомьтесь с Белкой Гарантией - вашим помощником в мире страхования!',
  },
  {
    title: 'Как играть',
    content: 'Кликайте на белочку, чтобы помогать лесным жителям страховаться от разных опасностей.',
  },
  {
    title: 'Зарабатывайте баллы',
    content: 'За каждое действие вы получаете гарант-баллы, которые можно потратить на улучшения.',
  },
];

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4">{tutorialSteps[currentStep].title}</h2>
          <p className="mb-6">{tutorialSteps[currentStep].content}</p>
          <button
            onClick={nextStep}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            {currentStep < tutorialSteps.length - 1 ? 'Далее' : 'Начать игру'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial; 