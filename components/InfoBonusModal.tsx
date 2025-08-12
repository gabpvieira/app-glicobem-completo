
import React from 'react';
import { Bonus } from '../types';
import { XIcon } from './Icons';

interface InfoBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonus: Bonus | null;
}

const InfoBonusModal: React.FC<InfoBonusModalProps> = ({ isOpen, onClose, bonus }) => {
  if (!isOpen || !bonus) return null;

  const isPdf = bonus.isPdf && typeof bonus.content === 'string';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{bonus.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        {isPdf ? (
          <div className="flex-grow w-full h-full">
            <iframe
              src={bonus.content}
              className="w-full h-full border-0"
              title={bonus.title}
              allow="autoplay"
            ></iframe>
          </div>
        ) : (
          <div className="p-6 sm:p-8 overflow-y-auto">
            <p className="text-gray-700">{bonus.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBonusModal;
