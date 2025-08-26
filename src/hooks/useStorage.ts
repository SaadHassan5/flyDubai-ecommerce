import { useState, useCallback, useEffect } from 'react';
import { storageService } from '../services/storage';
import { useApp } from '../store';

// Hook for favorites management with storage integration
export function useFavoritesStorage() {
  const { state, actions } = useApp();
  const { favorites, isLoading, error } = state;

  const toggleFavorite = useCallback(async (productId: string) => {
    try {
      await actions.toggleFavorite(productId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle favorite';
      console.error('useFavoritesStorage: Toggle favorite error:', err);
      return false;
    }
  }, [actions]);

  const addToFavorites = useCallback(async (productId: string) => {
    try {
      if (!favorites.includes(productId)) {
        await actions.toggleFavorite(productId);
        return true;
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to favorites';
      console.error('useFavoritesStorage: Add to favorites error:', err);
      return false;
    }
  }, [favorites, actions]);

  const removeFromFavorites = useCallback(async (productId: string) => {
    try {
      if (favorites.includes(productId)) {
        await actions.toggleFavorite(productId);
        return true;
      }
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from favorites';
      console.error('useFavoritesStorage: Remove from favorites error:', err);
      return false;
    }
  }, [favorites, actions]);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearFavorites = useCallback(async () => {
    try {
      // This would need to be implemented in the store actions
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear favorites';
      console.error('useFavoritesStorage: Clear favorites error:', err);
      return false;
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    actions.loadFavorites();
  }, [actions]);

  return {
    favorites,
    isLoading,
    error,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };
}

// Hook for search history
export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load search history on mount
  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await storageService.getSearchHistory();
      setSearchHistory(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load search history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToSearchHistory = useCallback(async (query: string) => {
    try {
      setError(null);
      const success = await storageService.addToSearchHistory(query);
      if (success) {
        await loadSearchHistory(); // Reload to get updated history
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to search history';
      setError(errorMessage);
      return false;
    }
  }, [loadSearchHistory]);

  const clearSearchHistory = useCallback(async () => {
    try {
      setError(null);
      const success = await storageService.clearSearchHistory();
      if (success) {
        setSearchHistory([]);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear search history';
      setError(errorMessage);
      return false;
    }
  }, []);

  return {
    searchHistory,
    isLoading,
    error,
    loadSearchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
}

// Hook for user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedPreferences = await storageService.getUserPreferences();
      setPreferences(storedPreferences);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preferences';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: Record<string, any>) => {
    try {
      setError(null);
      const updatedPreferences = { ...preferences, ...newPreferences };
      const success = await storageService.setUserPreferences(updatedPreferences);
      if (success) {
        setPreferences(updatedPreferences);
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      return false;
    }
  }, [preferences]);

  return {
    preferences,
    isLoading,
    error,
    loadPreferences,
    updatePreferences,
  };
}
