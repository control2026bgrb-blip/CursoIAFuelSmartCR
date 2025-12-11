// API Configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URLs
const API_CONFIG = {
  development: "", // Use relative URLs for now
  production: "", // Empty string means relative URLs (same domain)
};

// Get the current API base URL
export const API_BASE_URL = API_CONFIG.production; // Always use relative URLs

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    register: `${API_BASE_URL}/api/auth/register`,
    login: `${API_BASE_URL}/api/auth/login`,
  },
  users: `${API_BASE_URL}/api/users`,
  health: `${API_BASE_URL}/api/health`,
};

// Helper function for API calls
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return { data, response };
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  register: async (username: string, password: string) => {
    return apiCall(API_ENDPOINTS.auth.register, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
  
  login: async (username: string, password: string) => {
    return apiCall(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },
};

// Debug info (only in development)
if (isDevelopment) {
  console.log("🔧 API Configuration:", {
    environment: isDevelopment ? "development" : "production",
    baseURL: API_BASE_URL,
    endpoints: API_ENDPOINTS,
  });
}