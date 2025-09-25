import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas } from '../components/Canvas';
import { AuthContext } from '../context/AuthContext';
import { Home } from 'lucide-react';

const WS_URL = import.meta.env.VITE_WS_URL;

export function RoomPage() {
  const { roomId } = useParams();
  const { token } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    // Append /?token= so backend can verify JWT
    const ws = new WebSocket(`${WS_URL}/?token=${token}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
      ws.send(JSON.stringify({ type: 'join_room', roomId }));
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  if (!socket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-xl font-semibold text-white">
        Connecting to the room...
      </div>
    );
  }

  return (
    <>
      <Link
        to="/dashboard"
        className="fixed top-6 right-6 z-50 text-white hover:text-sky-400 transition-colors"
      >
        <Home size={28} />
      </Link>
      <Canvas roomId={roomId} socket={socket} />
    </>
  );
}
