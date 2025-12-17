"use client";

import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

export default function BeforeAfterSection() {
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

    const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
        if (!isResizing || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0]; // Get the first touch point
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        setPosition(Math.min(Math.max(x, 0), 100));
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove as any);
            window.addEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove as any);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <section className="pt-6 pb-20">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                    Até a tua melhor foto pode ficar ainda melhor!
                </h2>

                <div className="w-full max-w-4xl mx-auto">
                    <div
                        ref={containerRef}
                        className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-2xl"
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        {/* After Image (Background) - Professional Woman */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: 'url("/images/after.jpg")',
                            }}
                        />
                        <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-sm font-bold text-white z-20">
                            AFTER
                        </div>

                        {/* Before Image (Clipped) - Casual/Messy Woman */}
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat border-r-4 border-white"
                            style={{
                                clipPath: `inset(0 ${100 - position}% 0 0)`,
                                backgroundImage: 'url("/images/before.jpg")',
                            }}
                        >
                            <div className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-sm font-bold text-white z-20">
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
            </div>
        </section>
    );
}
