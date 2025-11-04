import React, { useState, useEffect } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import type { Language, LessonTopic, Difficulty, Translations } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';
import BackIcon from './icons/BackIcon';

interface LessonPlanProps {
  language: Language;
  difficulty: Difficulty;
  onSelectTopic: (topic: LessonTopic) => void;
  onBack: () => void;
  t: Translations;
}

const LessonPlan: React.FC<LessonPlanProps> = ({ language, difficulty, onSelectTopic, onBack, t }) => {
  const [topics, setTopics] = useState<LessonTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const plan = await generateLessonPlan(language.name, difficulty);
        setTopics(plan);
      } catch (err: any) {
        setError(err.message || t.couldNotLoadLessonPlan);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, [language, difficulty, t]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner className="w-16 h-16 text-green-500 mb-4" />
        <p className="text-xl text-slate-600 font-bold">{t.buildingCurriculum.replace('{difficulty}', difficulty).replace('{language}', language.name)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">{t.oops}</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button onClick={onBack} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg">{t.chooseAnotherLanguage}</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 pt-8">
      <header className="relative mb-8 text-center">
        <button onClick={onBack} className="absolute top-1/2 left-0 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Go back">
          <BackIcon className="w-7 h-7" />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800 inline-flex items-center gap-3">
          <img src={language.flag} alt={`${language.name} flag`} className="w-10 h-auto rounded-md shadow-sm" />
          {t.learn} {language.name}
        </h1>
      </header>
      <div className="space-y-4">
        {topics.map((topic) => (
          <button
            key={topic.level}
            onClick={() => onSelectTopic(topic)}
            className="w-full flex items-center p-4 bg-white border-2 border-slate-200 rounded-2xl text-left hover:bg-green-50 hover:border-green-400 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full text-4xl mr-4">
                {topic.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{topic.title}</h2>
              <p className="text-slate-500">{t.level} {topic.level}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonPlan;