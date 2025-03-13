import React, { createContext, useContext, useEffect, useState } from 'react';
import { login, logout, refreshToken } from '../api/Authentification';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    await refreshToken();
                    const userResponse = await api.get('/users/me/');
                    setUser(userResponse.data);
                } catch (error) {
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const signIn = async (credentials) => {
        const { user, tokens } = await login(credentials);
        setUser(user);
        return { user, tokens };
    };

    const signOut = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);