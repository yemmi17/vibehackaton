import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tutorialSteps = [
  {
    title: 'Добро пожаловать!',
    content: 'Привет! Я СтрахоБелка, и я помогу тебе собрать много орешков!'
  },
  {
    title: 'Кликай!',
    content: 'Кликай по мне, чтобы собирать орешки. Чем больше кликаешь, тем больше орешков!'
  },
  {
    title: 'Улучшения',
    content: 'Используй заработанные орешки, чтобы покупать улучшения. Они помогут собирать орешки быстрее!'
  },
  {
    title: 'Задания',
    content: 'Выполняй задания, чтобы получить дополнительные награды. Некоторые задания дают особые бонусы!'
  },
  {
    title: 'Бонусы',
    content: 'Не забывай про ежедневные бонусы и ускорения. Они помогут тебе собрать еще больше орешков!'
  }
];

const Tutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50
        }}
      >
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
          <h2 className="text-2xl font-bold mb-4">{tutorialSteps[currentStep].title}</h2>
          <p className="text-gray-600 mb-6">{tutorialSteps[currentStep].content}</p>
          <div className="flex justify-between items-center">
            <div className="space-x-1">
              {tutorialSteps.map((_, index) => (
                <span
                  key={index}
                  className={`inline-block w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {currentStep < tutorialSteps.length - 1 ? 'Далее' : 'Начать игру'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial; 