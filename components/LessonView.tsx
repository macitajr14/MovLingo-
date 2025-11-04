import React, { useState, useEffect, useCallback } from 'react';
import { generateLesson } from '../services/geminiService';
import type { Lesson, Language, AnswerStatus, LessonTopic, Difficulty, Question, Translations } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import SentenceConstructionCard from './SentenceConstructionCard';
import HeartIcon from './icons/HeartIcon';

interface LessonViewProps {
  nativeLanguage: Language;
  language: Language;
  lessonTopic: LessonTopic;
  difficulty: Difficulty;
  onLessonComplete: (score: number, total: number) => void;
  onExit: () => void;
  t: Translations;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const LessonView: React.FC<LessonViewProps> = ({ nativeLanguage, language, lessonTopic, difficulty, onLessonComplete, onExit, t }) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lessonData = await generateLesson(nativeLanguage.name, language.name, lessonTopic, difficulty);
        setLesson(lessonData);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [nativeLanguage, language, lessonTopic, difficulty]);

  const handleAnswerSelect = useCallback((option: string | string[]) => {
    if (answerStatus === 'unanswered') {
      setSelectedAnswer(option);
    }
  }, [answerStatus]);

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !lesson) return;
    setAnswerStatus('checking');

    const currentQuestion = lesson.questions[currentQuestionIndex];
    let isCorrect = false;
    if (currentQuestion.type === 'image-choice' && typeof selectedAnswer === 'string') {
      isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'sentence-construction' && Array.isArray(selectedAnswer)) {
      isCorrect = selectedAnswer.join(' ') === currentQuestion.correctAnswerInOrder.join(' ');
    }
    
    if (isCorrect) {
      setScore(s => s + 1);
      setAnswerStatus('correct');
    } else {
      setHearts(h => Math.max(0, h - 1));
      setAnswerStatus('incorrect');
    }
  };

  const handleContinue = () => {
    if (!lesson) return;
    
    // If user is out of hearts after an incorrect answer, end lesson
    if (answerStatus === 'incorrect' && hearts === 0) {
        onLessonComplete(score, lesson.questions.length);
        return;
    }

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
      setAnswerStatus('unanswered');
    } else {
      onLessonComplete(score, lesson.questions.length);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <LoadingSpinner className="w-16 h-16 text-green-500 mb-4" />
        <p className="text-xl text-slate-600 font-bold">{t.craftingYourLesson.replace('{lesson}', lessonTopic.title)}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">{t.oops}</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button onClick={onExit} className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg">{t.backToMenu}</button>
      </div>
    );
  }

  if (!lesson) return null;
  
  const currentQuestion: Question = lesson.questions[currentQuestionIndex];
  const isCorrect = answerStatus === 'correct';
  const showFooter = answerStatus === 'correct' || answerStatus === 'incorrect';

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="p-4 flex items-center gap-4 shrink-0">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-600" aria-label="Exit lesson">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ProgressBar current={currentQuestionIndex + 1} total={lesson.questions.length} />
        <div className="flex items-center gap-1 text-red-500">
            <HeartIcon className="w-7 h-7" />
            <span className="font-bold text-lg">{hearts}</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col justify-center">
        { currentQuestion.type === 'image-choice' && (
            <QuestionCard 
                question={currentQuestion}
                onAnswer={handleAnswerSelect}
                answerStatus={answerStatus}
                selectedAnswer={typeof selectedAnswer === 'string' ? selectedAnswer : null}
            />
        )}
        { currentQuestion.type === 'sentence-construction' && (
            <SentenceConstructionCard
                question={currentQuestion}
                onAnswer={handleAnswerSelect}
                answerStatus={answerStatus}
                language={language}
                t={t}
            />
        )}
      </main>

      <footer className="shrink-0">
        {showFooter && (
          <div className={`p-4 transition-all duration-300 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
              <div className="max-w-md mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isCorrect ? <CheckIcon /> : <XIcon />}
                      </div>
                      <div>
                          <h3 className={`font-bold text-xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {isCorrect ? t.youAreCorrect : t.incorrect}
                          </h3>
                      </div>
                  </div>
                  <button 
                      onClick={handleContinue}
                      className={`px-8 py-3 rounded-2xl font-bold text-white text-lg ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                      {t.continue}
                  </button>
              </div>
          </div>
        )}

        {!showFooter && (
          <div className="p-4 border-t-2 border-slate-200">
              <div className="max-w-md mx-auto">
                  <button
                      onClick={handleCheckAnswer}
                      disabled={!selectedAnswer || selectedAnswer.length === 0}
                      className="w-full p-4 bg-green-500 text-white font-bold text-lg uppercase rounded-2xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  >
                      {t.check}
                  </button>
              </div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default LessonView;