
import React, { useState, useEffect, useCallback, createContext } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NamePromptModal from './components/NamePromptModal';
import BlockerOverlay from './components/BlockerOverlay';
import { generateInitialRecipes } from './services/geminiService';
import { getFingerprint } from './services/fingerprintService';
import { Session, Settings, Recipe, AppContextType, BlockerConfig, LockFlag } from './types';

export const AppContext = createContext<AppContextType | null>(null);

const LoadingScreen: React.FC = () => {
  const [message, setMessage] = useState("Carregando conteúdo...");
  
  useEffect(() => {
    const messages = [
      "Carregando conteúdo...",
      "Receitas atualizadas hoje...",
      "Montando seu plano...",
      "Quase lá!",
    ];
    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % messages.length;
      setMessage(messages[index]);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-100 flex flex-col justify-center items-center z-[100]">
      <div className="w-16 h-16 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600 mt-6 font-medium">{message}</p>
    </div>
  );
};


const App: React.FC = () => {
  const [session, setSession] = useLocalStorage<Session>('gb_session', { loggedIn: false, email: null });
  const [settings, setSettings] = useLocalStorage<Settings>('gb_settings', { theme: 'light', fontSize: 'medium', lastTab: 'home' });
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('gb_recipes_cache', []);
  const [userName, setUserName] = useLocalStorage<string | null>('gb_user_name', null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('gb_favorites', []);
  
  const [lockFlag, setLockFlag] = useLocalStorage<LockFlag>('gb_lock_flag', { blocked: false });
  const [fingerprint, setFingerprint] = useLocalStorage<string | null>('gb_lock_fp', null);

  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isNamePromptVisible, setIsNamePromptVisible] = useState(false);
  
  const [blockerConfig, setBlockerConfig] = useState<BlockerConfig | null>(null);
  const [showBlockerOverlay, setShowBlockerOverlay] = useState(false);


  const fetchInitialData = useCallback(async () => {
    if (recipes.length === 0) {
      setIsLoadingRecipes(true);
      try {
        const initialRecipes = await generateInitialRecipes();
        setRecipes(initialRecipes);
      } catch (error) {
        console.error("Failed to fetch initial recipes:", error);
      } finally {
        setIsLoadingRecipes(false);
      }
    }
  }, [recipes, setRecipes]);

  useEffect(() => {
    if (session.loggedIn && !isInitialized) {
      fetchInitialData();
      setIsInitialized(true);
      if (!userName) {
        setIsNamePromptVisible(true);
      }
    }
  }, [session.loggedIn, isInitialized, fetchInitialData, userName]);

  useEffect(() => {
    if (!session.loggedIn) return;

    const checkAccessControl = async () => {
        try {
            const cacheBust = `?v=${new Date().getTime()}`;
            const configRes = await fetch(`/config/bloqueio-acesso.json${cacheBust}`);
            if (!configRes.ok) throw new Error("Could not fetch access config");
            const config: BlockerConfig = await configRes.json();
            setBlockerConfig(config);

            if (!config.ativo) {
                if (lockFlag.blocked) setLockFlag({ blocked: false });
                return;
            }

            let fp = fingerprint;
            if (!fp) {
                fp = await getFingerprint();
                setFingerprint(fp);
            }

            const whitelistRes = await fetch(`/config/whitelist.json${cacheBust}`);
            if (!whitelistRes.ok) throw new Error("Could not fetch whitelist");
            const whitelist: string[] = await whitelistRes.json();
            
            if (whitelist.includes(fp)) {
                return; // User is whitelisted, do nothing.
            }

            if (lockFlag.blocked) {
                setShowBlockerOverlay(true);
            } else {
                const timer = setTimeout(() => {
                    setShowBlockerOverlay(true);
                    setLockFlag({ blocked: true, firstBlockedAt: new Date().toISOString() });
                }, 35000); // 35 seconds
                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error("Error during access control check:", error);
            // Fail open: If config fails, don't block the user.
        }
    };
    checkAccessControl();
  }, [session.loggedIn, lockFlag.blocked]);


  const handleLogin = (email: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setSession({ loggedIn: true, email });
      setIsLoggingIn(false);
    }, 4000);
  };

  const handleLogout = () => {
    setSession({ loggedIn: false, email: null });
    setUserName(null);
    setIsInitialized(false);
    // Optional: Clear lock flag on logout if desired
    // setLockFlag({ blocked: false });
  };

  const handleUpdateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setIsNamePromptVisible(false);
  };

  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  if (!session.loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const addToFavorites = (recipe: Recipe) => {
    if (!favorites.find(fav => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
    }
  };

  const removeFromFavorites = (recipeId: number) => {
    setFavorites(favorites.filter(fav => fav.id !== recipeId));
  };

  const isFavorite = (recipeId: number) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  const contextValue: AppContextType = {
    settings,
    updateSettings: handleUpdateSettings,
    recipes,
    isLoadingRecipes,
    logout: handleLogout,
    session,
    userName,
    setUserName: handleNameSubmit,
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={showBlockerOverlay ? 'blur-sm pointer-events-none' : ''}>
          <Dashboard />
      </div>
      <NamePromptModal
        isOpen={isNamePromptVisible}
        onSubmit={handleNameSubmit}
      />
      {showBlockerOverlay && blockerConfig && <BlockerOverlay config={blockerConfig} />}
    </AppContext.Provider>
  );
};

export default App;
