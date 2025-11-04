import React from 'react';

const MicrophoneIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1.75a3.25 3.25 0 0 0-3.25 3.25v7a3.25 3.25 0 0 0 6.5 0v-7A3.25 3.25 0 0 0 12 1.75Z" />
      <path d="M18.25 12a.75.75 0 0 1-.75.75c0 2.893-2.358 5.25-5.25 5.25S7 15.643 7 12.75a.75.75 0 0 1-1.5 0c0 3.513 2.64 6.432 6 6.92V22.25a.75.75 0 0 1-1.5 0V20a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-1.42c3.36-.488 6-3.407 6-6.92a.75.75 0 0 1-.75-.75Z" />
    </svg>
);

export default MicrophoneIcon;