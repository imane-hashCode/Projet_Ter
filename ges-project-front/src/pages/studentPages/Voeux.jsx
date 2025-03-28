
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import StudentNavBar from '../../components/StudentNavBar';

const VoeuxPage = () => {
    const [projects, setProjects] = useState([]);
    const [voeux, setVoeux] = useState([]);  // Liste des vœux sélectionnés
    const [error, setError] = useState(null);
    const [preferences_note, setPreferences] = useState({});
    const navigate = useNavigate();

    // Fonction pour filtrer les projets disponibles
    const filterAvailableProjects = (allProjects, voeux) => {
        return allProjects.filter(
            project => !voeux.some(voeu => voeu.project.id === project.id)
        );
    };

    // Charger la liste des projets et les vœux existants
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Charger les projets disponibles
                const projectsResponse = await api.get('/projects/');
                const allProjects = projectsResponse.data;

                // Charger les vœux existants de l'étudiant
                const voeuxResponse = await api.get('/voeux/');
                const existingVoeux = voeuxResponse.data;

                // Mettre à jour les vœux avec les données existantes
                setVoeux(existingVoeux);

                // Filtrer les projets disponibles pour exclure ceux déjà dans les vœux
                const availableProjects = filterAvailableProjects(allProjects, existingVoeux);
                setProjects(availableProjects);

                // Initialiser les notes de préférence
                const initialPreferences = {};
                existingVoeux.forEach(voeu => {
                    initialPreferences[voeu.project_id] = voeu.note_preference;
                });
                setPreferences(initialPreferences);
            } catch (error) {
                console.error('Échec du chargement des données', error);
                setError('Échec du chargement des données');
            }
        };
        fetchData();
    }, []);

    const handlePreferenceChange = (voeuId, value) => {
        setPreferences({
            ...preferences_note,
            [voeuId]: value,
        });
    };

    // Gestion du Drag & Drop
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const newProjects = [...projects];
        const newVoeux = [...voeux];

        // Déplacement d'un projet vers les vœux
        if (source.droppableId === "projects" && destination.droppableId === "voeux") {
            // const [movedProject] = newProjects.splice(source.index, 1); // Supprime du tableau source
            const movedProject = newProjects[source.index]; // Trouve l'élément
            newProjects.splice(source.index, 1);
            const newVoeu = {
                id: `voeu-${movedProject.id}`,
                project: movedProject,
                rank: newVoeux.length + 1,  // Ajout en bas de la liste
                note_preference: 1, // Valeur par défaut
            };
            newVoeux.splice(destination.index, 0, newVoeu); // Insère dans le tableau cible

            setProjects(newProjects);
            setVoeux(newVoeux);
        }
        // Déplacement d'un vœu vers les projets disponibles
        else if (source.droppableId === "voeux" && destination.droppableId === "projects") {
            const [movedProject] = newVoeux.splice(source.index, 1);
            newProjects.splice(destination.index, 0, movedProject.project);

            setProjects(newProjects);
            setVoeux(newVoeux);
        }

        // Réorganisation des vœux
        else if (source.droppableId === "voeux" && destination.droppableId === "voeux") {
            const [reorderedVoeu] = newVoeux.splice(source.index, 1); // Retirer l'élément déplacé
            newVoeux.splice(destination.index, 0, reorderedVoeu); // Réinsérer à la bonne position

            setVoeux(newVoeux);
        }
    };

    // Soumettre les vœux
    const submitVoeux = async () => {
        const voeuxData = voeux.map((voeu, index) => ({
            project_id: voeu.project.id,
            rank: index + 1,
            note_preference: preferences_note[voeu.project.id] || voeu.note_preference || 1,
        }));

        try {
            await api.post('/voeux/submit_voeux/', { voeux: voeuxData });
            alert('Vos vœux ont été soumis avec succès !');
            navigate('/dashboard');
        } catch (error) {
            setError("Échec de soumission de vos vœux. Veuillez réessayer.");
            console.error('Échec de soumission de vos vœux', error);
        }
    };

    return (
        <div>
            <StudentNavBar />
            <h1>Expression des Vœux</h1>
            {error && <div style={{ color: 'red' }}>{error}</div>}

            <div className="flex space-x-10">
                <DragDropContext onDragEnd={handleDragEnd}>
                    {/* Liste des projets disponibles */}
                    {projects.length > 0 && (
                    <Droppable droppableId="projects">
                        {(provided) => (
                            <div className="border p-4 w-1/2">
                                <h2 className="text-lg font-semibold">Projets disponibles</h2>
                                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {projects.map((project, index) => (
                                        <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 border rounded-lg shadow-md flex justify-between"
                                                >
                                                    <span>{project.title}</span>
                                                    <span className="text-sm text-gray-500">{project.supervisor.username}</span>
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </div>
                        )}
                    </Droppable>
                    )}
                    {/* Liste des vœux sélectionnés */}
                    <div className={`border p-4 ${projects.length > 0 ? 'w-1/2' : 'w-full'}`}>
                    <Droppable droppableId="voeux">
                        {(provided) => (
                            // <div className="border p-4 w-1/2">
                            <>
                                <h2 className="text-lg font-semibold">Mes Vœux</h2>
                                <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {voeux.map((voeu, index) => (
                                        <Draggable key={voeu.id} draggableId={voeu.id.toString()} index={index}>
                                            {(provided) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 border rounded-lg shadow-md flex justify-between"
                                                >
                                                    <span>{index + 1}. {voeu.project.title}</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="20"
                                                        placeholder={preferences_note[voeu.id] || voeu.note_preference || 1}
                                                        onChange={(e) => handlePreferenceChange(voeu.project.id, e.target.value)}
                                                        className="border rounded p-1 text-sm w-16"
                                                    />
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            </>
                            // </div>
                        )}
                    </Droppable>
                    </div>
                </DragDropContext>
            </div>

            <button onClick={submitVoeux} className="mt-4 p-2 bg-blue-500 text-white rounded">
                Soumettre mes vœux
            </button>
        </div>
    );
};

export default VoeuxPage;