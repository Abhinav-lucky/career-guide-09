import { Job } from '@/types/career';

// Local Storage Keys
const FAVORITES_KEY = 'careerguide_favorites';
const RECENTLY_VIEWED_KEY = 'careerguide_recently_viewed';
const SEARCH_HISTORY_KEY = 'careerguide_search_history';
const COMPARE_LIST_KEY = 'careerguide_compare_list';
const VIEW_COUNT_KEY = 'careerguide_view_count';
const THEME_KEY = 'careerguide_theme';

// Favorites
export const getFavorites = (): string[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (jobId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(jobId)) {
    favorites.push(jobId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (jobId: string): void => {
  const favorites = getFavorites().filter(id => id !== jobId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

export const isFavorite = (jobId: string): boolean => {
  return getFavorites().includes(jobId);
};

// Recently Viewed
export const getRecentlyViewed = (): string[] => {
  const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addRecentlyViewed = (jobId: string): void => {
  let recentlyViewed = getRecentlyViewed();
  // Remove if already exists
  recentlyViewed = recentlyViewed.filter(id => id !== jobId);
  // Add to beginning
  recentlyViewed.unshift(jobId);
  // Keep only last 10
  recentlyViewed = recentlyViewed.slice(0, 10);
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
};

// Search History
export const getSearchHistory = (): string[] => {
  const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addSearchHistory = (query: string): void => {
  if (!query.trim()) return;
  let history = getSearchHistory();
  // Remove if already exists
  history = history.filter(q => q.toLowerCase() !== query.toLowerCase());
  // Add to beginning
  history.unshift(query);
  // Keep only last 10
  history = history.slice(0, 10);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
};

export const clearSearchHistory = (): void => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

// Compare List
export const getCompareList = (): string[] => {
  const stored = localStorage.getItem(COMPARE_LIST_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addToCompare = (jobId: string): boolean => {
  const compareList = getCompareList();
  if (compareList.length >= 3) {
    return false; // Max 3 jobs
  }
  if (!compareList.includes(jobId)) {
    compareList.push(jobId);
    localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(compareList));
  }
  return true;
};

export const removeFromCompare = (jobId: string): void => {
  const compareList = getCompareList().filter(id => id !== jobId);
  localStorage.setItem(COMPARE_LIST_KEY, JSON.stringify(compareList));
};

export const clearCompareList = (): void => {
  localStorage.removeItem(COMPARE_LIST_KEY);
};

export const isInCompareList = (jobId: string): boolean => {
  return getCompareList().includes(jobId);
};

// View Count (for sorting by most viewed)
export const incrementViewCount = (jobId: string): void => {
  const stored = localStorage.getItem(VIEW_COUNT_KEY);
  const counts: Record<string, number> = stored ? JSON.parse(stored) : {};
  counts[jobId] = (counts[jobId] || 0) + 1;
  localStorage.setItem(VIEW_COUNT_KEY, JSON.stringify(counts));
};

export const getViewCount = (jobId: string): number => {
  const stored = localStorage.getItem(VIEW_COUNT_KEY);
  const counts: Record<string, number> = stored ? JSON.parse(stored) : {};
  return counts[jobId] || 0;
};

export const getAllViewCounts = (): Record<string, number> => {
  const stored = localStorage.getItem(VIEW_COUNT_KEY);
  return stored ? JSON.parse(stored) : {};
};

// Theme
export const getTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem(THEME_KEY);
  return (stored as 'light' | 'dark') || 'dark';
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};
