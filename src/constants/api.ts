import { ENV } from '../config/env';


export const API_CONFIG = {
  BASE_URL: ENV.API_URL,
  PRODUCTS_ENDPOINT: ENV.API_KEY,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// API URLs
export const API_URLS = {
  PRODUCTS: `${API_CONFIG.BASE_URL}${API_CONFIG.PRODUCTS_ENDPOINT}`,
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
