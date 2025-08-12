
export enum RecipeCategory {
  CAFE_DA_MANHA = 'Café da Manhã',
  ALMOCO = 'Almoço',
  JANTAR = 'Jantar',
  LANCHES = 'Lanches',
  DOCES_E_MASSAS = 'Doces & Massas',
}

export interface Recipe {
  id: number;
  nome?: string;
  title?: string;
  categoria?: RecipeCategory;
  category?: string;
  carb?: number;
  carbs?: string;
  calories?: string;
  protein?: string;
  fiber?: string;
  time?: string;
  difficulty?: string;

  prepTime?: string;
  cookTime?: string;
  tags?: string[];
  ingredientes?: string[];
  ingredients?: string[];
  modo_preparo?: string[];
  instructions?: string[];
  substituicoes?: string[];
  porcoes?: string;
  nutritionalInfo?: string;
  description?: string;
  image?: string;
  video?: string;
}

export interface Session {
  loggedIn: boolean;
  email: string | null;
}

export interface Settings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  lastTab: TabID;
}

export interface Bonus {
  title: string;
  image: string;
  content: string;
  isPdf?: boolean;
  recipes?: Recipe[];
}

export type TabID = 'home' | 'recipes' | 'tips' | 'bonuses' | 'support' | 'favorites';

export interface BlockerConfig {
  ativo: boolean;
  mensagem: string;
  whatsapp_comprovante_url: string;
  versao: string;
}

export interface LockFlag {
    blocked: boolean;
    firstBlockedAt?: string;
}

export interface AppContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  recipes: Recipe[];
  isLoadingRecipes: boolean;
  logout: () => void;
  session: Session;
  userName: string | null;
  setUserName: (name: string) => void;
  favorites: Recipe[];
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
}
