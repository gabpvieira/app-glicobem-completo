
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  onAddToPlanner: (recipeId: number) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewDetails, onAddToPlanner }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">{recipe.categoria}</p>
            <div className="text-right">
                <p className="text-xl font-bold text-gray-800">{recipe.carb}g</p>
                <p className="text-xs text-gray-500">Carbs</p>
            </div>
        </div>
        <h3 className="mt-2 text-lg leading-tight font-semibold text-gray-900">{recipe.nome}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">{tag}</span>
            ))}
        </div>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => onViewDetails(recipe)}
            className="flex-1 px-4 py-2 text-sm font-semibold text-emerald-600 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => onAddToPlanner(recipe.id)}
            className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
