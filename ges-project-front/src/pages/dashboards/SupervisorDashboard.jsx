import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SupervisorNavBar from '../../components/SupervisorNavBar';

const SupervisorDashboard = () => {
    const { user, signOut } = useAuth();

    return (
        <div>
            < SupervisorNavBar />
            <h1>Supervisor Dashboard</h1>
            <p>Welcome, {user ? user.username : 'Guest'}!</p>
            <button onClick={signOut}>Logout</button>
            <Outlet />
            <div class="aspect-w-16 aspect-h-9">
                <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    );
};

export default SupervisorDashboard;