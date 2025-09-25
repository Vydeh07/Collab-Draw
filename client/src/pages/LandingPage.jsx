import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <header className="flex justify-between items-center p-6 md:p-8 bg-slate-900/50 backdrop-blur-md shadow-md">
                <h1 className="text-3xl font-extrabold tracking-tight text-white">COLLAB-DRAW</h1>
                <nav className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-lg font-semibold border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-500 text-white transition-colors duration-300"
                    >
                        Sign Up
                    </Link>
                </nav>
            </header>

            <main className="flex-grow flex items-center justify-center text-center p-6">
                <div className="max-w-2xl flex flex-col items-center gap-8 bg-slate-800/70 backdrop-blur-md rounded-3xl p-10 shadow-2xl">
                    <Edit size={80} className="text-sky-400 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                        The Real-time Collaborative Whiteboard
                    </h2>
                    <p className="text-slate-300 text-lg md:text-xl">
                        Unleash your team's creativity with a shared digital canvas. Draw, sketch, and brainstorm together, from anywhere in the world.
                    </p>
                    <Link
                        to="/signup"
                        className="px-10 py-4 text-lg rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-500 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Get Started Now
                    </Link>
                </div>
            </main>
        </div>
    );
}
