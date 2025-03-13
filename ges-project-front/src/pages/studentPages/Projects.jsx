import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StudentNavBar from '../../components/StudentNavBar';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

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
            <StudentNavBar />
            <h1>Liste des projets</h1>
            <div className="space-y-10">
                {projects.map((project) => (
                    <div className="border items-start"
                        key={project.id}>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <p>Superviseur : {project.supervisor.username}</p>
                        <p>Nombre de groupes : {project.number_groups}</p>
                        <p>Contact : {project.supervisor.email}</p>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate('/voeux')}>Exprimer mes vœux</button>
        </div>
    );
};

export default ProjectList;