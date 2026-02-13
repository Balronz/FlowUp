import axios from 'axios';

const API = 'http://localhost:4000/api'; 

export const createTaskRequest = async (task) => {
    try {
        const response = await axios.post(`${API}/tasks`, task, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Create Task Error');
    }
};

export const updateTaskRequest = async (id, task) => {
    try {
        const response = await axios.put(`${API}/tasks/${id}`, task, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Update Task Error');
    }
};

export const getTasksRequest = async () => {
    try {
        const response = await axios.get(`${API}/tasks`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Get Tasks Error');
    }
};