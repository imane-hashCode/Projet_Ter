import React, { useEffect, useState } from 'react';
import AddProjectForm from './AddProjectForm';
import AddTeamForm from './AddTeamForm';
import api from '../../api/axios';

const AddProjectPage = () => {
    const [projects, setProjects] = useState([]);

    // Charger la liste des projets
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Ajouter un projet</h1>
            <AddProjectForm />
            <h2>Ajouter une équipe</h2>
            <AddTeamForm projects={projects} />
        </div>
    );
};

export default AddProjectPage;