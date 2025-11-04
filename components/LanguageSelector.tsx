import React from 'react';
import { LANGUAGES } from '../constants';
import type { Language, Translations } from '../types';
import BackIcon from './icons/BackIcon';

interface LanguageSelectorProps {
  onSelectLanguage: (language: Language) => void;
  onBack: () => void;
  t: Translations;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage, onBack, t }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white p-4">
       <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Go back">
          <BackIcon className="w-7 h-7" />
      </button>
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">MovLingo</h1>
        <p className="text-xl text-slate-500 mb-8">{t.chooseLanguageToLearn}</p>
        
        <div className="grid grid-cols-2 gap-4">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.name}
              onClick={() => onSelectLanguage(lang)}
              className="flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold text-lg hover:bg-green-50 hover:border-green-400 transition-all duration-200 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
              aria-label={`${t.learn} ${lang.name}`}
            >
              <img src={lang.flag} alt={`${lang.name} flag`} className="w-20 h-auto mb-3 rounded-md shadow-sm object-cover" />
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;