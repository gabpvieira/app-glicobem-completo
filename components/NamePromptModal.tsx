
import React, { useState } from 'react';

interface NamePromptModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const NamePromptModal: React.FC<NamePromptModalProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Bem-vindo(a) ao GlicoBem!</h2>
        <p className="text-gray-600 mt-2 mb-6">Para começar, como podemos te chamar?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu primeiro nome"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            autoFocus
            required
          />
          <button
            type="submit"
            className="w-full mt-4 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NamePromptModal;
