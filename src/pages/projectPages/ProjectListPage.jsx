import React, { useCallback, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import AddTeamModal from './AddTeamModal';
import AddProjectModal from './AddProjectModal'
import EditProjectModal from './EditProjectModal'
import api from '../../api/axios';
import SupervisorNavBar from '../../components/SupervisorNavBar';

const ProjectListPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    

    const [editModal, setEditModal] = useState({
        isOpen: false,
        projectId: null
    });
    // Charger la liste des projets
    const [modalState, setModalState] = useState({
        isOpen: false,
        project: null,
        formData: { name: '', min_students: 1, max_students: 1 }
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const [projectsRes, teamsRes] = await Promise.all([
                    api.get('/projects/'),
                    api.get('/teams/')
                ]);

                // Regroupement des groupes par projet
                const teamsByProject = teamsRes.data.reduce((acc, team) => {
                    acc[team.project] = acc[team.project] || [];
                    acc[team.project].push(team);
                    return acc;
                }, {});

                const mergedData = projectsRes.data.map(project => ({
                    ...project,
                    teams: teamsByProject[project.id] || []
                }));


                setProjects(mergedData);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            }
        };
        fetchProjects();
    }, []);

    // Gestion du modal
    const openTeamModal = (project) => {
        setModalState({
            isOpen: true,
            project,
            formData: {
                name: '',
                min_students: 1,
                max_students: project.number_groups
            }
        });
    };

    // Gestion de la modal de projet
    const openProjectModal = () => {
        setIsProjectModalOpen({
            isOpen: true,
            formData: {
                title: '',
                code: '',
                description: '',
                level: 'L3',
                number_groups: 1,
                priority: false,
                supervisor: 'current-user-id' // À remplacer par l'ID réel
            }
        });
    };

    const closeModal = () => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setModalState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [name]: name === 'name' ? value : parseInt(value)
            }
        }));
    };

    const handleUpdateProject = (updatedProject) => {
        setProjects(projects.map(proj =>
            proj.id === updatedProject.id ? updatedProject : proj
        ));
    };

    // const handleEditProject = useCallback((projectId) => {
    //     setEditModal({
    //         isOpen: true,
    //         projectId: projectId
    //     });
    // }, []);
    const openEditModal = (projectId) => {
        setEditModal({
            isOpen: true,
            projectId: projectId
        });
    };

    const handleSubmit = async () => {
        // await api.post(`/api/projects/${modalState.project.id}/teams/`,
        try {
            await api.post(`/teams/`, {
                ...modalState.formData,
                project: modalState.project.id // On envoie l'ID du projet
            }, //{ headers: getAuthHeaders() }
            );
            closeModal();
            navigate('/projects_listes');

        } catch (error) {
            console.error("Erreur création d'équipe:", error.response?.data);
            // Gérer les erreurs (permissions, validation, etc.)
        }
        // Recharger les données ou mettre à jour l'état local
    };

    const handleProjectSubmit = async (projectData) => {
        try {
            await api.post('/projects/', projectData);
            // Recharger les projets après création
            fetchProjects();
        } catch (error) {
            console.error("Erreur création de projet:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* <SupervisorNavBar /> */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Liste des Projets</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={openProjectModal}
                            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            + Créer un projet
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {projects.length > 0 ? (
                        projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onEdit={openEditModal}
                                projectId = {project.id}
                                onAddTeam={() => openTeamModal(project)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Aucun projet disponible</p>
                        </div>
                    )}
                </div>
            </div>

            <AddTeamModal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                project={modalState.project}
                formData={modalState.formData}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
            />

            <AddProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSubmit={handleProjectSubmit}
            />

            <EditProjectModal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, project: null })}
                projectId={editModal.projectId}
                onProjectUpdated={handleUpdateProject}
            />
        </div>
    );
};

export default ProjectListPage;