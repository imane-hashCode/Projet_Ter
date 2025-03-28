import React, { useState }from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SupervisorNavBar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    // Remplacez par le vrai username de l'utilisateur (depuis le contexte, props ou localStorage)
    const { user, signOut } = useAuth();
    const username = user ? user.username : 'Guest'; 

    const handleLogout = () => {
        signOut
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
            <nav className="bg-gray-800 w-full">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex flex-1 items-center justify-start">
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    <Link 
                                        to="/projects_listes" 
                                        className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                        aria-current="page"
                                    >
                                        Projets
                                    </Link>
                                    <Link 
                                        to="#" 
                                        className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
                                    >
                                        Groupes
                                    </Link>
                                </div>
                            </div>
                        </div>
    
                        {/* Menu utilisateur à droite */}
                        <div className="relative ml-3">
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="flex items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                >
                                    <span className="sr-only">Ouvrir le menu utilisateur</span>
                                    <span className="mr-2 hidden md:inline text-sm font-medium text-gray-300">
                                        {username}
                                    </span>
                                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </button>
                            </div>
    
                            {/* Menu déroulant */}
                            {isMenuOpen && (
                                <div 
                                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu-button"
                                >
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Mon profil
                                    </a>
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Paramètres
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
};

export default SupervisorNavBar;