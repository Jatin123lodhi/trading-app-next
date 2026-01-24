import axios from "axios";

// create base instance
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

// Response interceptor to extract data.data
axiosInstance.interceptors.response.use(
    (response) => response.data.data,
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


export const apiClient = async <T>(
    url: string,
    options?: { method?: string, data?: unknown }
): Promise<T> => {
    return axiosInstance({
        url,
        method: options?.method || 'GET',
        data: options?.data
    })
}
