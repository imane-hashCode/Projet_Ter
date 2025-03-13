import React from 'react';
import { Link } from 'react-router-dom';

const StudentNavBar = () => {
    return (
        <nav className="bg-gray-800 w-full">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        {/* <div class="flex shrink-0 items-center">
                            <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company">
                        </div> */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link to="/projects" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">
                                    Projets
                                </Link>
                                <Link to="/voeux" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">
                                    Voeux
                                </Link>                               
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Team</a>
                                <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</a>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default StudentNavBar;