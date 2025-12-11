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
  vehicles: (userId: string) => `${API_BASE_URL}/api/vehicles/${userId}`,
  vehiclesBase: `${API_BASE_URL}/api/vehicles`,
  userSettings: (userId: string) => `${API_BASE_URL}/api/user/${userId}/settings`,
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

// Vehicles API functions
export const vehiclesAPI = {
  getVehicles: async (userId: string) => {
    return apiCall(API_ENDPOINTS.vehicles(userId));
  },
  
  createVehicle: async (userId: string, vehicleData: any) => {
    return apiCall(API_ENDPOINTS.vehiclesBase, {
      method: "POST",
      body: JSON.stringify({ ...vehicleData, userId }),
    });
  },
  
  updateVehicle: async (vehicleId: string, userId: string, vehicleData: any) => {
    return apiCall(`${API_ENDPOINTS.vehiclesBase}/${vehicleId}`, {
      method: "PUT",
      body: JSON.stringify({ ...vehicleData, userId }),
    });
  },
  
  deleteVehicle: async (vehicleId: string, userId: string) => {
    return apiCall(`${API_ENDPOINTS.vehiclesBase}/${vehicleId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    });
  },
};

// User settings API functions
export const settingsAPI = {
  getUserSettings: async (userId: string) => {
    return apiCall(API_ENDPOINTS.userSettings(userId));
  },
  
  updateUserSettings: async (userId: string, settings: any) => {
    return apiCall(API_ENDPOINTS.userSettings(userId), {
      method: "PUT",
      body: JSON.stringify(settings),
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