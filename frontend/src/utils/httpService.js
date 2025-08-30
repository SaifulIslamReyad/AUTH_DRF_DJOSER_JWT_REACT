import axios from "axios";

// Set base URL for API calls
// Determine the API URL based on the environment
const baseURL =
  process.env.REACT_APP_API_URL ||
  (() => {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8000";
    } 
    // else {
    //   return "http://192.168.1.206:8000";
    // }
  })();

axios.defaults.baseURL = baseURL;

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `JWT ${access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const response = await axios.post(`${baseURL}/auth/jwt/refresh/`, {
            refresh: refresh,
          });

          const { access } = response.data;
          localStorage.setItem("access", access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `JWT ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token is invalid, redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default {
  request: axiosInstance.request,
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
  // Export the instance for direct use
  instance: axiosInstance,
};
