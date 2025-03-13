import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(credentials);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            setError("Identifiants incorrects. Veuillez réessayer.");
        }
    };

    return (

        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 border bg-white dark:bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <div className="mb-4 p-2 text-sm text-center text-red-600 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200">
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label for="username" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">Email address</label>
                        <div className="mt-2">
                            <input type="text" placeholder="Nom d'utilisateur" name="username" id="username" autocomplete="username" required
                                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <label for="password" className="block text-sm/6 font-medium text-gray-900 dark:text-gray-100">Password</label>
                        </div>
                        <div className="mt-2">
                            <input type="password" placeholder='Mot de passe' name="password" id="password" autocomplete="current-password" required
                                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:focus:outline-indigo-500 sm:text-sm/6"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500">Sign in</button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default Login;