import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/dashboards/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProjectList from './pages/studentPages/Projects'
import VoeuxPage from './pages/studentPages/Voeux';
import ProjectDetail from './pages/studentPages/ProjectDetail'
import ProjectListPage from './pages/projectPages/ProjectListPage';
import AssignmentList from './pages/admin/AssignmentList'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* <Route exact path="/" element={Home} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/voeux" element={ <VoeuxPage />}/>
                <Route path="/projets/:id" element={<ProjectDetail />} />
                <Route path="/assignment" element= { <AssignmentList /> } />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/projects_listes"
                    element={
                        <PrivateRoute>
                            <ProjectListPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRoutes;