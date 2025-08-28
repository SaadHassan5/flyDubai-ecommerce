import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { ENV } from "../config/env";

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: `@ecommerce:${ENV.STORAGE_FAVORITES}`,
  USER_PREFERENCES: `@ecommerce:${ENV.STORAGE_USER_PREFERENCES}`,
  CART_ITEMS: `@ecommerce:${ENV.STORAGE_CART_ITEMS}`,
  SEARCH_HISTORY: `@ecommerce:${ENV.STORAGE_SEARCH_HISTORY}`,
} as const;

class StorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        // Use localStorage on web
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Use AsyncStorage on native platforms
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  }

  // Generic set method
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        // Use localStorage on web
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } else {
        // Use AsyncStorage on native platforms
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
      }
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error);
      return false;
    }
  }

  // Generic remove method
  async remove(key: string): Promise<boolean> {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        // Use localStorage on web
        window.localStorage.removeItem(key);
        return true;
      } else {
        // Use AsyncStorage on native platforms
        await AsyncStorage.removeItem(key);
        return true;
      }
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
      return false;
    }
  }

  // Generic clear method
  async clear(): Promise<boolean> {
    try {
      if (
        Platform.OS === "web" &&
        typeof window !== "undefined" &&
        window.localStorage
      ) {
        // Clear only our app's keys on web
        Object.values(STORAGE_KEYS).forEach((key) => {
          window.localStorage.removeItem(key);
        });
        return true;
      } else {
        // Use AsyncStorage on native platforms
        await AsyncStorage.clear();
        return true;
      }
    } catch (error) {
      console.error("Error clearing storage", error);
      return false;
    }
  }

  // Favorites specific methods
  async getFavorites(): Promise<string[]> {
    try {
      const result = (await this.get<string[]>(STORAGE_KEYS.FAVORITES)) || [];
      return result;
    } catch (error) {
      console.error(
        `Error getting item from storage: ${STORAGE_KEYS.FAVORITES}`,
        error
      );
      return [];
    }
  }

  async setFavorites(favorites: string[]): Promise<boolean> {
    return this.set(STORAGE_KEYS.FAVORITES, favorites);
  }

  async addToFavorites(productId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      return this.setFavorites(favorites);
    }
    return true;
  }

  async removeFromFavorites(productId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const filteredFavorites = favorites.filter((id) => id !== productId);
    return this.setFavorites(filteredFavorites);
  }

  async toggleFavorite(productId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();

      if (favorites.includes(productId)) {
        return this.removeFromFavorites(productId);
      } else {
        return this.addToFavorites(productId);
      }
    } catch (error) {
      console.error("Storage: Error in toggleFavorite:", error);
      return false;
    }
  }

  // User preferences methods
  async getUserPreferences(): Promise<Record<string, any>> {
    return (
      (await this.get<Record<string, any>>(STORAGE_KEYS.USER_PREFERENCES)) || {}
    );
  }

  async setUserPreferences(preferences: Record<string, any>): Promise<boolean> {
    return this.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  // Cart methods
  async getCartItems(): Promise<any[]> {
    return (await this.get<any[]>(STORAGE_KEYS.CART_ITEMS)) || [];
  }

  async setCartItems(items: any[]): Promise<boolean> {
    return this.set(STORAGE_KEYS.CART_ITEMS, items);
  }

  // Search history methods
  async getSearchHistory(): Promise<string[]> {
    return (await this.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY)) || [];
  }

  async addToSearchHistory(query: string): Promise<boolean> {
    const history = await this.getSearchHistory();
    const filteredHistory = history.filter((item) => item !== query);
    filteredHistory.unshift(query);
    // Keep only last 10 searches
    const limitedHistory = filteredHistory.slice(0, 10);
    return this.set(STORAGE_KEYS.SEARCH_HISTORY, limitedHistory);
  }

  async clearSearchHistory(): Promise<boolean> {
    return this.remove(STORAGE_KEYS.SEARCH_HISTORY);
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;
