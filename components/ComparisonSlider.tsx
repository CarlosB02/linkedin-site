"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

export default function ComparisonSlider({ beforeImage, afterImage }: { beforeImage: string, afterImage: string }) {
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default to avoid potential text selection or unexpected drag behavior
        // But checking if it's touch to avoid preventing scroll if necessary? 
        // Actually for the slider, we want to prevent scroll while dragging usually.
        setIsResizing(true);
    };

    const handleMouseUp = () => setIsResizing(false);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(Math.max(x, 0), 100));
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(Math.max(x, 0), 100));
    };

    useEffect(() => {
        // Global listeners for dragging behavior
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("touchend", handleMouseUp);

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove, { passive: false }); // passive: false to allow preventing default if we added it, but here just listening
        }

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [isResizing]);

    return (
        <div className="w-full max-w-md mx-auto mt-16 mb-0">
            <h2 className="text-3xl font-bold text-center mb-8">See the Difference</h2>
            <div
                ref={containerRef}
                className="relative w-full rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl group"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* After Image (Base) - Controls Height */}
                <img
                    src={afterImage}
                    alt="After"
                    className="w-full h-auto block select-none pointer-events-none"
                    draggable={false}
                />
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-blue-600 z-20">
                    AFTER
                </div>

                {/* Before Image (Overlay) - Clipped */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        clipPath: `inset(0 ${100 - position}% 0 0)`,
                    }}
                >
                    <img
                        src={beforeImage}
                        alt="Before"
                        className="w-full h-full object-cover select-none pointer-events-none"
                        draggable={false}
                    />
                    <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-sm font-bold text-white">
                        BEFORE
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30 flex items-center justify-center transition-opacity hover:opacity-100"
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
