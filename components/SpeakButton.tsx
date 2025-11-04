import React from 'react';

const SpeakerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06ZM18.584 12.828a.75.75 0 0 0 0-1.656 5.25 5.25 0 0 1 0-8.318.75.75 0 1 0-1.166-.942 6.75 6.75 0 0 0 0 10.201.75.75 0 1 0 1.166-.942Z" />
        <path d="M16.5 12a3 3 0 0 1 0-4.743.75.75 0 0 0-1.154-.954 4.5 4.5 0 0 0 0 6.652.75.75 0 0 0 1.154-.954Z" />
    </svg>
);


interface SpeakButtonProps {
    text: string;
    languageCode: string; // BCP 47 language code, e.g., 'en-US'
}

const SpeakButton: React.FC<SpeakButtonProps> = ({ text, languageCode }) => {
    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = languageCode;
            utterance.rate = 0.9;
            window.speechSynthesis.cancel(); // Cancel any previous speech
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Sorry, your browser doesn't support text-to-speech.");
        }
    };

    return (
        <button
            onClick={handleSpeak}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            aria-label="Listen to the phrase"
        >
            <SpeakerIcon className="w-8 h-8" />
        </button>
    );
};

export default SpeakButton;
