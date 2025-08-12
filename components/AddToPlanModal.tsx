import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { XIcon, CalendarIcon } from './Icons';

interface AddToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string) => void;
  recipe: Recipe | null;
}

const AddToPlanModal: React.FC<AddToPlanModalProps> = ({ isOpen, onClose, onConfirm, recipe }) => {
  if (!isOpen || !recipe) return null;

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate);
    }
  };
  
  // Reset date when modal opens for a new recipe
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(getTodayString());
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Agendar Receita</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
            <p className="text-gray-600">Selecione a data para adicionar <strong className="text-emerald-600">{recipe.nome}</strong> ao seu plano.</p>
            <div>
                <label htmlFor="plan-date" className="text-sm font-medium text-gray-700">Data</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="plan-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>
            </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
             <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Cancelar
            </button>
            <button
                onClick={handleConfirm}
                className="flex-1 bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
            >
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPlanModal;
