"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

export default function ComparisonSlider() {
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => setIsResizing(true);
    const handleMouseUp = () => setIsResizing(false);

    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(Math.max(x, 0), 100));
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="w-full max-w-4xl mx-auto my-16">
            <h2 className="text-3xl font-bold text-center mb-8">See the Difference</h2>
            <div
                ref={containerRef}
                className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
                onMouseDown={handleMouseDown}
            >
                {/* After Image (Background) */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")', // Professional man
                    }}
                />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-blue-600">
                    AFTER
                </div>

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0 bg-cover bg-center border-r-4 border-white"
                    style={{
                        clipPath: `inset(0 ${100 - position}% 0 0)`,
                        backgroundImage: 'url("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")', // Casual man
                    }}
                >
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm font-bold text-white">
                        BEFORE
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10 flex items-center justify-center"
                    style={{ left: `${position}%` }}
                >
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center -ml-4">
                        <MoveHorizontal className="w-4 h-4 text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
