import React from 'react';
import { Recipe } from '../types';
import { XIcon } from './Icons';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="relative flex-shrink-0 p-6 pb-0">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <span className="text-sm font-semibold text-emerald-600 uppercase">{recipe.categoria || recipe.category}</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{recipe.nome || recipe.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                  aria-label="Fechar"
                >
                  <XIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
        
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {recipe.description && (
                <p className="text-gray-600 mb-4">{recipe.description}</p>
            )}
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-b border-gray-200 py-4">
                {(recipe.carb || recipe.carbs) && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.carb || recipe.carbs}</p>
                        <p className="text-xs text-gray-500">Carboidratos</p>
                    </div>
                )}
                {recipe.calories && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.calories}</p>
                        <p className="text-xs text-gray-500">Calorias</p>
                    </div>
                )}
                {recipe.protein && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.protein}</p>
                        <p className="text-xs text-gray-500">Proteínas</p>
                    </div>
                )}
                {recipe.fiber && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.fiber}</p>
                        <p className="text-xs text-gray-500">Fibras</p>
                    </div>
                )}
                {recipe.porcoes && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.porcoes}</p>
                        <p className="text-xs text-gray-500">Porções</p>
                    </div>
                )}
                {(recipe.time || recipe.prepTime) && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.time || recipe.prepTime}</p>
                        <p className="text-xs text-gray-500">Tempo</p>
                    </div>
                )}
                {recipe.difficulty && (
                    <div>
                        <p className="text-xl font-bold text-gray-800">{recipe.difficulty}</p>
                        <p className="text-xs text-gray-500">Dificuldade</p>
                    </div>
                )}

            </div>
            
            {recipe.tags && recipe.tags.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {recipe.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-700 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ingredientes</h3>
                <ul className="space-y-2">
                    {(recipe.ingredientes || recipe.ingredients)?.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-emerald-500 mr-2">•</span>
                            <span className="text-gray-700">{ingredient}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Modo de Preparo</h3>
                <ol className="space-y-3">
                    {(recipe.modo_preparo || recipe.instructions)?.map((step, index) => (
                        <li key={index} className="flex items-start">
                            <span className="bg-emerald-500 text-white text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                        </li>
                    ))}
                </ol>
            </div>

            {recipe.video && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Assista ao Vídeo</h3>
                    <div className="relative mt-2 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={recipe.video}
                            title={`Vídeo da receita: ${recipe.nome || recipe.title}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
            
            {recipe.substituicoes && recipe.substituicoes.length > 0 && (
                <div className="mt-6 bg-emerald-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-3">Substituições Seguras</h3>
                    <ul className="space-y-2">
                        {recipe.substituicoes.map((item, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-emerald-600 mr-2">•</span>
                                <span className="text-emerald-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {recipe.nutritionalInfo && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">Informações Nutricionais</h3>
                    <p className="text-blue-700">{recipe.nutritionalInfo}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;