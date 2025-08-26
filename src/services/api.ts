import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_URLS, HTTP_STATUS } from '../constants/api';
import { Product, ApiResponse } from '../types';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URLS.PRODUCTS,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication headers, logging, etc.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        // Handle authentication errors
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        // Handle not found errors
      }
    } else if (error.request) {
      // Request was made but no response received
    } else {
      // Something else happened
    }
    return Promise.reject(error);
  }
);

// API Service class for handling HTTP requests
class ApiService {
  // Get all products
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await axiosInstance.get('');
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<Product[]>(error);
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    try {
      // Since the mock API returns all products, we'll filter by ID
      const response = await this.getProducts();
      if (response.success && response.data) {
        const product = response.data.find(p => p.id === id);
        if (product) {
          return {
            data: product,
            success: true,
          };
        }
      }
      
      return {
        data: null as unknown as Product,
        success: false,
        message: 'Product not found',
      };
    } catch (error) {
      return this.handleError<Product>(error);
    }
  }

  // Search products by name
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.getProducts();
      if (response.success && response.data) {
        const filteredProducts = response.data.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        return {
          data: filteredProducts,
          success: true,
        };
      }
      return response;
    } catch (error) {
      return this.handleError<Product[]>(error);
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.getProducts();
      if (response.success && response.data) {
        const filteredProducts = response.data.filter(product =>
          product.category?.toLowerCase() === category.toLowerCase()
        );
        return {
          data: filteredProducts,
          success: true,
        };
      }
      return response;
    } catch (error) {
      return this.handleError<Product[]>(error);
    }
  }

  // Generic error handler
  private handleError<T>(error: any): ApiResponse<T> {
    let message = 'An unexpected error occurred';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        message = error.response.data?.message || `HTTP ${error.response.status}`;
      } else if (error.request) {
        message = 'Network error - please check your connection';
      } else {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    return {
      data: null as T,
      success: false,
      message,
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
