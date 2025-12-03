import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-12" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12 bg-[#E29C52] rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-md">
        {/* Shark Fin Representation */}
        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
           {/* Fin */}
           <path 
             d="M30 80 Q 35 20 80 10 Q 70 50 80 80 Z" 
             fill="#6D28D9" 
           />
           {/* Waves */}
           <path 
             d="M10 80 Q 20 70 30 80 T 50 80 T 70 80 T 90 80 V 90 H 10 Z" 
             fill="#6D28D9" 
           />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-[#3a0ca3] font-bold text-2xl font-[cursive] leading-none">HemoStyle</span>
        <span className="text-xs text-orange-600 font-semibold tracking-wider">Hemontu Inco.</span>
      </div>
    </div>
  );
};

export default Logo;
