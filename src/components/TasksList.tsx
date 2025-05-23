import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Task } from '../types/game';

interface TaskItemProps {
  task: Task;
  progress: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, progress }) => {
  const progressPercent = Math.min((progress / task.target) * 100, 100);

  return (
    <motion.div
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem',
        backgroundColor: task.claimed 
          ? 'rgb(243, 244, 246)' 
          : progress >= task.target 
            ? 'rgb(220, 252, 231)' 
            : 'white'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="text-right">
          <div className="font-bold">
            {progress}/{task.target}
          </div>
          <div className="text-sm text-gray-500">
            {task.claimed ? 'Выполнено!' : progressPercent >= 100 ? 'Можно забрать!' : 'В процессе'}
          </div>
        </div>
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </motion.div>
  );
};

const TasksList: React.FC = () => {
  const { tasks, clickCount, totalNuts } = useSelector((state: RootState) => state.game);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Задания</h2>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          progress={task.type === 'clicks' ? clickCount : totalNuts}
        />
      ))}
    </div>
  );
};

export default TasksList; 