"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	BookOpen,
	Clock,
	Image as ImageIcon,
	ShieldCheck,
	Target,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import BackgroundGrid from "@/components/BackgroundGrid";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

export default function AboutPage() {
	const t = useTranslations("About");
	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="bg-[#ecf6ff] min-h-screen">
			{/* Hero Section */}
			<section className="relative pt-12 pb-16 px-6 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
					<BackgroundGrid />
				</div>
				<div className="absolute inset-0 bg-blue-50/50 -z-10" />
				<div className="max-w-4xl mx-auto text-center mt-4">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeIn}
						transition={{ duration: 0.6 }}
					>
						<div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100 text-blue-700 font-bold text-sm tracking-wide uppercase">
							{t("hero.badge")}
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
							{t("hero.titlePrefix")}{" "}
							<span className="text-blue-600">{t("hero.titleHighlight")}</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							{t("hero.subtitle")}
						</p>
					</motion.div>
				</div>
			</section>

			{/* Mission & What is Polly Section */}
			<section className="py-12 px-6">
				<div className="max-w-5xl mx-auto space-y-24">
					{/* Mission */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl font-bold mb-6 text-gray-900">
								{t("mission.title")}
							</h2>
							<p className="text-gray-600 text-lg mb-6 leading-relaxed">
								{t("mission.p1")}
							</p>
							<p className="text-gray-600 text-lg mb-6 leading-relaxed">
								{t("mission.p2")}
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="hidden md:block relative"
						>
							{/* Abstract Tech Visualization */}
							<div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 p-8 flex items-center justify-center relative shadow-2xl">
								<div
									className="absolute inset-0 opacity-20"
									style={{
										backgroundImage:
											"radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
										backgroundSize: "32px 32px",
									}}
								></div>
								<div className="relative z-10 w-full h-full border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-6 p-6 backdrop-blur-sm bg-white/5">
									<div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
										{t("mission.cardTitle")}
									</div>
									<div className="w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0"></div>
									<div className="text-gray-400 text-sm tracking-widest uppercase font-bold">
										{t("mission.cardSubtitle")}
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* What is Polly */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl font-bold mb-6 text-gray-900">
								{t("product.title")}
							</h2>
							<p className="text-gray-600 text-lg mb-4 leading-relaxed">
								{t("product.p1")}
							</p>
							<p className="text-gray-600 text-lg leading-relaxed">
								{t("product.p2")}
							</p>
						</motion.div>
						<div className="order-first md:order-last flex items-center justify-center">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="relative w-full max-w-sm"
							>
								<NextImage
									src="/polly-logo.png"
									alt="Polly"
									width={400}
									height={133}
									className="w-full h-auto drop-shadow-2xl"
								/>
							</motion.div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section (Restored) */}
			<section className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl font-bold text-gray-900">{t("values.title")}</h2>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: Users,
								title: t("values.v1Title"),
								desc: t("values.v1Desc"),
							},
							{
								icon: Target,
								title: t("values.v2Title"),
								desc: t("values.v2Desc"),
							},
							{
								icon: ShieldCheck,
								title: t("values.v3Title"),
								desc: t("values.v3Desc"),
							},
						].map((item, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: idx * 0.2 }}
								className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50 hover:-translate-y-1 transition-transform"
							>
								<div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
									<item.icon className="w-6 h-6" />
								</div>
								<h3 className="text-xl font-bold mb-3">{item.title}</h3>
								<p className="text-gray-500">{item.desc}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Our Other Solutions */}
			<section id="outros-servicos" className="py-24 px-6 bg-[#0f172a] relative overflow-hidden text-white">
				{/* Background Lines */}
				<div className="absolute inset-0 opacity-10 pointer-events-none">
					<svg
						className="h-full w-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
					>
						<path
							d="M0 100 C 20 0 50 0 100 100 Z"
							fill="none"
							stroke="white"
							strokeWidth="0.5"
						/>
						<path
							d="M0 100 C 50 0 80 0 100 100 Z"
							fill="none"
							stroke="white"
							strokeWidth="0.5"
							opacity="0.5"
						/>
					</svg>
				</div>

				<div className="max-w-6xl mx-auto relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							{t("otherSolutions.title")}
						</h2>
						<p className="text-blue-200 text-xl max-w-2xl mx-auto">
							{t("otherSolutions.subtitle")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Solution 1: Image Restoration */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 transition-all"
						>
							<div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
								<ImageIcon className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">{t("otherSolutions.s1Title")}</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								{t("otherSolutions.s1Desc")}
							</p>
							<span className="flex items-center gap-1.5 whitespace-nowrap text-gray-400 font-semibold text-xs bg-gray-700/60 px-3 py-1.5 rounded-full w-fit">
								<Clock className="w-3.5 h-3.5 flex-shrink-0" />
								{t("otherSolutions.comingSoon")}
							</span>
						</motion.div>

						{/* Solution 2: Study Assistant */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 transition-all"
						>
							<div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
								<BookOpen className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">{t("otherSolutions.s2Title")}</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								{t("otherSolutions.s2Desc")}
							</p>
							<span className="flex items-center gap-1.5 whitespace-nowrap text-gray-400 font-semibold text-xs bg-gray-700/60 px-3 py-1.5 rounded-full w-fit">
								<Clock className="w-3.5 h-3.5 flex-shrink-0" />
								{t("otherSolutions.comingSoon")}
							</span>
						</motion.div>

						{/* Solution 3: Image Creation */}
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 transition-all"
						>
							<div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6">
								<Zap className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">{t("otherSolutions.s3Title")}</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								{t("otherSolutions.s3Desc")}
							</p>
							<span className="flex items-center gap-1.5 whitespace-nowrap text-gray-400 font-semibold text-xs bg-gray-700/60 px-3 py-1.5 rounded-full w-fit">
								<Clock className="w-3.5 h-3.5 flex-shrink-0" />
								{t("otherSolutions.comingSoon")}
							</span>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	);
}
