import React from 'react';

const HeartIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.27-1.247C8.734 18.232 4.5 14.062 4.5 9.75c0-2.828 2.232-5.062 5.062-5.062 1.258 0 2.457.464 3.393 1.253a4.5 4.5 0 0 1 3.393-1.253c2.828 0 5.062 2.234 5.062 5.062 0 4.312-4.234 8.482-6.814 10.048-.426.262-.84.504-1.27.734-.01.004-.02.008-.022.012l-.007.003-.001.001a.752.752 0 0 1-.704 0l-.001-.001Z" />
    </svg>
);

export default HeartIcon;
