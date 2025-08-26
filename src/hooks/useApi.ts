import { useState, useCallback } from 'react';
import { ApiResponse } from '../types';
import { apiService } from '../services/api';

// Generic hook for API operations
export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Operation failed');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
}

// Specific hook for products
export function useProducts() {
  const { data: products, isLoading, error, execute, reset } = useApi<any[]>();

  const fetchProducts = useCallback(async () => {
    return execute(() => apiService.getProducts());
  }, [execute]);

  const searchProducts = useCallback(async (query: string) => {
    return execute(() => apiService.searchProducts(query));
  }, [execute]);

  const getProductById = useCallback(async (id: string) => {
    return execute(() => apiService.getProductById(id));
  }, [execute]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    searchProducts,
    getProductById,
    reset,
  };
}

// Hook for product categories
export function useProductCategories() {
  const { data: products, isLoading, error, execute, reset } = useApi<any[]>();

  const getProductsByCategory = useCallback(async (category: string) => {
    return execute(() => apiService.getProductsByCategory(category));
  }, [execute]);

  return {
    products,
    isLoading,
    error,
    getProductsByCategory,
    reset,
  };
}
