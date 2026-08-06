import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ========== CREATE (POST) ==========
export const createItem = (item) => api.post('/items', item);

// ========== READ (GET) ==========
export const getAllItems = () => api.get('/items');
export const getItemById = (id) => api.get(`/items/${id}`);

// ========== UPDATE (PUT) ==========
export const updateItem = (id, item) => api.put(`/items/${id}`, item);

// ========== DELETE ==========
export const deleteItem = (id) => api.delete(`/items/${id}`);

export default api;