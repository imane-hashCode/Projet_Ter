import api from './axios';

export const login = async (credentials) => {
    try {
        const response = await api.post('/token/', credentials);
        const { access, refresh } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        const userResponse = await api.get('/users/me/');
        const user = userResponse.data;

        return { user, tokens: { access, refresh } };
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const refreshToken = async () => {
    try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await api.post('/token/refresh/', { refresh });
        localStorage.setItem('access_token', response.data.access);
        return response.data;
    } catch (error) {
        throw error;
    }
};