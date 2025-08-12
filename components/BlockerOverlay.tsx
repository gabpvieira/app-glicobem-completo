
import React, { useState } from 'react';
import { BlockerConfig } from '../types';
import { LockIcon } from './Icons';

interface BlockerOverlayProps {
  config: BlockerConfig;
}

const PIX_KEY = '60.992.836/0001-41';

const BlockerOverlay: React.FC<BlockerOverlayProps> = ({ config }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleCopyPix = () => {
    navigator.clipboard.writeText(PIX_KEY).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
      console.error('Failed to copy PIX key: ', err);
      alert('Não foi possível copiar a chave PIX. Por favor, copie manualmente.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex justify-center items-start sm:items-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-4 sm:m-4 text-center p-6 sm:p-8 min-h-fit">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <LockIcon className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-red-600">Acesso Bloqueado</h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg">
          {config.mensagem}
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mt-6 text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Nome:</span>
            <span className="text-sm font-semibold text-gray-800">Nicole Neves Garroso</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Banco:</span>
            <span className="text-sm font-semibold text-gray-800">Cora SCFI</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Chave PIX:</span>
            <span className="text-sm font-semibold text-gray-800 truncate">{PIX_KEY}</span>
          </div>
        </div>

        <button
          onClick={handleCopyPix}
          className={`w-full mt-4 py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold transition duration-200 ${
            copyStatus === 'copied' 
              ? 'bg-green-600 text-white' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {copyStatus === 'copied' ? 'Chave PIX Copiada!' : 'Copiar Chave PIX'}
        </button>

        <a
          href={config.whatsapp_comprovante_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-3 py-3 px-4 rounded-lg font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition duration-200"
        >
          Enviar Comprovante no WhatsApp
        </a>

        <p className="mt-4 text-sm text-gray-500">
          <a href="#" className="underline" onClick={(e) => e.preventDefault()}>Já enviei o comprovante</a>
        </p>
      </div>
    </div>
  );
};

export default BlockerOverlay;
