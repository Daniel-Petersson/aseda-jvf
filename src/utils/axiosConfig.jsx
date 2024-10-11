import axios from 'axios';
import { useCookies } from 'react-cookie';

const axiosInstance = axios.create({
  baseURL: 'http://your-api-url.com/api', // Replace with your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const [cookies] = useCookies(['token']);
    const token = cookies.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
