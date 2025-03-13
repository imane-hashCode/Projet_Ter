import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, signOut } = useAuth();

    return (
        <div className="justify-center text-white text-2xl font-bold">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user ? user.username : 'Guest'}!</p>
            <button onClick={signOut}>Logout</button>
            {/* Ajoutez ici le contenu spécifique à l'administrateur */}
        </div>
    );
};

export default AdminDashboard;