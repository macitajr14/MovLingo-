import React from 'react';
import type { Difficulty, Translations } from '../types';
import BackIcon from './icons/BackIcon';

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onBack: () => void;
  t: Translations;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty, onBack, t }) => {
  const difficulties: {level: Difficulty, name: string, description: string}[] = [
    { level: 'Beginner', name: t.beginner, description: t.beginnerDesc },
    { level: 'Intermediary', name: t.intermediary, description: t.intermediaryDesc },
    { level: 'Expert', name: t.expert, description: t.expertDesc }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-4">
       <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Go back">
          <BackIcon className="w-7 h-7" />
      </button>
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{t.chooseYourLevel}</h1>
        <p className="text-xl text-slate-500 mb-8">{t.levelDescription}</p>
        
        <div className="space-y-4">
          {difficulties.map(({level, name, description}) => (
            <button
              key={level}
              onClick={() => onSelectDifficulty(level)}
              className="w-full flex flex-col items-start p-4 bg-white border-2 border-slate-200 rounded-2xl text-left text-slate-700 font-bold text-lg hover:bg-green-50 hover:border-green-400 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              aria-label={`Select ${level} level`}
            >
              <span>{name}</span>
              <span className="font-normal text-base text-slate-500">{description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;