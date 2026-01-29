"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function SocialProof() {
	const t = useTranslations("SocialProof");

	const testimonials = [
		{
			name: "Sarah J.",
			role: t("t1_role"),
			text: t("t1_text"),
			image:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
		},
		{
			name: "David M.",
			role: t("t2_role"),
			text: t("t2_text"),
			image:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
		},
		{
			name: "Jessica T.",
			role: t("t3_role"),
			text: t("t3_text"),
			image:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
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

	const next = () =>
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	const prev = () =>
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length,
		);

	return (
		<div className="w-full bg-gray-50 py-16" id="testimonials">
			<div className="max-w-6xl mx-auto px-6">
				<h2 className="text-2xl font-bold text-center mb-12">
					{t("title")}
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

					<button
						onClick={prev}
						className="absolute top-1/2 -left-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 z-10"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>
					<button
						onClick={next}
						className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-50 z-10"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>

				<div className="mt-12 text-center">
					<p className="text-xl font-semibold text-blue-800">
						{t("stats")}
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
				<img
					src={t.image}
					alt={t.name}
					className="w-12 h-12 rounded-full object-cover"
				/>
				<div>
					<div className="font-bold">{t.name}</div>
					<div className="text-sm text-gray-500">{t.role}</div>
				</div>
			</div>
			<div className="flex text-yellow-400 mb-2">
				{[...Array(5)].map((_, i) => (
					<Star key={i} className="w-4 h-4 fill-current" />
				))}
			</div>
			<p className="text-gray-700 italic">"{t.text}"</p>
		</div>
	);
}
