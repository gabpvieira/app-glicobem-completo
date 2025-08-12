
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { AppContextType, Bonus, Recipe, TabID } from '../types';
import { HomeIcon, BookOpenIcon, StarIcon, SupportIcon, LogoutIcon, ChatBubbleIcon, UtensilsIcon, ClockIcon, ChartBarIcon, SaladIcon, BreadIcon, CoffeeIcon, HeartIcon, HeartFilledIcon, MenuIcon, WalkingIcon, MeditationIcon, WarningIcon, GridIcon, CakeIcon, DessertIcon, ChefHatIcon, SandwichIcon, SoupIcon, RecentIcon } from './Icons';
import { BONUSES } from '../constants';
import { RECIPES, RECIPE_CATEGORIES } from '../data/recipes';
import RecipeModal from './RecipeModal';
import BonusModal from './BonusModal';
import InfoBonusModal from './InfoBonusModal';

// Mapeamento de imagens específicas para cada categoria
const getIconComponent = (iconName: string, className: string = "w-5 h-5", isSelected: boolean = false) => {
  const iconImageMap: { [key: string]: string } = {
    'utensils': '/images/todas-receitas.png', // Ícone específico para "Todas"
    'cake': '/images/bolos.webp',
    'ice-cream': '/images/sobremesa.png',
    'chef-hat': '/images/partos-principais.png',
    'sandwich': '/images/lanches.png',
    'coffee': '/images/bebidas.png',
    'bread-slice': '/images/paes.png',
    'salad': '/images/saladas.png',
    'bowl-hot': '/images/sopas.png'
  };
  
  const imageSrc = iconImageMap[iconName] || '/images/todas-receitas.png';
  
  // Filtro verde para ícones não selecionados, branco para selecionados
  const filterStyle = isSelected 
    ? 'brightness(0) saturate(100%) invert(100%)' // Branco
    : 'brightness(0) saturate(100%) invert(47%) sepia(69%) saturate(959%) hue-rotate(121deg) brightness(98%) contrast(89%)'; // Verde
  
  return (
    <img 
      src={imageSrc} 
      alt={iconName}
      className={`${className} object-contain`}
      style={{
        filter: filterStyle
      }}
    />
  );
};


