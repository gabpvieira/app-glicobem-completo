
import React, { useState } from 'react';
import { Bonus, Recipe } from '../types';
import { XIcon, WarningIcon } from './Icons';

interface BonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bonus: Bonus | null;
  onSelectRecipe: (recipe: Recipe) => void;
}

const BonusModal: React.FC<BonusModalProps> = ({ isOpen, onClose, bonus, onSelectRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!isOpen || !bonus || !bonus.recipes) return null;

  const filteredRecipes = bonus.recipes.filter(recipe => {
    const matchesSearch = recipe.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || recipe.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'sem açúcar', 'low carb', 'fit', 'diet'];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-50 animate-fade-in flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 flex-shrink-0 z-10">
        <div className="px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation"
                aria-label="Voltar"
              >
                <XIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold premium-text-gradient truncate">{bonus.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600">{bonus.recipes.length} receitas disponíveis</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold">
                🎁 GRÁTIS
              </span>
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-1"><WarningIcon className="w-4 h-4" /> EXCLUSIVO</div>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 flex-shrink-0 z-10">
        <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar receitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base touch-manipulation"
                />
                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm sm:text-base">🔍</span>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all touch-manipulation ${
                    selectedCategory === category
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 active:bg-emerald-100'
                  }`}
                >
                  {category === 'all' ? 'Todas' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 overscroll-behavior-contain">
        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Nenhuma receita encontrada</h3>
              <p className="text-sm sm:text-base text-gray-300">Tente ajustar os filtros ou termo de busca</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id}
                  onClick={() => onSelectRecipe(recipe)}
                  className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] touch-manipulation"
                >
                  <div className="flex flex-col">
                    {/* Image */}
                    <div className="w-full h-48 sm:h-56 lg:h-64 overflow-hidden relative">
                      <img 
                        src={recipe.image} 
                        alt={recipe.nome} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {recipe.video && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold">
                          📹 VÍDEO
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col">
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                            {recipe.nome}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {recipe.tags?.map((tag, tagIndex) => (
                              <span 
                                key={tagIndex}
                                className="bg-emerald-100 text-emerald-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4">
                            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-600">{recipe.porcoes}</div>
                              <div className="text-xs text-gray-600">Porções</div>
                            </div>
                            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-600">{recipe.carb}g</div>
                              <div className="text-xs text-gray-600">Carboidratos</div>
                            </div>
                            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-600">{recipe.ingredientes?.length || 0}</div>
                              <div className="text-xs text-gray-600">Ingredientes</div>
                            </div>
                            <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm sm:text-base lg:text-lg font-bold text-emerald-600">{recipe.modo_preparo?.length || 0}</div>
                              <div className="text-xs text-gray-600">Passos</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action */}
                        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                          <span className="text-sm sm:text-base text-emerald-600 font-medium">Toque para ver a receita completa</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-emerald-500 group-hover:translate-x-1 transition-transform duration-300 text-lg sm:text-xl">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusModal;
