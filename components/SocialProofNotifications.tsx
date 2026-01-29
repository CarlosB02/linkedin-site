"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useUI } from "@/lib/ui-context";

export default function SocialProofNotifications() {
	const t = useTranslations("SocialProofNotifications");
	const [isVisible, setIsVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const { isLoginModalOpen } = useUI();

	const notifications = [
		{
			name: "Maria S.",
			action: t("notifications.0.action"),
			time: t("notifications.0.time"),
			img: "https://i.pravatar.cc/150?u=1",
		},
		{
			name: "João P.",
			action: t("notifications.1.action"),
			time: t("notifications.1.time"),
			img: "https://i.pravatar.cc/150?u=2",
		},
		{
			name: "Sarah L.",
			action: t("notifications.2.action"),
			time: t("notifications.2.time"),
			img: "https://i.pravatar.cc/150?u=3",
		},
		{
			name: "Carlos M.",
			action: t("notifications.3.action"),
			time: t("notifications.3.time"),
			img: "https://i.pravatar.cc/150?u=4",
		},
		{
			name: "Ana R.",
			action: t("notifications.4.action"),
			time: t("notifications.4.time"),
			img: "https://i.pravatar.cc/150?u=5",
		},
	];

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
	}, [notifications.length]);

	return (
		<div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-4 z-50 pointer-events-none flex justify-center md:block">
			<AnimatePresence>
				{isVisible && !isLoginModalOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="bg-white p-3 md:p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-2 md:gap-3 max-w-full md:max-w-sm pointer-events-auto"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={notifications[index].img}
							alt={notifications[index].name}
							className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shrink-0"
						/>
						<div>
							<p className="text-xs md:text-sm font-bold text-gray-800 line-clamp-2">
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
