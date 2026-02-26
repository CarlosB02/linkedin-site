"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useUI } from "@/lib/ui-context";

export default function SocialProofNotifications() {
	const t = useTranslations("SocialProofNotifications");
	const [isVisible, setIsVisible] = useState(false);
	const [index, setIndex] = useState(0);
	const { isLoginModalOpen } = useUI();

	const notifications = useMemo(() => {
		const userList = [
			{ name: "Maria S.", g: "female" }, { name: "João P.", g: "male" },
			{ name: "Sarah L.", g: "female" }, { name: "Carlos M.", g: "male" },
			{ name: "Ana R.", g: "female" }, { name: "Lucas B.", g: "male" },
			{ name: "Elena G.", g: "female" }, { name: "Marc D.", g: "male" },
			{ name: "Giulia T.", g: "female" }, { name: "Hans W.", g: "male" },
			{ name: "Sofia K.", g: "female" }, { name: "Dimitris P.", g: "male" },
			{ name: "Isabella F.", g: "female" }, { name: "Mateo R.", g: "male" },
			{ name: "Chloe M.", g: "female" }, { name: "Lars N.", g: "male" },
			{ name: "Antonio C.", g: "male" }, { name: "Beatrice V.", g: "female" },
			{ name: "Nikolas A.", g: "male" }, { name: "Carmen L.", g: "female" },
			{ name: "Thomas B.", g: "male" }, { name: "Inês F.", g: "female" },
			{ name: "Diego S.", g: "male" }, { name: "Clara H.", g: "female" },
			{ name: "Miguel V.", g: "male" }
		];

		const shuffledUsers = [...userList].sort(() => Math.random() - 0.5);

		return shuffledUsers.map((user, i) => {
			// Usar um ID aleatório entre 0 e 70 para garantir maior variedade de avatares
			const randomAvatarId = Math.floor(Math.random() * 70);
			return {
				name: user.name,
				action: t(
					`notifications.${Math.floor(Math.random() * 5)}.action` as any
				),
				time: `${Math.floor(Math.random() * 10) + 1}m`,
				img: `https://xsgames.co/randomusers/assets/avatars/${user.g}/${randomAvatarId}.jpg`,
			};
		});
	}, [t]);

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
