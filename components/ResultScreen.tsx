import React from 'react';
import { Translations } from '../types';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onMainMenu: () => void;
  t: Translations;
}

const TrophyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M11.996 2.003c.83-.01 1.633.29 2.274.84l.273.238 1.09 1.225 1.082.018a3.738 3.738 0 013.473 4.41l-.105 1.203.83 1.003a3.74 3.74 0 01-1.33 5.16l-1.12.836.12 1.196a3.738 3.738 0 01-4.622 3.376l-1.16-.395-1.15.53a3.738 3.738 0 01-4.227 0l-1.15-.53-1.16.396a3.738 3.738 0 01-4.621-3.376l.12-1.196-1.12-.835a3.74 3.74 0 01-1.33-5.16l.83-1.003-.105-1.203a3.738 3.738 0 013.473-4.41l1.082-.018 1.09-1.225.273-.238c.642-.55 1.444-.85 2.274-.84zm1.202 7.175a.75.75 0 00-1.012-1.098l-2.5 2.309-1.22-1.22a.75.75 0 00-1.06 1.06l1.75 1.75a.75.75 0 001.06 0l3-2.75z" clipRule="evenodd" />
    </svg>
);


const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart, onMainMenu, t }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const message = percentage > 80 ? t.excellentWork : percentage > 50 ? t.goodJob : t.keepPracticing;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 text-center">
      <TrophyIcon className="w-24 h-24 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">{message}</h1>
      <p className="text-lg text-slate-600 mb-2">{t.lessonComplete}</p>
      
      <div className="bg-white p-6 rounded-2xl shadow-md my-8 w-full max-w-sm">
        <p className="text-xl text-slate-600">{t.yourScore}</p>
        <p className="text-6xl font-extrabold text-green-500 my-2">{percentage}%</p>
        <p className="text-md text-slate-500">{score} / {totalQuestions} {t.correct}</p>
      </div>
      
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={onRestart}
          className="w-full p-4 bg-green-500 text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-colors transform hover:scale-105"
        >
          {t.practiceAgain}
        </button>
        <button
          onClick={onMainMenu}
          className="w-full p-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-colors transform hover:scale-105"
        >
          {t.mainMenu}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;