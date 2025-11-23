import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFavorites, addFavorite, removeFavorite, getCompareList, addToCompare, removeFromCompare, clearCompareList } from '@/utils/storage';

interface ThemeColor {
  name: string;
  value: string;
}

export const themeColors: ThemeColor[] = [
  { name: 'red', value: '0 100% 60%' },
  { name: 'blue', value: '221 83% 53%' },
  { name: 'green', value: '142 76% 36%' },
  { name: 'purple', value: '262 83% 58%' },
  { name: 'teal', value: '173 58% 39%' },
  { name: 'orange', value: '24 95% 53%' },
];

interface AppContextType {
  favorites: string[];
  compareList: string[];
  themeColor: string;
  toggleFavorite: (jobId: string) => void;
  isFavorite: (jobId: string) => boolean;
  toggleCompare: (jobId: string) => void;
  isInCompare: (jobId: string) => boolean;
  clearCompareList: () => void;
  setThemeColor: (color: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [themeColor, setThemeColorState] = useState<string>(
    localStorage.getItem('themeColor') || themeColors[0].value
  );

  useEffect(() => {
    setFavorites(getFavorites());
    setCompareList(getCompareList());
  }, []);

  // Apply theme color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', themeColor);
    document.documentElement.style.setProperty('--accent', themeColor);
    document.documentElement.style.setProperty('--ring', themeColor);
  }, [themeColor]);

  const toggleFavorite = (jobId: string) => {
    if (favorites.includes(jobId)) {
      removeFavorite(jobId);
      setFavorites(getFavorites());
    } else {
      addFavorite(jobId);
      setFavorites(getFavorites());
    }
  };

  const isFavorite = (jobId: string) => favorites.includes(jobId);

  const toggleCompare = (jobId: string) => {
    if (compareList.includes(jobId)) {
      removeFromCompare(jobId);
    } else if (compareList.length < 3) {
      addToCompare(jobId);
    }
    setCompareList(getCompareList());
  };

  const isInCompare = (jobId: string) => compareList.includes(jobId);

  const clearCompareListFunc = () => {
    clearCompareList();
    setCompareList([]);
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        compareList,
        themeColor,
        toggleFavorite,
        isFavorite,
        toggleCompare,
        isInCompare,
        clearCompareList: clearCompareListFunc,
        setThemeColor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
