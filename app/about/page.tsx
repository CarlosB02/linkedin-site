"use client";

import { motion } from "framer-motion";
import {
	ArrowRight,
	BookOpen,
	Image as ImageIcon,
	ShieldCheck,
	Target,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function AboutPage() {
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
							Part of .gen group
						</div>
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
							Building the Future with{" "}
							<span className="text-blue-600">Artificial Intelligence</span>
						</h1>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
							We produce cutting-edge digital solutions integrated with AI.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Mission & What is LinkedInGen Section */}
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
								Driven by Evolution
							</h2>
							<p className="text-gray-600 text-lg mb-6 leading-relaxed">
								At <strong>.gen group</strong>, our mission goes beyond just
								building websites. We are dedicated to creating intelligent
								digital ecosystems that adapt and grow.
							</p>
							<p className="text-gray-600 text-lg mb-6 leading-relaxed">
								We want to give the best to our clients by integrating the
								latest advancements in Artificial Intelligence into intuitive,
								user-friendly products. We are in constant evolution, just like
								the technology we use.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="relative"
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
										.GEN
									</div>
									<div className="w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0"></div>
									<div className="text-gray-400 text-sm tracking-widest uppercase font-bold">
										Intelligence Integrated
									</div>
								</div>
							</div>
						</motion.div>
					</div>

					{/* What is LinkedInGen */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<h2 className="text-3xl font-bold mb-6 text-gray-900">
								What is LinkedInGen?
							</h2>
							<p className="text-gray-600 text-lg mb-4 leading-relaxed">
								LinkedInGen is our specialized solution for professional
								branding. We noticed that many talented professionals miss
								opportunities simply because they lack a high-quality profile
								photo.
							</p>
							<p className="text-gray-600 text-lg leading-relaxed">
								We combined advanced generative AI with professional photography
								principles to create a tool that turns everyday selfies into
								studio-grade headshots in minutes.
							</p>
						</motion.div>
						<div className="order-first md:order-last">
							{/* Placeholder for LinkedInGen UI visual or similar */}
							<div className="bg-white rounded-3xl shadow-xl p-6 rotate-2 hover:rotate-0 transition-transform duration-500 border border-blue-100">
								<div className="bg-gray-100 rounded-2xl h-64 w-full flex items-center justify-center text-gray-400 font-bold">
									Product Visual
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section (Restored) */}
			<section className="py-20 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold text-gray-900">Why choose us?</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: Users,
								title: "User First",
								desc: "Designed for simplicity and ease of use.",
							},
							{
								icon: Target,
								title: "Precision",
								desc: "Advanced AI models for realistic results.",
							},
							{
								icon: ShieldCheck,
								title: "Privacy",
								desc: "Your data is secure and automatically deleted.",
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
			<section className="py-24 px-6 bg-[#0f172a] relative overflow-hidden text-white">
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
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Our Other Solutions
						</h2>
						<p className="text-blue-200 text-xl max-w-2xl mx-auto">
							Explore our ecosystem of AI-powered tools designed to enhance
							productivity and creativity.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Solution 1: Image Restoration */}
						<div className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800/80 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-blue-500/30 cursor-pointer">
							<div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
								<ImageIcon className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">ChromaRestore AI</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								Bring old black & white memories back to life. Instantly
								colorize and animate vintage photos with stunning realism.
							</p>
							<div className="flex items-center text-blue-400 font-bold text-sm group-hover:gap-2 transition-all">
								Discover <ArrowRight className="w-4 h-4 ml-1" />
							</div>
						</div>

						{/* Solution 2: Study Assistant */}
						<div className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800/80 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-purple-500/30 cursor-pointer">
							<div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
								<BookOpen className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">StudyGenius</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								The ultimate AI study companion. Generate comprehensive
								summaries, flashcards, and study guides from any text or
								document.
							</p>
							<div className="flex items-center text-purple-400 font-bold text-sm group-hover:gap-2 transition-all">
								Discover <ArrowRight className="w-4 h-4 ml-1" />
							</div>
						</div>

						{/* Solution 3: Image Creation */}
						<div className="group bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 hover:bg-gray-800/80 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-yellow-500/30 cursor-pointer">
							<div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
								<Zap className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold mb-3">NanoCreativity</h3>
							<p className="text-gray-400 mb-6 leading-relaxed">
								Unleash your imagination. Generate high-fidelity images from
								text prompts with our Nano Banana Pro engine.
							</p>
							<div className="flex items-center text-yellow-400 font-bold text-sm group-hover:gap-2 transition-all">
								Discover <ArrowRight className="w-4 h-4 ml-1" />
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
