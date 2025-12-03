import React from 'react';
import { TransformStyle } from '../types';

interface Props {
  styleData: TransformStyle;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const StyleCard: React.FC<Props> = ({ styleData, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(styleData.id)}
      className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${isSelected ? 'ring-4 ring-orange-500 scale-105 shadow-xl' : 'hover:shadow-lg border border-slate-200'}`}
    >
      <div className="aspect-[3/4] bg-slate-200">
        <img 
          src={styleData.thumbnail} 
          alt={styleData.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
        <span className="text-white font-bold text-sm">{styleData.name}</span>
        <span className="text-orange-300 text-[10px] uppercase tracking-wider">{styleData.category}</span>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
      )}
    </div>
  );
};

export default StyleCard;
