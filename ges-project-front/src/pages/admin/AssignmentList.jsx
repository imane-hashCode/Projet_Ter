import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavBar from '../../components/AdminNavBar'

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState(null);
    const [unassignedStudents, setUnassignedStudents] = useState([]);
    const [unassignedProjects, setUnassignedProjects] = useState([]);
    const [stats, setSatistics] = useState([]);

    // 🟢 Fonction pour récupérer les projets (GET)
    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/projects-assign/");
            setProjects(response.data.projects);
            setUnassignedStudents(response.data.unassigned_students);
            setUnassignedProjects(response.data.unassigned_projects);
            setSatistics(response.data.stats)
            setError(null);
        } catch (err) {
            setError("Erreur lors du chargement des Affectations.");
        } finally {
            setLoading(false);
        }
    };

    // 🟢 Fonction pour lancer l'affectation (POST)
    const assignProjects = async () => {
        setAssigning(true);
        try {
            await axios.post("http://127.0.0.1:8000/api/projects-assign/");
            fetchProjects(); // Recharger les projets après l'affectation
        } catch (err) {
            setError("Erreur lors de l'affectation.");
        } finally {
            setAssigning(false);
        }
    };

    // Charger les projets au montage
    useEffect(() => {
        fetchProjects();
    }, []);

    const getBackgroundColor = (score) => {
        if (score > 70) return "bg-green-50 text-green-800";
        if (score >= 50) return "bg-orange-50 text-orange-800";
        return "bg-red-50 text-red-800";
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminNavBar />
            {/* En-tête */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🎯 Gestion des affectations de projets</h1>
                    <p className="text-gray-500 mt-2">Visualisation et gestion des affectations étudiants-projets</p>
                </div>

                {/* Bouton d'affectation */}
                <button
                    onClick={assignProjects}
                    disabled={assigning}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${assigning
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                        }`}
                >
                    {assigning ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Traitement en cours...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Lancer l'affectation
                        </>
                    )}
                </button>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenu principal */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                        </div>
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <>
                    {/* Cartes de projets */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
                        <h3 className="text-lg font-medium text-green-800 flex items-center">
                            Étudiants affectés ({stats.total_assignments} / {stats.total_assignments + stats.unassigned_students_count})
                        </h3>
                    </div>

                    <div className={`px-6 py-5 border-b border-gray-200 ${getBackgroundColor(stats.satisfaction_score)}`}>
                        <h3 className="text-lg font-medium flex items-center">
                            Satisfaction total: {stats.satisfaction_score}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.project_id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded mb-2">
                                                {project.project_code}
                                            </span>
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">{project.project_title}</h2>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            {project.student_count} étudiant(s)
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center text-sm text-gray-500">
                                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {project.supervisor}
                                    </div>

                                    {project.students.length > 0 ? (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Étudiants assignés</h3>
                                            <ul className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                                                {project.students.map((student) => (
                                                    <li key={student.student_id} className="px-4 py-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{student.student_name}</p>
                                                            <p className="text-xs text-gray-500">Niveau: {student.student_level}</p>
                                                        </div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {student.status}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="mt-4 text-center py-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500">Aucun étudiant assigné</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Panneaux d'information */}

                    <div className="mt-12 space-y-6">

                        {/* Étudiants non affectés */}

                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
                                <h3 className="text-lg font-medium text-red-700 flex items-center">
                                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Étudiants non affectés ({stats.unassigned_students_count})
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                {unassignedStudents.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {unassignedStudents.map((student) => (
                                            <li key={student.student_id} className="py-3 flex justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-gray-900">{student.student_name}</p>
                                                        <p className="text-sm text-gray-500">Niveau: {student.student_level}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">Tous les étudiants ont été affectés avec succès</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Projets sans étudiants */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 bg-amber-50">
                                <h3 className="text-lg font-medium text-amber-700 flex items-center">
                                    <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    Projets sans étudiants ({unassignedProjects.length})
                                </h3>
                            </div>
                            <div className="px-6 py-4">
                                {unassignedProjects.length > 0 ? (
                                    <ul className="divide-y divide-gray-200">
                                        {unassignedProjects.map((project) => (
                                            <li key={project.project_id} className="py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{project.project_title}</p>
                                                        <p className="text-sm text-gray-500">{project.project_code} • Superviseur: {project.supervisor}</p>
                                                    </div>
                                                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                        Réaffecter
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">Tous les projets ont au moins un étudiant assigné</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun projet disponible</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucun projet n'a été trouvé pour l'affectation.</p>
                </div>
            )}
        </div>
    );
}
