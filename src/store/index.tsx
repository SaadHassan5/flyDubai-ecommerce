import { createContext, useContext, useReducer, useEffect, ReactNode, useMemo } from 'react';
import { AppState, AppAction, Product, CartItem } from '../types';
import { apiService } from '../services/api';
import { storageService } from '../services/storage';

// Initial state
const initialState: AppState = {
  products: [],
  favorites: [],
  cart: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  },
  isLoading: false,
  error: null,
  searchQuery: '',
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'TOGGLE_FAVORITE':
      const newFavorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      return { ...state, favorites: newFavorites };
    
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'CLEAR_SEARCH':
      return { ...state, searchQuery: '' };
    
    case 'ADD_TO_CART': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.cart.items.findIndex(item => item.productId === product.id);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...state.cart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [...state.cart.items, { productId: product.id, quantity, product }];
      }
      
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice,
        },
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const newItems = state.cart.items.filter(item => item.productId !== action.payload);
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice,
        },
      };
    }
    
    case 'UPDATE_CART_QUANTITY': {
      const { productId, quantity } = action.payload;
      const newItems = state.cart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity
      
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      return {
        ...state,
        cart: {
          items: newItems,
          totalItems,
          totalPrice,
        },
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    fetchProducts: () => Promise<void>;
    toggleFavorite: (productId: string) => Promise<void>;
    searchProducts: (query: string) => void;
    clearSearch: () => void;
    loadFavorites: () => Promise<void>;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    loadCart: () => Promise<void>;
  };
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = useMemo(() => ({
    fetchProducts: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        const response = await apiService.getProducts();
        
        if (response.success && response.data) {
          dispatch({ type: 'SET_PRODUCTS', payload: response.data });
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to fetch products' });
        }
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    toggleFavorite: async (productId: string) => {
      try {
        const success = await storageService.toggleFavorite(productId);
        if (success) {
          dispatch({ type: 'TOGGLE_FAVORITE', payload: productId });
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    },

    searchProducts: (query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    },

    clearSearch: () => {
      dispatch({ type: 'CLEAR_SEARCH', payload: undefined });
    },

    loadFavorites: async () => {
      try {
        const favorites = await storageService.getFavorites();
        dispatch({ type: 'SET_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    },

    addToCart: (product: Product, quantity: number = 1) => {
      dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
    },

    removeFromCart: (productId: string) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    },

    updateCartQuantity: (productId: string, quantity: number) => {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
    },

    clearCart: () => {
      dispatch({ type: 'CLEAR_CART', payload: undefined });
    },

    loadCart: async () => {
      try {
        const cartItems = await storageService.getCartItems();
        if (cartItems && cartItems.length > 0) {
          const cartState = {
            items: cartItems,
            totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
          };
          dispatch({ type: 'SET_CART', payload: cartState });
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    },
  }), []);

  // Load favorites on mount
  useEffect(() => {
    actions.loadFavorites();
  }, []);

  // Load cart on mount
  useEffect(() => {
    actions.loadCart();
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (state.cart.items.length > 0) {
      storageService.setCartItems(state.cart.items);
    } else {
      storageService.setCartItems([]);
    }
  }, [state.cart.items]);

  // Fetch products on mount
  useEffect(() => {
    actions.fetchProducts();
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for specific state slices
export function useProducts() {
  const { state } = useApp();
  return state.products;
}

export function useFavorites() {
  const { state } = useApp();
  return state.favorites;
}

export function useCart() {
  const { state } = useApp();
  return state.cart;
}

export function useIsLoading() {
  const { state } = useApp();
  return state.isLoading;
}

export function useError() {
  const { state } = useApp();
  return state.error;
}

export function useSearchQuery() {
  const { state } = useApp();
  return state.searchQuery;
}

export function useFilteredProducts() {
  const { state } = useApp();
  const { products, searchQuery, favorites } = state;
  
  if (!searchQuery.trim()) {
    return products;
  }
  return products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

export function useFavoriteProducts() {
  const { state } = useApp();
  const { products, favorites } = state;
  
  return products.filter(product => favorites.includes(product.id));
}
