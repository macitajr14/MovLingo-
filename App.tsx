import React, { useState, useCallback } from 'react';
import NativeLanguageSelector from './components/NativeLanguageSelector';
import LanguageSelector from './components/LanguageSelector';
import DifficultySelector from './components/DifficultySelector';
import LessonPlan from './components/LessonPlan';
import LessonView from './components/LessonView';
import ResultScreen from './components/ResultScreen';
import type { AppState, Language, LessonTopic, Difficulty } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('native_language_select');
  const [nativeLanguage, setNativeLanguage] = useState<Language | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<LessonTopic | null>(null);
  const [lastScore, setLastScore] = useState<{ score: number; total: number } | null>(null);

  const t = nativeLanguage?.name === 'Portuguese' ? translations.pt : translations.en;

  const handleNativeLanguageSelect = useCallback((language: Language) => {
    setNativeLanguage(language);
    setAppState('language_select');
  }, []);

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language);
    setAppState('difficulty_select');
  }, []);
  
  const handleDifficultySelect = useCallback((difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setAppState('lesson_plan');
  }, []);

  const handleTopicSelect = useCallback((topic: LessonTopic) => {
    setSelectedTopic(topic);
    setAppState('lesson');
  }, []);

  const handleLessonComplete = useCallback((score: number, total: number) => {
    setLastScore({ score, total });
    setAppState('results');
  }, []);
  
  const handleRestartLesson = useCallback(() => {
    if (nativeLanguage && selectedLanguage && selectedTopic && selectedDifficulty) {
      setAppState('lesson');
    } else {
       // Should not happen, but as a fallback
      handleGoToMainMenu();
    }
  }, [nativeLanguage, selectedLanguage, selectedTopic, selectedDifficulty]);

  const handleBackToPlan = useCallback(() => {
    setAppState('lesson_plan');
    setSelectedTopic(null);
  }, []);

  const handleGoToMainMenu = useCallback(() => {
    setSelectedLanguage(null);
    setSelectedDifficulty(null);
    setSelectedTopic(null);
    setLastScore(null);
    setAppState('language_select');
  }, []);

  const handleResetApp = useCallback(() => {
    setNativeLanguage(null);
    setSelectedLanguage(null);
    setSelectedDifficulty(null);
    setSelectedTopic(null);
    setLastScore(null);
    setAppState('native_language_select');
  }, []);

  const handleBackToLanguageSelect = useCallback(() => {
    setSelectedLanguage(null);
    setAppState('language_select');
  }, []);

  const handleBackToDifficultySelect = useCallback(() => {
    setSelectedDifficulty(null);
    setAppState('difficulty_select');
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'language_select':
        return <LanguageSelector onSelectLanguage={handleLanguageSelect} onBack={handleResetApp} t={t} />;

      case 'difficulty_select':
        if (selectedLanguage) {
            return <DifficultySelector onSelectDifficulty={handleDifficultySelect} onBack={handleBackToLanguageSelect} t={t} />;
        }
        return <LanguageSelector onSelectLanguage={handleLanguageSelect} onBack={handleResetApp} t={t} />;

      case 'lesson_plan':
        if (selectedLanguage && selectedDifficulty) {
          return <LessonPlan language={selectedLanguage} difficulty={selectedDifficulty} onSelectTopic={handleTopicSelect} onBack={handleBackToDifficultySelect} t={t} />;
        }
        return <LanguageSelector onSelectLanguage={handleLanguageSelect} onBack={handleResetApp} t={t} />;

      case 'lesson':
        if (nativeLanguage && selectedLanguage && selectedTopic && selectedDifficulty) {
          return <LessonView nativeLanguage={nativeLanguage} language={selectedLanguage} lessonTopic={selectedTopic} difficulty={selectedDifficulty} onLessonComplete={handleLessonComplete} onExit={handleBackToPlan} t={t} />;
        }
        return <LanguageSelector onSelectLanguage={handleLanguageSelect} onBack={handleResetApp} t={t} />;

      case 'results':
        if (lastScore) {
          return (
            <ResultScreen
              score={lastScore.score}
              totalQuestions={lastScore.total}
              onRestart={handleRestartLesson}
              onMainMenu={handleGoToMainMenu}
              t={t}
            />
          );
        }
        return <LanguageSelector onSelectLanguage={handleLanguageSelect} onBack={handleResetApp} t={t} />;
        
      case 'native_language_select':
      default:
        return <NativeLanguageSelector onSelectNativeLanguage={handleNativeLanguageSelect} t={t} />;
    }
  };

  return (
    <div key={appState} className="w-full min-h-screen bg-white font-sans screen-transition">
      {renderContent()}
    </div>
  );
};

export default App;