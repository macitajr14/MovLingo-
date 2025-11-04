import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { SentenceConstructionQuestion, AnswerStatus, Language, Translations } from '../types';
import SpeakButton from './SpeakButton';
import MicrophoneIcon from './icons/MicrophoneIcon';

interface SentenceConstructionCardProps {
  question: SentenceConstructionQuestion;
  onAnswer: (selected: string[]) => void;
  answerStatus: AnswerStatus;
  language: Language;
  t: Translations;
}

interface Word {
    id: number;
    text: string;
}

const getLanguageCode = (languageName: string): string => {
    const map: { [key: string]: string } = {
        'English': 'en-US', 'French': 'fr-FR', 'German': 'de-DE',
        'Italian': 'it-IT', 'Japanese': 'ja-JP', 'Spanish': 'es-ES',
    };
    return map[languageName] || 'en-US';
};

const SentenceConstructionCard: React.FC<SentenceConstructionCardProps> = ({ question, onAnswer, answerStatus, language, t }) => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const initialWordBank = useMemo(() => question.wordBank.map((text, id) => ({ id, text })), [question.wordBank]);
  const [wordBank, setWordBank] = useState<Word[]>(initialWordBank);
  
  const [speechStatus, setSpeechStatus] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  // Fix: Use 'any' type for SpeechRecognition to resolve missing type definition error.
  const recognitionRef = useRef<any | null>(null);
  
  useEffect(() => {
    // Reset state when question changes
    setSelectedWords([]);
    setWordBank(question.wordBank.map((text, id) => ({ id, text })));
    onAnswer([]); // Clear answer in parent
  }, [question, onAnswer]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setSpeechError(t.micNotSupported);
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getLanguageCode(language.name);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        setSpeechStatus('listening');
        setSpeechError(null);
    };

    recognition.onend = () => {
        setSpeechStatus('idle');
    };

    recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
             setSpeechError(t.micPermissionDenied);
        } else {
             setSpeechError(t.speechError);
        }
        setSpeechStatus('error');
    };

    recognition.onresult = (event: any) => {
        setSpeechStatus('processing');
        const transcript = event.results[0][0].transcript;
        
        let availableWords = [...initialWordBank];
        const newSelectedWords: Word[] = [];
        
        const spokenWords = transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").split(' ');

        for (const spokenWord of spokenWords) {
            const trimmedWord = spokenWord.trim();
            if(!trimmedWord) continue;

            const wordIndex = availableWords.findIndex(w => w.text.toLowerCase() === trimmedWord);

            if (wordIndex > -1) {
                const [foundWord] = availableWords.splice(wordIndex, 1);
                newSelectedWords.push(foundWord);
            }
        }
        
        setSelectedWords(newSelectedWords);
        setWordBank(availableWords);
        onAnswer(newSelectedWords.map(w => w.text));
        setSpeechStatus('idle');
    };

    recognitionRef.current = recognition;

}, [language.name, t, onAnswer, initialWordBank]);

  const handleWordBankClick = (word: Word) => {
    if (answerStatus !== 'unanswered') return;
    const newSelectedWords = [...selectedWords, word];
    setSelectedWords(newSelectedWords);
    setWordBank(wordBank.filter(w => w.id !== word.id));
    onAnswer(newSelectedWords.map(w => w.text));
  };
  
  const handleSelectedWordClick = (word: Word) => {
    if (answerStatus !== 'unanswered') return;
    const newSelectedWords = selectedWords.filter(w => w.id !== word.id);
    setSelectedWords(newSelectedWords);
    setWordBank([...wordBank, word]);
    onAnswer(newSelectedWords.map(w => w.text));
  };
  
  const handleMicClick = () => {
    if (speechStatus === 'listening' || !recognitionRef.current) {
        recognitionRef.current?.stop();
    } else {
        recognitionRef.current?.start();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 flex-grow">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {t.writeThisIn.replace('{language}', language.name)}
      </h2>
      
      <div className="flex items-center gap-3 mb-8">
        <SpeakButton text={question.phraseToTranslate} languageCode="en-US" />
        <span className="text-xl font-bold text-slate-700 tracking-wider border-b-2 border-slate-300 border-dashed pb-1">
            {question.phraseToTranslate}
        </span>
      </div>

      <div className="min-h-[6rem] border-b-2 border-slate-200 mb-4 flex flex-wrap items-center gap-2 p-2">
        {selectedWords.map((word) => (
             <button
                key={word.id}
                onClick={() => handleSelectedWordClick(word)}
                className="p-2 px-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700"
            >
                {word.text}
            </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 min-h-[6rem]">
        {wordBank.map((word) => (
            <button
                key={word.id}
                onClick={() => handleWordBankClick(word)}
                className="p-2 px-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
                {word.text}
            </button>
        ))}
      </div>

      <div className="text-center my-4">
        <p className="text-slate-500 mb-3">{t.orSpeakTheSentence}</p>
        <button
            onClick={handleMicClick}
            disabled={answerStatus !== 'unanswered' || !recognitionRef.current}
            className={`relative flex items-center justify-center w-20 h-20 rounded-full text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mx-auto
            ${speechStatus === 'listening' ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
            aria-label="Speak the sentence"
        >
            <MicrophoneIcon className="w-10 h-10" />
            {speechStatus === 'listening' && (
                 <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
            )}
        </button>
        <div className="h-6 mt-3 text-slate-600 font-semibold">
            {speechStatus === 'listening' && <span>{t.listening}</span>}
            {speechStatus === 'processing' && <span>{t.processing}</span>}
            {speechStatus === 'error' && <span className="text-red-500">{speechError}</span>}
            {speechError && speechStatus !== 'error' && speechStatus !== 'listening' && <span className="text-red-500">{speechError}</span>}
        </div>
    </div>
    </div>
  );
};

export default SentenceConstructionCard;