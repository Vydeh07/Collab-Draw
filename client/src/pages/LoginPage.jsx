import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-slate-800/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col gap-8"
            >
                <h2 className="text-3xl font-extrabold text-center text-white tracking-tight">
                    Login
                </h2>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full bg-slate-700/80 text-white p-4 rounded-xl border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-slate-700/80 text-white p-4 rounded-xl border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                />

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-sky-500 transition-all duration-300"
                >
                    Login
                </button>

                <p className="text-center text-slate-400">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
