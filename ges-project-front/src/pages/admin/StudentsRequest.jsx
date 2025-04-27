import React, { useEffect, useState } from "react";
import { FiUser, FiCheck, FiX, FiClock, FiAlertCircle, FiChevronRight } from "react-icons/fi";
import api from "../../api/axios";

const StudentsRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get("/change-requests/");
                setRequests(res.data);
            } catch (err) {
                setError(err.response?.data?.message || "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true' || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDark);
    }, []);

    const handleAction = async (id, status) => {
        try {
            await api.put(`/change-requests/${id}/`, { status });
            setRequests(prev => prev.filter(r => r.id !== id));
            // Vous pourriez ajouter un toast de confirmation ici
        } catch (err) {
            alert(`Erreur: ${err.response?.data?.message || "Action échouée"}`);
        }
    };

    const pendingRequests = requests.filter(r => r.status === "pending");

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen ${darkMode ? 'dark' : ''}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-screen ${darkMode ? 'dark' : ''}`}>
                <div className={`p-6 rounded-lg max-w-md text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 dark:text-red-400" />
                    <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Erreur de chargement</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className={`mt-4 px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Demandes en attente
                        </h1>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {pendingRequests.length} demande{pendingRequests.length !== 1 ? 's' : ''} à traiter
                        </p>
                    </div>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label={darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                {/* Content */}
                {pendingRequests.length === 0 ? (
                    <div className={`rounded-lg p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                        <FiClock className={`mx-auto h-10 w-10 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                        <h3 className={`mt-3 text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            Aucune demande en attente
                        </h3>
                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Toutes les demandes ont été traitées
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map(request => (
                            <RequestCard 
                                key={request.id}
                                request={request}
                                onApprove={() => handleAction(request.id, "approved")}
                                onReject={() => handleAction(request.id, "rejected")}
                                darkMode={darkMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const RequestCard = ({ request, onApprove, onReject, darkMode }) => {
    return (
        <div className={`rounded-lg shadow overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-500'}`}>
                        <FiUser className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {request.student}
                        </h3>
                        <div className="mt-2 space-y-2">
                            <RequestDetail 
                                label="Projet" 
                                current={request.current_project_title} 
                                desired={request.desired_project_title}
                                darkMode={darkMode}
                            />
                            <RequestDetail 
                                label="Équipe" 
                                current={request.current_team_name} 
                                desired={request.desired_team_name}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>
                </div>

                {request.reason && (
                    <div className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className="font-medium">Motif :</span> {request.reason}
                        </p>
                    </div>
                )}
            </div>

            <div className={`px-4 py-3 flex justify-end space-x-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    onClick={onReject}
                    className={`px-4 py-2 rounded-md flex items-center ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                    <FiX className="mr-2" />
                    Rejeter
                </button>
                <button
                    onClick={onApprove}
                    className={`px-4 py-2 rounded-md flex items-center ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                    <FiCheck className="mr-2" />
                    Approuver
                </button>
            </div>
        </div>
    );
};

const RequestDetail = ({ label, current, desired, darkMode }) => (
    <div className="flex items-center text-sm">
        <span className={`font-medium w-20 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {label}:
        </span>
        <div className="flex-1 flex items-center">
            <span className={`line-clamp-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {current || "Non spécifié"}
            </span>
            <FiChevronRight className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`font-medium line-clamp-1 ${desired ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {desired || "Non spécifié"}
            </span>
        </div>
    </div>
);

export default StudentsRequest;