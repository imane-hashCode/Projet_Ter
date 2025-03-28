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


// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { login, logout, refreshToken } from '../api/Authentification';
// import api from '../api/axios'; // Importez votre instance axios

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const checkAuth = async () => {
//             const token = localStorage.getItem('access_token');
//             const refresh = localStorage.getItem('refresh_token');

//             if (!token && !refresh) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 // Vérifie d'abord si le token est encore valide
//                 const userResponse = await api.get('/users/me/');
//                 setUser(userResponse.data);
//             } catch (error) {
//                 if (error.response?.status === 401 && refresh) {
//                     try {
//                         // Tentative de rafraîchissement du token
//                         const { access } = await refreshToken();
//                         localStorage.setItem('access_token', access);

//                         // Récupère à nouveau les infos utilisateur
//                         const userResponse = await api.get('/users/me/');
//                         setUser(userResponse.data);
//                     } catch (refreshError) {
//                         // Si le refresh échoue, déconnecter
//                         signOut();
//                     }
//                 } else {
//                     signOut();
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         checkAuth();

//         // Optionnel: Vérification périodique (toutes les 5 minutes)
//         const interval = setInterval(() => {
//             const token = localStorage.getItem('access_token');
//             if (!token) checkAuth();
//         }, 300000);

//         return () => clearInterval(interval);
//     }, []);

//     const signIn = async (credentials) => {
//         try {
//             const { user, tokens } = await login(credentials);
//             setUser(user);
//             return { user, tokens };
//         } catch (error) {
//             signOut();
//             throw error;
//         }
//     };

//     const signOut = () => {
//         logout();
//         setUser(null);
//         // Redirection gérée dans l'intercepteur axios
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             signIn,
//             signOut,
//             loading,
//             isAuthenticated: !!user // Ajout d'un flag pratique
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);