import { renderHook, act, waitFor } from '@testing-library/react-native';
import React from 'react';
import { AppProvider, useApp } from '../index';

// Mock the services
jest.mock('../../services/api', () => ({
  apiService: {
    getProducts: jest.fn(),
  },
}));

jest.mock('../../services/storage', () => ({
  storageService: {
    getFavorites: jest.fn(),
    setFavorites: jest.fn(),
    toggleFavorite: jest.fn(),
  },
}));

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 100,
    image: 'image1.jpg',
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 200,
    image: 'image2.jpg',
  },
];

const mockFavorites = ['1'];

describe('App Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', async () => {
    // Mock the services to return empty data
    const mockGetFavorites = require('../../services/storage').storageService.getFavorites;
    const mockGetProducts = require('../../services/api').apiService.getProducts;
    
    mockGetFavorites.mockResolvedValue([]);
    mockGetProducts.mockResolvedValue({
      success: true,
      data: [],
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    // Wait for initial data loading to complete
    await waitFor(() => {
      expect(result.current.state.isLoading).toBe(false);
    });

    expect(result.current.state.products).toEqual([]);
    expect(result.current.state.favorites).toEqual([]);
    expect(result.current.state.error).toBeNull();
    expect(result.current.state.searchQuery).toBe('');
  });

  it('loads favorites on mount', async () => {
    const mockGetFavorites = require('../../services/storage').storageService.getFavorites;
    mockGetFavorites.mockResolvedValue(mockFavorites);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.favorites).toEqual(mockFavorites);
    });
    
    expect(mockGetFavorites).toHaveBeenCalled();
  });

  it('fetches products on mount', async () => {
    const mockGetProducts = require('../../services/api').apiService.getProducts;
    mockGetProducts.mockResolvedValue({
      success: true,
      data: mockProducts,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.products).toEqual(mockProducts);
    });
    
    expect(mockGetProducts).toHaveBeenCalled();
  });

  it('handles product fetch error', async () => {
    const mockGetProducts = require('../../services/api').apiService.getProducts;
    mockGetProducts.mockResolvedValue({
      success: false,
      message: 'Failed to fetch products',
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    await waitFor(() => {
      expect(result.current.state.error).toBe('Failed to fetch products');
    });
    
    expect(result.current.state.products).toEqual([]);
  });

  it('toggles favorite status', async () => {
    const mockToggleFavorite = require('../../services/storage').storageService.toggleFavorite;
    mockToggleFavorite.mockResolvedValue(true);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    // Set initial favorites
    act(() => {
      result.current.dispatch({ type: 'SET_FAVORITES', payload: mockFavorites });
    });

    expect(result.current.state.favorites).toEqual(mockFavorites);

    // Toggle favorite
    await act(async () => {
      await result.current.actions.toggleFavorite('2');
    });

    expect(mockToggleFavorite).toHaveBeenCalledWith('2');
    expect(result.current.state.favorites).toContain('2');
  });

  it('updates search query', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    act(() => {
      result.current.actions.searchProducts('test query');
    });

    expect(result.current.state.searchQuery).toBe('test query');
  });

  it('clears search query', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    // Set search query first
    act(() => {
      result.current.actions.searchProducts('test query');
    });

    expect(result.current.state.searchQuery).toBe('test query');

    // Clear search
    act(() => {
      result.current.actions.clearSearch();
    });

    expect(result.current.state.searchQuery).toBe('');
  });

  it('sets loading state during API calls', async () => {
    const mockGetProducts = require('../../services/api').apiService.getProducts;
    mockGetProducts.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    // Start fetching products
    act(() => {
      result.current.actions.fetchProducts();
    });

    expect(result.current.state.isLoading).toBe(true);
  });

  it('handles storage service errors gracefully', async () => {
    const mockToggleFavorite = require('../../services/storage').storageService.toggleFavorite;
    mockToggleFavorite.mockRejectedValue(new Error('Storage error'));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppProvider>{children}</AppProvider>
    );

    const { result } = renderHook(() => useApp(), { wrapper });

    // Try to toggle favorite
    await act(async () => {
      await result.current.actions.toggleFavorite('1');
    });

    // Should not crash and should log error
    expect(mockToggleFavorite).toHaveBeenCalledWith('1');
  });
});
