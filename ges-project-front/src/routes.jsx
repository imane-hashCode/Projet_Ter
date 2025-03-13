import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/dashboards/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProjectList from './pages/studentPages/Projects'
import VoeuxPage from './pages/studentPages/Voeux';
import AddProjectPage from './pages/projectPages/AddProjectPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* <Route exact path="/" element={Home} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route
                    path="/voeux"
                    element={
                        <PrivateRoute>
                            <VoeuxPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/add-project"
                    element={
                        <PrivateRoute>
                            <AddProjectPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;