import axios from "axios";

// create base instance
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

// Response interceptor to extract data
axiosInstance.interceptors.response.use(
    (response) => response.data, // Return full data object (includes message and data)
    (error) => {

        // log to monitoring service
        console.error('API Error:', error);

        const message = error.response?.data?.message || "API request failed";
        throw new Error(message)
    }
)

// request interceptor to auto-add auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)


// Type for API responses
export type ApiResponse<T = unknown> = {
    message?: string;
    data?: T;
}

// Function overloads for apiClient
export function apiClient<T>(url: string, options?: { method?: 'GET' }): Promise<T>;
export function apiClient<T>(url: string, options: { method: 'POST' | 'PUT' | 'DELETE', data?: unknown }): Promise<ApiResponse<T>>;

// Implementation
export async function apiClient<T>(
    url: string,
    options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: unknown }
): Promise<T | ApiResponse<T>> {
    const method = options?.method || 'GET';
    const response = await axiosInstance({
        url,
        method,
        data: options?.data
    });
    
    // For GET requests, return just the data
    // For mutations (POST/PUT/DELETE), return full response (includes message)
    if (method === 'GET') {
        return response.data as T;
    }
    
    return response as ApiResponse<T>;
}
