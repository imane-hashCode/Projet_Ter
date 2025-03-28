import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // URL de votre backend Django
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;


// import axios from 'axios';
// import { logout } from './Authentification';

// const api = axios.create({
//     baseURL: 'http://localhost:8000/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// // Intercepteur pour ajouter le token
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('access_token');
//         if (token) {
//             config.headers['Authorization'] = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Nouvel intercepteur pour gérer les réponses
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Si erreur 401 et pas déjà tenté de rafraîchir
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // Tentative de rafraîchissement du token
//                 const newTokens = await refreshToken();
//                 localStorage.setItem('access_token', newTokens.access);

//                 // Réessaye la requête originale avec le nouveau token
//                 originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 // Si le refresh échoue, déconnecter et rediriger
//                 logout();
//                 window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         }

//         // Pour les autres erreurs
//         return Promise.reject(error);
//     }
// );

// export default api;