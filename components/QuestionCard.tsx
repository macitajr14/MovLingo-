import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
// Fix: Use the specific ImageChoiceQuestion type instead of the general Question union type.
import type { ImageChoiceQuestion, AnswerStatus } from '../types';
import LoadingSpinner from './icons/LoadingSpinner';

interface QuestionCardProps {
  // Fix: The question prop should be of type ImageChoiceQuestion as this component is specific to image choice questions.
  question: ImageChoiceQuestion;
  onAnswer: (selected: string) => void;
  answerStatus: AnswerStatus;
  selectedAnswer: string | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, answerStatus, selectedAnswer }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setIsImageLoading(true);
      setError(null);
      setImageUrl(null);
      try {
        const base64Image = await generateImage(question.imagePrompt);
        setImageUrl(`data:image/png;base64,${base64Image}`);
      } catch (err) {
        setError('Could not load image.');
        console.error(err);
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [question]);

  const getOptionClasses = (option: string) => {
    const isSelected = selectedAnswer === option;
    const isCorrect = option === question.correctAnswer;
    const isUnanswered = answerStatus === 'unanswered' || answerStatus === 'checking';

    let baseClasses = "w-full p-4 border-2 rounded-2xl font-bold text-lg transition-all duration-200 text-slate-700";

    if (isUnanswered) {
        return `${baseClasses} ${isSelected ? 'bg-blue-100 border-blue-400' : 'bg-white border-slate-200 hover:bg-slate-100'}`;
    }
    
    // After checking answer
    if (isCorrect) {
        return `${baseClasses} bg-green-100 border-green-500 text-green-800`;
    }
    if (isSelected && !isCorrect) {
        return `${baseClasses} bg-red-100 border-red-500 text-red-800`;
    }
    
    return `${baseClasses} bg-white border-slate-200 opacity-50`;
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 flex-grow">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {question.questionTitle}
      </h2>
      
      <div className="relative w-48 h-48 mx-auto mb-6 border-2 border-slate-200 rounded-2xl bg-white flex items-center justify-center overflow-hidden">
        {isImageLoading && <LoadingSpinner className="w-12 h-12 text-slate-400" />}
        {error && <p className="text-red-500 p-4 text-center">{error}</p>}
        {imageUrl && <img src={imageUrl} alt={question.imagePrompt} className="object-contain w-full h-full p-2" />}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={answerStatus !== 'unanswered'}
            className={getOptionClasses(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;