import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}


export default App
