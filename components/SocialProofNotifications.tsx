"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const notifications = [
	{
		name: "Maria S.",
		action: "generated a new headshot",
		time: "Just now",
		img: "https://i.pravatar.cc/150?u=1",
	},
	{
		name: "João P.",
		action: "purchased the Entrepreneur Plan",
		time: "2 mins ago",
		img: "https://i.pravatar.cc/150?u=2",
	},
	{
		name: "Sarah L.",
		action: "unlocked high quality photos",
		time: "5 mins ago",
		img: "https://i.pravatar.cc/150?u=3",
	},
	{
		name: "Carlos M.",
		action: "generated 5 creative styles",
		time: "1 min ago",
		img: "https://i.pravatar.cc/150?u=4",
	},
	{
		name: "Ana R.",
		action: "improved her profile score",
		time: "Just now",
		img: "https://i.pravatar.cc/150?u=5",
	},
];

export default function SocialProofNotifications() {
	const [isVisible, setIsVisible] = useState(false);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const show = () => {
			setIsVisible(true);
			timeoutId = setTimeout(() => {
				setIsVisible(false);
				const gap = Math.random() * 3000 + 1000; // 1-4s gap
				timeoutId = setTimeout(() => {
					setIndex((prev) => (prev + 1) % notifications.length);
					show();
				}, gap);
			}, 4000); // Show for 4s
		};

		// Start after a small delay
		timeoutId = setTimeout(show, 2000);

		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<div className="fixed bottom-4 left-4 z-50 pointer-events-none">
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="bg-white p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-3 max-w-sm pointer-events-auto"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={notifications[index].img}
							alt={notifications[index].name}
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div>
							<p className="text-sm font-bold text-gray-800">
								{notifications[index].name}{" "}
								<span className="font-normal text-gray-500">
									{notifications[index].action}
								</span>
							</p>
							<p className="text-xs text-gray-400">
								{notifications[index].time}
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
