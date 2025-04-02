import React from 'react';
import { FiPlus, FiUser, FiAward, FiFlag, FiUsers, FiInfo, FiEdit2 } from 'react-icons/fi';

const ProjectCard = ({ project, onEdit, onAddTeam, projectId }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full w-full border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="p-6 flex-grow">
                {/* Header avec titre et badge de priorité */}
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {project.code} - {project.title}
                        {project.priority && (
                            <span className="ml-2 text-red-500" title="Projet prioritaire">
                                <FiFlag className="inline" />
                            </span>
                        )}
                    </h2>
                </div>

                {/* Badges d'information */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <FiAward className="mr-1" /> {project.level}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <FiUsers className="mr-1" /> {project.teams?.length || 0}/{project.number_groups} groupes
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <FiUser className="mr-1" /> {project.supervisor.username}
                    </span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Description */}
                {/* <div className="flex items-start text-gray-600 mb-4">
                    <FiInfo className="mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm">{project.description}</p>
                </div> */}

                {/* Liste des groupes existants */}

                {project.teams?.length === 0 && (
                    <div className="px-5 py-2 text-sm text-gray-500 italic">
                        Aucun groupe créé pour ce projet
                    </div>
                )}
                {project.teams === undefined && (
                    <div className="px-5 py-2 text-sm text-yellow-600">
                        Chargement des groupes...
                    </div>
                )}

                {project.teams && project.teams.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Groupes existants :</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.teams.map(team => (
                                <span
                                    key={team.id}
                                    className="inline-block px-2 py-1 text-xs rounded border border-gray-300 bg-gray-50 text-gray-700"
                                >
                                    {team.name} ({team.min_students}-{team.max_students} étudiants)
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bouton d'action */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                    onClick={() => onEdit(projectId)}
                    className="text-sm bg-blue-600 text-white hover:text-blue-800 flex items-center"
                >
                    <FiEdit2 className="mr-1" />
                    Modifier Projet
                </button>
                <button
                    onClick={onAddTeam}
                    disabled={project.teams?.length >= project.number_groups}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${project.teams?.length >= project.number_groups
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    <FiPlus className="mr-2" />
                    Ajouter un groupe
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;