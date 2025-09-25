import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Header } from '../components/Header';

export function DashboardPage() {
    const [roomSlug, setRoomSlug] = useState('');
    const navigate = useNavigate();

    const handleEnterRoom = async (e) => {
        e.preventDefault();
        if (!roomSlug) return;
        const friendlySlug = roomSlug.toLowerCase().replace(/\s+/g, '-');

        try {
            await api.post('/rooms', { slug: friendlySlug });
            navigate(`/room/${friendlySlug}`);
        } catch (error) {
            if (error.response && error.response.data.message === 'Room already exists with this name') {
                navigate(`/room/${friendlySlug}`);
            } else {
                console.error('Failed to create or join room', error);
                alert('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            <Header />
            <div className="flex flex-1 justify-center items-center px-4">
                <form
                    onSubmit={handleEnterRoom}
                    className="w-full max-w-lg bg-slate-800/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col gap-8"
                >
                    <h2 className="text-3xl font-extrabold text-center text-white tracking-tight">
                        Create or Join a Room
                    </h2>
                    <input
                        type="text"
                        value={roomSlug}
                        onChange={(e) => setRoomSlug(e.target.value)}
                        placeholder="Enter Room Name"
                        required
                        className="w-full bg-slate-700/80 text-white p-4 rounded-xl border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-500 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        Enter Room
                    </button>
                    
                </form>
            </div>
        </div>
    );
}
