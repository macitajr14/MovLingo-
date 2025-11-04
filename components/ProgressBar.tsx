import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
            <div
            className="bg-yellow-400 h-4 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    </div>
  );
};

export default ProgressBar;