// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviews?: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { productId: string };
  Favorites: undefined;
  Search: undefined;
};

// State types
export interface AppState {
  products: Product[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

// Action types
export type AppAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: string[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_SEARCH'; payload: undefined };
