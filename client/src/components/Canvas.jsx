import React, { useRef, useEffect, useState } from 'react';
import { Pencil, RectangleHorizontal, Circle, Eraser } from 'lucide-react';
import { Game } from '../lib/Game';

function Topbar({ selectedTool, setSelectedTool }) {
    const tools = [
        { name: 'pencil', icon: <Pencil size={20} /> },
        { name: 'rect', icon: <RectangleHorizontal size={20} /> },
        { name: 'circle', icon: <Circle size={20} /> },
        { name: 'eraser', icon: <Eraser size={20} /> }, // smaller icon for consistency
    ];
    
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-md p-2 rounded-xl shadow-xl flex items-center gap-3 z-50">
            {tools.map(tool => {
                const isActive = selectedTool === tool.name;
                return (
                    <button
                        key={tool.name}
                        onClick={() => setSelectedTool(tool.name)}
                        className={`p-2 rounded-lg text-white transition-colors duration-200 flex items-center justify-center ${
                            isActive ? 'bg-sky-500 shadow-lg' : 'hover:bg-slate-700'
                        }`}
                        title={tool.name.charAt(0).toUpperCase() + tool.name.slice(1)}
                    >
                        {tool.icon}
                    </button>
                );
            })}
        </div>
    );
}

export function Canvas({ roomId, socket }) {
    const canvasRef = useRef(null);
    const [game, setGame] = useState(null);
    const [selectedTool, setSelectedTool] = useState('pencil');

    // Update game tool when user changes selection
    useEffect(() => {
        if (game) game.setTool(selectedTool);
    }, [selectedTool, game]);

    // Initialize the Game instance
    useEffect(() => {
        if (canvasRef.current && socket) {
            const canvasContainer = canvasRef.current.parentElement;
            const g = new Game(canvasRef.current, canvasContainer, roomId, socket);
            setGame(g);

            return () => g.destroy(); // clean up listeners
        }
    }, [canvasRef, socket, roomId]);

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-slate-900">
            <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                className="block"
            />
        </div>
    );
}
