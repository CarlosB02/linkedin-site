"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SocialProof() {
    const testimonials = [
        {
            name: "Sarah J.",
            role: "Marketing Manager",
            text: "I got 3 job offers within a week of updating my profile photo. The ROI is insane!",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        },
        {
            name: "David M.",
            role: "Software Engineer",
            text: "Recruiters started reaching out to me way more often. It looks so professional.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        },
        {
            name: "Jessica T.",
            role: "Freelancer",
            text: "My clients take me more seriously now. Best 5€ I ever spent.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate for mobile
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className="w-full bg-gray-50 py-16" id="testimonials">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    Trusted by Professionals Who Got Hired
                </h2>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} t={t} />
                    ))}
                </div>

                {/* Mobile Carousel */}
                <div className="md:hidden relative max-w-sm mx-auto">
                    <div className="overflow-hidden py-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TestimonialCard t={testimonials[currentIndex]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button onClick={prev} className="absolute top-1/2 -left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 z-10">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 z-10">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xl font-semibold text-blue-800">
                        🚀 87% of users reported getting more profile views within 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
}

function TestimonialCard({ t }: { t: any }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex items-center gap-4 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                </div>
            </div>
            <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-gray-700 italic">"{t.text}"</p>
        </div>
    );
}
