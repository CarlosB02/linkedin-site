"use client";

import { useEffect, useState } from "react";
import { getUserGenerations } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import { Lock, FileText, X } from "lucide-react";

export default function Gallery() {
    const { data: session } = authClient.useSession();
    const [generations, setGenerations] = useState<any[]>([]);
    const [isAllGenerationsOpen, setIsAllGenerationsOpen] = useState(false);

    useEffect(() => {
        if (session) {
            getUserGenerations().then(setGenerations);
        }
    }, [session]);

    if (!session || generations.length === 0) return null;

    return (
        <div className="w-full max-w-6xl mx-auto px-6 pt-12 pb-6">
            <h2 className="text-2xl font-bold mb-6">Your Recent Generations</h2>
            {/* Desktop View (4 items) */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4">
                {generations.slice(0, 4).map((gen) => (
                    <div key={gen.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={gen.image}
                            alt="Generated"
                            className={`w-full h-full object-cover ${!gen.unlocked ? "blur-sm" : ""}`}
                        />
                        {!gen.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {generations.length > 4 && (
                    <button
                        onClick={() => setIsAllGenerationsOpen(true)}
                        className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-600 group-hover:text-blue-600">View All</span>
                        <span className="text-xs text-gray-400">({generations.length - 4} more)</span>
                    </button>
                )}
            </div>

            {/* Mobile View (3 items) */}
            <div className="md:hidden grid grid-cols-2 gap-4">
                {generations.slice(0, 3).map((gen) => (
                    <div key={gen.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={gen.image}
                            alt="Generated"
                            className={`w-full h-full object-cover ${!gen.unlocked ? "blur-sm" : ""}`}
                        />
                        {!gen.unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {generations.length > 3 && (
                    <button
                        onClick={() => setIsAllGenerationsOpen(true)}
                        className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-600 group-active:text-blue-600">View All</span>
                        <span className="text-xs text-gray-400">({generations.length - 3} more)</span>
                    </button>
                )}
            </div>

            {/* All Generations Modal */}
            {isAllGenerationsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold">All Generations ({generations.length})</h3>
                            <button
                                onClick={() => setIsAllGenerationsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {generations.map((gen) => (
                                    <div key={gen.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={gen.image}
                                            alt="Generated"
                                            className={`w-full h-full object-cover ${!gen.unlocked ? "blur-sm" : ""}`}
                                        />
                                        {!gen.unlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