const Dashboard: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { settings, updateSettings, recipes, isLoadingRecipes, logout, userName, favorites, addToFavorites, removeFromFavorites, isFavorite } = context;
    const [activeTab, setActiveTab] = useState<TabID>(settings.lastTab || 'home');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
    const [selectedInfoBonus, setSelectedInfoBonus] = useState<Bonus | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleTabClick = (tabId: TabID) => {
        setActiveTab(tabId);
        updateSettings({ lastTab: tabId });
    };

    const handleBonusClick = (title: string) => {
        const bonus = BONUSES.find(b => b.title === title);
        if (!bonus) return;

        if (bonus.recipes) {
            setSelectedBonus(bonus);
        } else {
            setSelectedInfoBonus(bonus);
        }
    };
    
    const handleSelectBonusRecipe = (recipe: Recipe) => {
        setSelectedBonus(null); 
        setSelectedRecipe(recipe);
    }

    const FavoritesTab = () => (
        <div className="animate-fade-in scrollable-content safe-bottom-spacing p-4">
            {/* Header */}
            <div className="premium-card rounded-2xl p-8 mb-6 text-center">
                <h2 className="text-3xl font-bold premium-text-gradient mb-3 flex items-center justify-center gap-2">
                    <HeartFilledIcon className="w-8 h-8 text-red-500" />
                    Receitas Favoritas
                </h2>
                <p className="text-gray-600 text-lg">Suas receitas preferidas em um só lugar</p>
            </div>

            {favorites.length === 0 ? (
                <div className="premium-card rounded-2xl p-12 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <HeartIcon className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">Nenhuma receita favorita ainda</h3>
                    <p className="text-gray-500 text-base mb-6 max-w-md mx-auto leading-relaxed">
                        Explore nossas receitas deliciosas e adicione suas preferidas aos favoritos clicando no ícone de coração
                    </p>
                    <button 
                        onClick={() => handleTabClick('recipes')}
                        className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors font-medium inline-flex items-center gap-2"
                    >
                        <UtensilsIcon className="w-5 h-5" />
                        Explorar Receitas
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-100">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg mb-2 leading-tight">{recipe.title}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            {getIconComponent(RECIPE_CATEGORIES.find(cat => cat.id === recipe.category)?.icon || 'utensils', "w-5 h-5")}
                                            <span>{RECIPE_CATEGORIES.find(cat => cat.id === recipe.category)?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {recipe.tags?.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Nutrition Info - Simplified */}
                                <div className="flex justify-between items-center mb-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-gray-600">Calorias</div>
                                        <div className="font-semibold text-gray-900">{recipe.calories}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-600">Carboidratos</div>
                                        <div className="font-semibold text-emerald-600">{recipe.carbs}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-600">Proteínas</div>
                                        <div className="font-semibold text-blue-600">{recipe.protein}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-gray-600">Fibras</div>
                                        <div className="font-semibold text-purple-600">{recipe.fiber}</div>
                                    </div>
                                </div>
                                
                                {/* Time and Difficulty */}
                                <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <ClockIcon className="w-4 h-4 mr-1" />
                                            <span>{recipe.time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <ChartBarIcon className="w-4 h-4 mr-1" />
                                            <span>{recipe.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                             onClick={() => removeFromFavorites(recipe.id)}
                                             className="p-2 rounded-lg transition-colors bg-red-100 text-red-600 hover:bg-red-200"
                                         >
                                             <HeartFilledIcon className="w-5 h-5" />
                                         </button>
                                         <button 
                                             onClick={() => setSelectedRecipe(recipe)}
                                             className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                         >
                                             Ver Receita
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                </div>
            )}
        </div>
    );

    const tabs = {
        home: { icon: HomeIcon, label: 'Início', component: <HomeTab onBonusClick={handleBonusClick} onNavigate={handleTabClick} onRecipeClick={setSelectedRecipe} /> },
        recipes: { icon: BookOpenIcon, label: 'Receitas', component: <RecipesTab onRecipeClick={setSelectedRecipe} /> },
        tips: { icon: SupportIcon, label: 'Dicas', component: <TipsTab /> },
        bonuses: { icon: StarIcon, label: 'Bônus', component: <BonusesTab onBonusClick={handleBonusClick} /> },
        favorites: { icon: HeartIcon, label: 'Favoritos', component: <FavoritesTab /> },
        support: { icon: ChatBubbleIcon, label: 'Suporte', component: <SupportTab /> },
    };

    return (
        <div className="premium-gradient min-h-screen text-gray-800 flex flex-col">
            {/* Mobile Header with Hamburger Menu */}
            <header className="premium-header p-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white/80 hover:text-white transition-colors duration-200"
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <img src="https://i.postimg.cc/6QDtLm02/pnh-white-glicobem.png" alt="GlicoBem" className="h-8" />
                </div>
                <button onClick={context.logout} className="text-white/80 hover:text-white transition-colors duration-200">
                    <LogoutIcon className="w-6 h-6" />
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <img src="https://i.postimg.cc/1XZNwTkM/PNG-GLICOBEM.png" alt="GlicoBem" className="h-8" />
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {Object.entries(tabs).map(([tabId, tab]) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tabId}
                                            onClick={() => {
                                                handleTabClick(tabId as TabID);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                                                activeTab === tabId
                                                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span>{tab.label}</span>
                                            {tabId === 'favorites' && favorites.length > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                    {favorites.length}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500 mb-2">Olá, {userName || 'Usuário'}!</div>
                                <button 
                                    onClick={() => {
                                        context.logout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:block fixed bottom-0 left-0 right-0 z-20">
                <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2">
                    <div className="flex justify-center space-x-1 max-w-md mx-auto">
                        {Object.entries(tabs).map(([tabId, tab]) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tabId}
                                    onClick={() => handleTabClick(tabId as TabID)}
                                    className={`flex flex-col items-center px-3 py-2 rounded-lg transition-colors duration-200 relative ${
                                        activeTab === tabId
                                            ? 'text-emerald-600 bg-emerald-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <IconComponent className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">{tab.label}</span>
                                    {tabId === 'favorites' && favorites.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                                            {favorites.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <main className="flex-grow relative overflow-hidden">
                <div className={`absolute inset-0 overflow-y-auto content-container ${activeTab !== 'recipes' ? 'p-4' : ''} ${activeTab !== 'recipes' ? 'md:pb-20' : 'md:pb-20'}`}>
                    {tabs[activeTab].component}
                </div>
            </main>

            <RecipeModal 
                recipe={selectedRecipe} 
                onClose={() => setSelectedRecipe(null)} 
            />

            <BonusModal 
                isOpen={!!selectedBonus} 
                onClose={() => setSelectedBonus(null)} 
                bonus={selectedBonus}
                onSelectRecipe={handleSelectBonusRecipe}
            />
            
            <InfoBonusModal
                isOpen={!!selectedInfoBonus}
                onClose={() => setSelectedInfoBonus(null)}
                bonus={selectedInfoBonus}
            />


        </div>
    );
};

// Tabs Components
const HomeTab: React.FC<{ onBonusClick: (title: string) => void; onNavigate: (tab: TabID) => void; onRecipeClick?: (recipe: Recipe) => void; }> = ({ onBonusClick, onNavigate, onRecipeClick }) => {
    const context = useContext(AppContext) as AppContextType;
    const { userName, favorites, addToFavorites, removeFromFavorites, isFavorite } = context;
    
    // Get 5 most recent recipes (assuming they are ordered by creation date)
    const recentRecipes = RECIPES.slice(0, 5);

    return (
        <div className="space-y-8 animate-fade-in scrollable-content safe-bottom-spacing">
            {/* Welcome Header */}
            <div className="home-welcome-card text-center">
                <div className="flex items-center justify-center mb-4">
                    <img 
                        src="https://i.ibb.co/Fq8dWY4p/MOCKUP-HEADER.png" 
                        alt="GlicoBem" 
                        className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                    Olá, <span className="capitalize">{userName || 'Usuário'}</span>! 👋
                </h1>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto leading-relaxed">
                    Bem-vindo ao seu cardápio personalizado de receitas saudáveis e livres de açúcar
                </p>
            </div>

            {/* Quick Stats */}
            <div className="home-stats-grid">
                <div className="home-stat-card">
                    <div className="home-stat-number">{RECIPES.length}</div>
                    <div className="home-stat-label">Receitas</div>
                </div>
                <div className="home-stat-card">
                    <div className="home-stat-number">{favorites.length}</div>
                    <div className="home-stat-label">Favoritas</div>
                </div>
                <div className="home-stat-card">
                    <div className="home-stat-number">100%</div>
                    <div className="home-stat-label">Sem Açúcar</div>
                </div>
                <div className="home-stat-card">
                    <div className="home-stat-number">{BONUSES.length}</div>
                    <div className="home-stat-label">Bônus</div>
                </div>
            </div>

            {/* Recent Recipes Section */}
            <div className="home-recent-recipes">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <RecentIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        Receitas Recentes
                    </h2>
                    <button
                        onClick={() => onNavigate('recipes')}
                        className="home-view-all-btn"
                    >
                        Ver Todas
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Recipes List */}
                <div className="home-recipe-list">
                    {recentRecipes.map((recipe) => {
                        const getCategoryIcon = (category: string) => {
                            const iconMap: { [key: string]: string } = {
                                'bolos': '/images/bolos.webp',
                                'sobremesas': '/images/sobremesa.png',
                                'pratos-principais': '/images/partos-principais.png',
                                'lanches': '/images/lanches.png',
                                'bebidas': '/images/bebidas.png',
                                'paes': '/images/paes.png',
                                'saladas': '/images/saladas.png',
                                'sopas': '/images/sopas.png'
                            };
                            return iconMap[category] || '/images/todas-receitas.png';
                        };

                        return (
                            <div
                                key={recipe.id}
                                onClick={() => onRecipeClick?.(recipe)}
                                className="home-recipe-list-item"
                            >
                                <div className="home-recipe-icon">
                                    <img 
                                        src={getCategoryIcon(recipe.category)} 
                                        alt={recipe.category}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div className="home-recipe-info">
                                    <h4 className="home-recipe-list-title">{recipe.title}</h4>
                                    <div className="home-recipe-list-meta">
                                        <ClockIcon className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">{recipe.prepTime}</span>
                                        {recipe.tags?.[0] && (
                                            <span className="home-recipe-list-tag">
                                                {recipe.tags[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isFavorite(recipe.id)) {
                                            removeFromFavorites(recipe.id);
                                        } else {
                                            addToFavorites(recipe);
                                        }
                                    }}
                                    className="home-recipe-favorite-btn"
                                >
                                    <HeartIcon className={`w-5 h-5 transition-colors duration-200 ${
                                        isFavorite(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                                    }`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Cakes Section */}
            <div className="home-premium-card" onClick={() => onBonusClick?.(BONUSES[0].title)}>
                <div className="home-premium-image">
                    <img 
                        src="https://www.receiteria.com.br/wp-content/uploads/bolo-de-flocao-zero-acucar.jpeg" 
                        alt="12 Receitas de Bolos Deliciosos e Seguros"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="home-premium-content">
                    <h3 className="home-premium-title">12 Receitas de Bolos Deliciosos e Seguros</h3>
                    <p className="home-premium-description">
                        Explore nossa coleção exclusiva de bolos feitos especialmente para quem precisa controlar o açúcar, mas não abre mão do sabor.
                    </p>
                    <div className="home-premium-badges">
                        <span className="home-premium-badge premium">ACESSO PREMIUM</span>
                        <span className="home-premium-badge unlocked">LIBERADO</span>
                        <span className="home-premium-badge video">COM VÍDEO AULAS</span>
                    </div>
                    <div className="home-premium-cta">
                        <span>Clique para acessar</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="home-actions-grid">
                <div 
                    onClick={() => onNavigate('bonuses')}
                    className="home-action-card"
                >
                    <div className="home-action-icon">
                        <StarIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="home-action-title">Conteúdos Exclusivos</h3>
                    <p className="home-action-desc">Acesse bônus especiais e receitas premium</p>
                </div>

                <div 
                    onClick={() => onNavigate('tips')}
                    className="home-action-card"
                >
                    <div className="home-action-icon">
                        <SupportIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="home-action-title">Dicas & Cuidados</h3>
                    <p className="home-action-desc">Guias para uma vida mais saudável</p>
                </div>
            </div>
        </div>
    );
};

const RecipesTab: React.FC<{ onRecipeClick?: (recipe: Recipe) => void }> = ({ onRecipeClick }) => {
    const context = useContext(AppContext) as AppContextType;
    const { favorites, addToFavorites, removeFromFavorites, isFavorite } = context;
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    // Removed viewMode state - using only grid view

    const categories = RECIPE_CATEGORIES;

    const recipes = RECIPES;

    const filteredRecipes = recipes.filter(recipe => {
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

    return (
        <div className="animate-fade-in scrollable-content safe-bottom-spacing p-4">
            {/* Header */}
            <div className="premium-card rounded-2xl p-8 mb-6 text-center">
                <div className="flex flex-col items-center justify-center mb-3">
                    <img 
                        src="/images/livro-receitas.png" 
                        alt="Livro de Receitas"
                        className="w-12 h-12 object-contain mb-3"
                        style={{
                            filter: 'brightness(0) saturate(100%) invert(47%) sepia(69%) saturate(959%) hue-rotate(121deg) brightness(98%) contrast(89%)'
                        }}
                    />
                    <h2 className="text-3xl font-bold premium-text-gradient">
                        Cardápio de Receitas GlicoBem
                    </h2>
                </div>
                <p className="text-gray-600 text-lg mb-4">{RECIPES.length} receitas deliciosas e saudáveis para diabéticos</p>
                <div className="flex flex-col justify-center items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5">
                        <span className="text-emerald-600">✅</span>
                        <span>Aprovadas por Nutricionistas</span>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                            <ChartBarIcon className="w-5 h-5" /> 
                            <span>Informações Nutricionais Completas</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters - Mobile Optimized */}
            <div className="premium-section">
                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {/* Search Bar - Mobile Responsive */}
                    <div className="w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar receitas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 sm:p-4 pl-10 sm:pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm text-sm sm:text-base touch-manipulation"
                            />
                            <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base">
                                🔍
                            </div>
                        </div>
                    </div>
                    
                    {/* View Mode - Grid Only - Hidden on Mobile */}
                    <div className="hidden sm:flex justify-center">
                        <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-medium text-sm">
                            ⊞ Visualização em Grade
                        </div>
                    </div>
                </div>
                
                {/* Category Filter - Enhanced Responsive */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 px-1">Categorias</h3>
                    
                    {/* Mobile: Improved 2-Column Grid */}
                    <div className="category-grid grid grid-cols-2 sm:hidden gap-3">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`category-card category-filter-button group relative flex flex-col items-center p-4 rounded-xl transform active:scale-95 transition-all duration-200 touch-manipulation ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 category-selected'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100'
                                }`}
                            >
                                <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                                    {getIconComponent(category.icon, "w-8 h-8", selectedCategory === category.id)}
                                </div>
                                <div className="text-center">
                                    <div className="category-title font-semibold text-sm leading-tight mb-1 line-clamp-2">{category.name}</div>
                                    <div className={`category-count text-xs font-medium ${
                                        selectedCategory === category.id ? 'text-emerald-100' : 'text-gray-500'
                                    }`}>
                                        {category.count}
                                    </div>
                                </div>
                                {selectedCategory === category.id && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                        <span className="text-xs font-bold text-gray-800">✓</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {/* Tablet: 3-Column Grid */}
                    <div className="hidden sm:grid md:hidden grid-cols-3 gap-4">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`category-card category-filter-button group relative flex flex-col items-center p-5 rounded-xl transform hover:scale-105 transition-all duration-300 ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/25 category-selected'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-100'
                                }`}
                            >
                                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                                    {getIconComponent(category.icon, "w-10 h-10", selectedCategory === category.id)}
                                </div>
                                <div className="text-center">
                                    <div className="category-title font-semibold text-base leading-tight mb-1">{category.name}</div>
                                    <div className={`category-count text-sm font-medium ${
                                        selectedCategory === category.id ? 'text-emerald-100' : 'text-gray-500'
                                    }`}>
                                        {category.count} receitas
                                    </div>
                                </div>
                                {selectedCategory === category.id && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                        <span className="text-xs font-bold text-gray-800">✓</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    {/* Desktop: Horizontal Scroll */}
                    <div className="hidden md:flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`category-filter-button group flex items-center space-x-4 px-6 py-4 rounded-2xl whitespace-nowrap transform hover:scale-105 min-w-max ${
                                    selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/25 category-selected'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-100'
                                }`}
                            >
                                <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                    {getIconComponent(category.icon, "w-8 h-8", selectedCategory === category.id)}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-lg">{category.name}</div>
                                    <div className={`text-sm font-medium ${
                                        selectedCategory === category.id ? 'text-emerald-100' : 'text-gray-500'
                                    }`}>
                                        {category.count} receitas
                                    </div>
                                </div>
                                {selectedCategory === category.id && (
                                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center ml-2 animate-bounce">
                                        <span className="text-xs font-bold text-gray-800">✓</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Results Header - Mobile Responsive */}
            {filteredRecipes.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 px-1">
                    <div className="mb-2 sm:mb-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2">
                            {selectedCategoryData?.name || 'Todas as Receitas'}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                            {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            )}
            
            {/* Recipes Display - Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden border border-gray-100">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 leading-tight line-clamp-2">{recipe.title}</h3>
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                                            {getIconComponent(RECIPE_CATEGORIES.find(cat => cat.id === recipe.category)?.icon || 'utensils', "w-4 h-4 sm:w-5 sm:h-5")}
                                            <span className="truncate">{RECIPE_CATEGORIES.find(cat => cat.id === recipe.category)?.name}</span>
                                        </div>
                                    </div>
                                </div>
                            
                                {/* Tags - Mobile Optimized */}
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                                    {recipe.tags.slice(0, 2).map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium truncate max-w-[120px]">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Nutrition Info - Mobile Responsive */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-0 sm:flex sm:justify-between items-center mb-3 sm:mb-4 text-xs sm:text-sm">
                                    <div className="text-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                                        <div className="text-gray-600 text-xs">Calorias</div>
                                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{recipe.calories}</div>
                                    </div>
                                    <div className="text-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                                        <div className="text-gray-600 text-xs">Carboidratos</div>
                                        <div className="font-semibold text-emerald-600 text-sm sm:text-base">{recipe.carbs}</div>
                                    </div>
                                    <div className="text-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                                        <div className="text-gray-600 text-xs">Proteínas</div>
                                        <div className="font-semibold text-blue-600 text-sm sm:text-base">{recipe.protein}</div>
                                    </div>
                                    <div className="text-center bg-gray-50 sm:bg-transparent rounded-lg sm:rounded-none p-2 sm:p-0">
                                        <div className="text-gray-600 text-xs">Fibras</div>
                                        <div className="font-semibold text-purple-600 text-sm sm:text-base">{recipe.fiber}</div>
                                    </div>
                                </div>
                                
                                {/* Time and Difficulty - Mobile Optimized */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm pt-3 sm:pt-4 border-t border-gray-100 space-y-3 sm:space-y-0">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            <span className="text-xs sm:text-sm">{recipe.time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <ChartBarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                            <span className="text-xs sm:text-sm">{recipe.difficulty}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-center sm:justify-end">
                                        <button 
                                            onClick={() => isFavorite(recipe.id) ? removeFromFavorites(recipe.id) : addToFavorites(recipe)}
                                            className={`p-2 sm:p-2 rounded-lg transition-colors touch-manipulation ${isFavorite(recipe.id) ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {isFavorite(recipe.id) ? <HeartFilledIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                                        </button>
                                        <button 
                                            onClick={() => onRecipeClick?.(recipe)}
                                            className="bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-xs sm:text-sm touch-manipulation flex-1 sm:flex-initial min-w-0"
                                        >
                                            <span className="truncate">Ver Receita</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            
            {/* No Results */}
            {filteredRecipes.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-8xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhuma receita encontrada</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Não encontramos receitas que correspondam aos seus critérios de busca. 
                        Tente ajustar os filtros ou termo de busca.
                    </p>
                    <button 
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-colors font-medium"
                    >
                        🔄 Limpar Filtros
                    </button>
                </div>
            )}

            {/* Call to Action */}
            <div className="premium-section">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-200">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4">
                        <UtensilsIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">Receitas Exclusivas</h3>
                    <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
                        Todas as nossas receitas são desenvolvidas por nutricionistas especializados em diabetes, 
                        garantindo sabor e saúde em cada prato.
                    </p>
                    <div className="flex justify-center items-center space-x-6 text-sm text-emerald-700">
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span>Baixo Índice Glicêmico</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span>Informações Nutricionais</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span>Fácil Preparo</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TipsTab: React.FC = () => {
    const [checkedItems, setCheckedItems] = React.useState<{[key: string]: boolean}>({});

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="animate-fade-in scrollable-content safe-bottom-spacing p-4">
            {/* Header */}
            <div className="premium-card rounded-2xl p-8 mb-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold premium-text-gradient mb-3">💡 Guia Completo de Cuidados</h2>
                    <p className="text-gray-600 text-lg">Transforme sua rotina com dicas práticas e cientificamente comprovadas</p>
                </div>
            </div>

            {/* Daily Checklist */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    ✅ Checklist Diário de Cuidados
                </h3>
                <p className="text-gray-600 mb-6">Marque as ações que você já realizou hoje:</p>
                
                <div className="space-y-3">
                    {[
                        { id: 'water', text: 'Bebi pelo menos 8 copos de água' },
                        { id: 'breakfast', text: 'Tomei café da manhã equilibrado' },
                        { id: 'glucose', text: 'Medi minha glicose conforme orientação médica' },
                        { id: 'exercise', text: 'Fiz pelo menos 30 minutos de atividade física' },
                        { id: 'medication', text: 'Tomei meus medicamentos no horário correto' },
                        { id: 'vegetables', text: 'Inclui vegetais em pelo menos 2 refeições' },
                        { id: 'stress', text: 'Pratiquei alguma técnica de relaxamento' },
                        { id: 'sleep', text: 'Dormi pelo menos 7 horas na noite anterior' }
                    ].map(item => (
                        <div key={item.id} className="checklist-item" onClick={() => toggleCheck(item.id)}>
                            <div className={`checklist-checkbox ${checkedItems[item.id] ? 'checked' : ''}`} />
                            <span className={`text-gray-700 ${checkedItems[item.id] ? 'line-through opacity-60' : ''}`}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nutrition Section */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="flex items-center gap-2"><SaladIcon className="w-6 h-6" /> Alimentação Inteligente</div>
                </h3>
                <p className="text-gray-600 mb-6">
                    A alimentação é sua principal ferramenta de controle. Cada escolha importa.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                        <h4 className="font-bold text-emerald-800 mb-3">✅ Alimentos Recomendados</h4>
                        <ul className="space-y-2 text-sm text-emerald-700">
                            <li>• Vegetais não amiláceos (brócolis, espinafre, abobrinha)</li>
                            <li>• Proteínas magras (frango, peixe, ovos, tofu)</li>
                            <li>• Grãos integrais (quinoa, aveia, arroz integral)</li>
                            <li>• Gorduras saudáveis (abacate, nozes, azeite)</li>
                            <li>• Frutas com baixo índice glicêmico (maçã, pera, frutas vermelhas)</li>
                        </ul>
                    </div>
                    
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                        <h4 className="font-bold text-red-800 mb-3">❌ Evitar ou Limitar</h4>
                        <ul className="space-y-2 text-sm text-red-700">
                            <li>• Açúcares refinados e doces convencionais</li>
                            <li>• Refrigerantes e sucos industrializados</li>
                            <li>• Alimentos ultraprocessados</li>
                            <li>• Carboidratos simples (pão branco, massas refinadas)</li>
                            <li>• Frituras e gorduras trans</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><UtensilsIcon className="w-5 h-5" /> Método do Prato Perfeito</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">50%</div>
                            <p className="text-sm font-medium text-blue-800">Vegetais</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">25%</div>
                            <p className="text-sm font-medium text-blue-800">Proteínas</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">25%</div>
                            <p className="text-sm font-medium text-blue-800">Carboidratos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exercise Section */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="flex items-center gap-2"><WalkingIcon className="w-6 h-6" /> Atividade Física Estratégica</div>
                </h3>
                <p className="text-gray-600 mb-6">
                    O exercício é um medicamento natural que melhora a sensibilidade à insulina.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6">
                        <div className="mb-3"><WalkingIcon className="w-12 h-12 text-blue-500" /></div>
                        <h4 className="font-bold text-purple-800 mb-2">Aeróbico</h4>
                        <p className="text-sm text-purple-700">150 min/semana de atividade moderada. Caminhada rápida, natação, ciclismo.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6">
                        <div className="mb-3"><WalkingIcon className="w-12 h-12 text-green-500" /></div>
                        <h4 className="font-bold text-orange-800 mb-2">Força</h4>
                        <p className="text-sm text-orange-700">2-3x/semana. Musculação, exercícios com peso corporal, faixas elásticas.</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6">
                        <div className="mb-3"><MeditationIcon className="w-12 h-12 text-purple-500" /></div>
                        <h4 className="font-bold text-green-800 mb-2">Flexibilidade</h4>
                        <p className="text-sm text-green-700">Yoga, alongamento, tai chi. Reduz estresse e melhora mobilidade.</p>
                    </div>
                </div>
            </div>

            {/* Monitoring Section */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="flex items-center gap-2"><ChartBarIcon className="w-6 h-6" /> Monitoramento Inteligente</div>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3">🩸 Glicemia</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li>• <strong>Jejum:</strong> 70-100 mg/dL</li>
                            <li>• <strong>Pós-refeição (2h):</strong> &lt; 140 mg/dL</li>
                            <li>• <strong>Hemoglobina glicada:</strong> &lt; 7%</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-3">💓 Outros Indicadores</h4>
                        <ul className="space-y-2 text-gray-700">
                            <li>• <strong>Pressão arterial:</strong> &lt; 130/80 mmHg</li>
                            <li>• <strong>Peso:</strong> IMC entre 18,5-24,9</li>
                            <li>• <strong>Colesterol LDL:</strong> &lt; 100 mg/dL</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Emergency Section */}
            <div className="premium-section bg-red-50 border-red-200">
                <h3 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                    🚨 Sinais de Alerta
                </h3>
                <p className="text-red-700 mb-4 font-medium">
                    Procure ajuda médica imediatamente se apresentar:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-bold text-red-800 mb-2">Hipoglicemia (&lt; 70 mg/dL)</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• Tremores, suor frio</li>
                            <li>• Confusão mental</li>
                            <li>• Fome excessiva</li>
                            <li>• Palpitações</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 mb-2">Hiperglicemia (&gt; 250 mg/dL)</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li>• Sede excessiva</li>
                            <li>• Urinar frequentemente</li>
                            <li>• Visão embaçada</li>
                            <li>• Fadiga extrema</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Motivation Section */}
            <div className="premium-section bg-gradient-to-r from-emerald-50 to-blue-50">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <div className="flex items-center gap-2"><WalkingIcon className="w-6 h-6" /> Sua Jornada de Sucesso</div>
                </h3>
                <p className="text-gray-700 mb-4">
                    Lembre-se: cada pequena mudança positiva é uma vitória. O diabetes pode ser controlado com dedicação e conhecimento.
                </p>
                <div className="bg-white rounded-xl p-4 border border-emerald-200">
                    <p className="text-emerald-800 font-medium text-center italic">
                        "O sucesso é a soma de pequenos esforços repetidos dia após dia." 🌟
                    </p>
                </div>
            </div>
        </div>
    );
};


const BonusesTab: React.FC<{ onBonusClick: (title: string) => void }> = ({ onBonusClick }) => {
    return (
        <div className="animate-fade-in scrollable-content safe-bottom-spacing">
            {/* Header */}
            <div className="premium-card rounded-2xl p-8 mb-6 text-center">
                <h2 className="text-3xl font-bold premium-text-gradient mb-3">🎁 Bônus Exclusivos Premium</h2>
                <p className="text-gray-600 text-lg">Conteúdos especiais para acelerar sua jornada de saúde</p>
                <div className="mt-4 inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                    ✨ Acesso Vitalício Garantido
                </div>
            </div>

            {/* Bonuses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BONUSES.map((bonus, index) => (
                    <div 
                        key={index} 
                        onClick={() => onBonusClick(bonus.title)}
                        className="premium-card rounded-2xl overflow-hidden cursor-pointer group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
                    >
                        <div className="aspect-video w-full overflow-hidden relative">
                            <img src={bonus.image} alt={bonus.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                PREMIUM
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-bold text-xl text-gray-800 group-hover:text-emerald-600 transition-colors mb-3">{bonus.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {bonus.isPdf ? 'Abra o guia completo em PDF com conteúdo exclusivo e detalhado.' : bonus.content}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-emerald-600 font-medium text-sm">Clique para acessar</span>
                                <div className="text-emerald-500 group-hover:translate-x-1 transition-transform duration-300">
                                    →
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

const SupportTab: React.FC = () => {
    return (
        <div className="animate-fade-in scrollable-content safe-bottom-spacing p-4">
            {/* Header */}
            <div className="premium-card rounded-2xl p-8 mb-6 text-center">
                <h2 className="text-3xl font-bold premium-text-gradient mb-3">🆘 Central de Suporte Premium</h2>
                <p className="text-gray-600 text-lg">Estamos aqui para ajudar você em cada passo da sua jornada</p>
                <div className="mt-4 inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
                    ⚡ Suporte 24/7 Disponível
                </div>
            </div>

            {/* Suporte WhatsApp */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">💬 Canal de Suporte</h3>
                <div className="flex justify-center">
                    <a 
                        href="https://wa.me/558499389121" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="premium-card text-center p-8 hover:shadow-xl transition-all duration-300 group max-w-sm"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.097"/>
                            </svg>
                        </div>
                        <h4 className="font-bold text-gray-800 mb-3 text-xl">WhatsApp</h4>
                        <p className="text-gray-600 mb-4">Nosso único canal de suporte oficial</p>
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                            Disponível 24/7
                        </div>
                    </a>
                </div>
            </div>





            {/* FAQ */}
            <div className="premium-section">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">❓ Perguntas Frequentes</h3>
                <div className="space-y-4">
                    {[
                        {
                            question: "Como acessar todas as receitas?",
                            answer: "Navegue até a aba 'Receitas' no menu inferior. Lá você encontrará mais de 130 receitas organizadas por categorias, todas com informações nutricionais detalhadas."
                        },
                        {
                            question: "Posso usar o app offline?",
                            answer: "Sim! Após fazer o primeiro acesso, muitas funcionalidades ficam disponíveis offline. As receitas e dicas podem ser acessadas mesmo sem internet."
                        },
                        {
                            question: "Como imprimir as receitas?",
                            answer: "Cada receita tem um botão 'Imprimir' que gera uma versão otimizada para impressão. Você também pode salvar como PDF no seu dispositivo."
                        },
                        {
                            question: "O app substitui o acompanhamento médico?",
                            answer: "Não! O GlicoBem é um complemento ao seu tratamento médico. Sempre consulte seu médico antes de fazer mudanças na dieta ou medicação."
                        },
                        {
                            question: "Como funciona a garantia?",
                            answer: "Oferecemos garantia de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu investimento, sem perguntas ou burocracias."
                        }
                    ].map((faq, index) => (
                        <div key={index} className="premium-card">
                            <h4 className="font-bold text-gray-800 mb-3 flex items-start">
                                <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5 flex-shrink-0">?</span>
                                {faq.question}
                            </h4>
                            <p className="text-gray-600 ml-9 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>



            {/* Important Notice */}
            <div className="premium-section">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
                    <div className="flex items-start">
                        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4 flex-shrink-0">
                            <WarningIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-amber-800 mb-3">Aviso Médico Importante</h3>
                            <p className="text-amber-700 leading-relaxed">
                                Este aplicativo é uma ferramenta de apoio educacional e não substitui o acompanhamento médico profissional. 
                                Sempre consulte seu médico, nutricionista ou endocrinologista antes de fazer mudanças significativas 
                                em sua dieta, medicação ou rotina de exercícios. Em caso de emergência médica, procure atendimento 
                                médico imediatamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* App Installation Tip */}
            <div className="premium-section">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                    <div className="flex items-start">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4 flex-shrink-0">
                            📱
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-blue-800 mb-3">💡 Dica Premium</h3>
                            <p className="text-blue-700 leading-relaxed mb-3">
                                Adicione o GlicoBem à sua tela inicial para um acesso mais rápido, como se fosse um aplicativo nativo!
                            </p>
                            <p className="text-sm text-blue-600">
                                No seu navegador, procure pela opção "Adicionar à Tela de Início" ou "Instalar Aplicativo".
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="premium-section">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-200">
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4">
                        ✅
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">Garantia de Satisfação</h3>
                    <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
                        Estamos tão confiantes na qualidade do nosso conteúdo que oferecemos garantia incondicional de 30 dias. 
                        Se não ficar completamente satisfeito, devolvemos 100% do seu investimento.
                    </p>
                    <a 
                        href="https://wa.me/558499389121" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all transform hover:scale-105 inline-block"
                    >
                        💬 Falar com Suporte Agora
                    </a>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
