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

export const getProductsPage = async (page = 0, size = 20, sortBy = 'id', sortDir = 'asc') => {
    try {
        const response = await axios.get(API_URL, {
            params: { page, size, sortBy, sortDir }
        });
        const data = response.data;

        if (Array.isArray(data)) {
            return {
                content: data,
                totalPages: 1,
                totalElements: data.length,
                number: 0,
                size: data.length
            };
        }

        return data;
    } catch (error) {
        console.error('Error fetching products page:', error);
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
