import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

export const getExistingShapes = async (roomId) => {
    try {
        const res = await api.get(`/rooms/${roomId}/chats`);
        return res.data.shapes || [];
    } catch (error) {
        console.error("Failed to fetch existing shapes", error);
        return [];
    }
};

export default api;
