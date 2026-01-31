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

// Add interceptor to handle 401s
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const response = await api.post('token/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
};

export const fetchMe = () => api.get('users/me/');
export const fetchProducts = () => api.get('products/');
export const createProduct = (data) => api.post('products/', data);
export const updateProduct = (id, data) => api.patch(`products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`products/${id}/`);
export const fetchOrders = () => api.get('orders/');
export const updateOrder = (id, data) => api.patch(`orders/${id}/`, data);
export const createOrder = (orderData) => api.post('orders/', orderData);
export const fetchPrices = () => api.get('prices/');

export default api;
