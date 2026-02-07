import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/products`;

export const getAllProducts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getAllProductsAdmin = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/management`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin products:', error);
        throw error;
    }
};