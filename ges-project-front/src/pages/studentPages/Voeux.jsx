import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import StudentNavBar from '../../components/StudentNavBar';

const VoeuxPage = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const [preferences_note, setPreferences] = useState({});
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

    const handlePreferenceChange = (projectId, value) => {
        setPreferences({
            ...preferences_note,
            [projectId]: value,
        });
    };

    // Gérer le drag and drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;  // Si l'élément est déposé en dehors de la liste

        const items = Array.from(projects);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setProjects(items);
    };

    // Soumettre les préférences
    const submitVoeux = async () => {
        const voeux = projects.map((project, index) => ({
            project_id: project.id,
            rank: index + 1,
            note_preference: preferences_note[project.id] || 0,
        }));

        try {
            await api.post('/voeux/submit_voeux/', {
                voeux: voeux,
            });
            alert('Vos voeux ont été soumises avec succès !');
            navigate('/dashboard');  // Rediriger vers le dashboard après la soumission
        } catch (error) {
            setError('Échec de soumission de vos vœux. Veuillez réessayer.');
            console.error('Echec de soumission de vos voeux', error);
        }
    };

    return (
        <div>
            <StudentNavBar />

            <h1>Expression des vœux</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div className='table w-full'>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="projects">
                        {(provided) => (
                            <ul {...provided.droppableProps} ref={provided.innerRef}>
                                {projects.map((project, index) => (
                                    <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                        {(provided) => (
                                            <div class="table-row-group">
                                                <div
                                                    className='flex'
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <div className='table-cell'>{project.code}</div>
                                                    <p className='table-cell'>{project.title}</p>
                                                    {/* <p>{project.description}</p> */}
                                                    <p className='table-cell'>Superviseur : {project.supervisor.username}</p>
                                                    {/* <p>Nombre de groupes : {project.number_groups}</p> */}
                                                    <label className='table-cell'>
                                                        Note de préférence :
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="10"
                                                            value={preferences_note[project.id] || ''}
                                                            onChange={(e) => handlePreferenceChange(project.id, e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <button onClick={submitVoeux}>Soumettre mes voeux</button>
        </div>
    );
};

export default VoeuxPage;