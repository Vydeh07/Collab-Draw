import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function Header() {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="flex justify-between items-center px-6 py-4 md:px-8 bg-slate-900 border-b border-slate-700 shadow-md">
            <Link to="/dashboard" className="text-2xl font-extrabold text-white no-underline hover:text-sky-400 transition-colors">
                COLLAB-DRAW
            </Link>

            <div className="flex items-center gap-4">
                {user && (
                    <span className="hidden md:block text-sm text-slate-400">
                        {user.email}
                    </span>
                )}

                <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold text-slate-900 shadow-md">
                    {user ? user.name.charAt(0).toUpperCase() : '?'}
                </div>

                <button
                    onClick={logout}
                    className="px-3 py-2 text-sm rounded-md font-semibold border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
