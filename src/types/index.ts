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

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
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
  Cart: undefined;
  Search: undefined;
};

// State types
export interface AppState {
  products: Product[];
  favorites: string[];
  cart: CartState;
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
  | { type: 'CLEAR_SEARCH'; payload: undefined }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART'; payload: undefined }
  | { type: 'SET_CART'; payload: CartState };
