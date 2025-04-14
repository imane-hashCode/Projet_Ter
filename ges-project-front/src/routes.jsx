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
import ProjectsTeam from './pages/projectPages/ProjectTeam';
import AssignmentList from './pages/admin/AssignmentList'
import StudentVoeuxPage from './pages/admin/StudentVoeuxPage';

const AppRoutes = () => {
    return (
        
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/voeux" element={ <VoeuxPage />}/>
                <Route path="/projets/:id" element={<ProjectDetail />} />
                <Route path="/assignment" element= { <AssignmentList /> } />
                <Route path="/projects_team/:role" element={<ProjectsTeam />} />
                <Route path="/student-voeux" element={<StudentVoeuxPage />} />
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
        
    );
};

export default AppRoutes;