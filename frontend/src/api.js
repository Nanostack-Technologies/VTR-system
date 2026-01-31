import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://vtr-backend.onrender.com/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (username, password) => {
    const response = await api.post('token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
};

export const fetchProducts = () => api.get('products/');
export const fetchOrders = () => api.get('orders/');
export const createOrder = (orderData) => api.post('orders/', orderData);
export const fetchPrices = () => api.get('prices/');

export default api;
