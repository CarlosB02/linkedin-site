"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Lock, Sparkles, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	checkGenerationStatus,
	finalizeGeneration,
	generateImage,
	getCredits,
} from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import LoginModal from "./LoginModal";
import ResultView from "./ResultView";

export default function UploadZone() {
	const { data: session } = authClient.useSession();
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [style, setStyle] = useState("formal");
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [result, setResult] = useState<{ id: string; image: string } | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [credits, setCredits] = useState(0);

	useEffect(() => {
		if (session) {
			setCredits((session.user as any).credits || 0);
			getCredits().then(setCredits);
		}
	}, [session]);

	const loadingMessages = [
		"Analyzing facial features...",
		"Optimizing lighting...",
		"Trying on different outfits...",
		"Adjusting pose...",
		"Perfecting smile...",
		"Enhancing resolution...",
		"Finalizing your professional photo...",
	];

	const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isUploading) {
			interval = setInterval(() => {
				setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
			}, 2500);
		} else {
			setLoadingMsgIndex(0);
		}
		return () => clearInterval(interval);
	}, [isUploading]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const selectedFile = e.dataTransfer.files[0];
			setFile(selectedFile);
			setPreviewUrl(URL.createObjectURL(selectedFile));
		}
	};

	const clearFile = () => {
		setFile(null);
		setPreviewUrl(null);
	};

	const handleSubmit = async () => {
		// If logged in, check credits
		if (session) {
			if (credits < 30) {
				document
					.getElementById("pricing")
					?.scrollIntoView({ behavior: "smooth" });
				setError("Insufficient credits. Please top up below.");
				return;
			}
		}

		if (!file) return;

		setIsUploading(true);
		setProgress(10);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("image", file);
			formData.append("style", style);

			const { predictionId } = await generateImage(formData);

			// Poll for status
			const interval = setInterval(async () => {
				const status = await checkGenerationStatus(predictionId);
				if (status.status === "succeeded") {
					clearInterval(interval);
					setProgress(90);

					// Finalize (Blur & Save)
					const final = await finalizeGeneration(
						predictionId,
						status.output as string,
					);
					setResult({ id: final.generationId, image: final.blurredImage });

					setIsUploading(false);
					setProgress(100);
				} else if (status.status === "failed") {
					clearInterval(interval);
					setError("Generation failed. Please try again.");
					setIsUploading(false);
				} else {
					setProgress((prev) => Math.min(prev + 10, 80));
				}
			}, 2000);
		} catch (e: any) {
			console.error(e);
			setError(e.message || "Something went wrong.");
			setIsUploading(false);
		}
	};

	if (result) {
		return (
			<ResultView
				resultUrl={result.image}
				originalImage={previewUrl!}
				generationId={result.id}
				onReset={() => {
					setResult(null);
					clearFile();
				}}
			/>
		);
	}

	const styles = [
		{
			id: "formal",
			label: "Formal",
			desc: "Suit & Tie",
			img: "/images/styles/formal.png",
		},
		{
			id: "smart-casual",
			label: "Smart Casual",
			desc: "Polished but relaxed",
			img: "/images/styles/smart-casual.jpg",
		},
		{
			id: "creative",
			label: "Creative",
			desc: "Artistic & Bold",
			img: "/images/styles/creative.png",
		},
	];

	return (
		<>
			<div
				id="upload-zone"
				className="w-full max-w-4xl mx-auto p-1 scroll-mt-24"
			>
				{/* Animated Gradient Border Container */}
				<div className="relative rounded-3xl p-[2px] overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-xy opacity-75 blur-sm"></div>

					<div className="relative bg-white rounded-3xl p-8 shadow-2xl">
						<h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
							Create Your{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
								Professional Photo
							</span>
						</h2>

						{/* Style Selection */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
							{styles.map((s) => (
								<button
									key={s.id}
									onClick={() => setStyle(s.id)}
									className={`relative group overflow-hidden rounded-xl border-2 transition-all text-left ${
										style === s.id
											? "border-blue-500 ring-2 ring-blue-200"
											: "border-gray-200 hover:border-blue-300"
									}`}
								>
									<div className="flex items-center gap-4 p-3">
										<div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
											{/* Replace with actual preview images */}
											<img
												src={s.img}
												alt={s.label}
												className="w-full h-full object-cover"
											/>
										</div>
										<div>
											<div className="font-bold text-gray-900">{s.label}</div>
											<div className="text-xs text-gray-500">{s.desc}</div>
										</div>
									</div>
									{style === s.id && (
										<div className="absolute top-2 right-2 text-blue-500">
											<Check className="w-5 h-5" />
										</div>
									)}
								</button>
							))}
						</div>

						{/* Main Interaction Area */}
						<div className="flex flex-col md:flex-row items-stretch gap-8">
							{/* Left: Upload / Preview */}
							<div
								className={`flex-1 w-full transition-all duration-500 ${file ? "md:w-1/2" : "w-full"}`}
							>
								{!file ? (
									<div
										onDragOver={(e) => e.preventDefault()}
										onDrop={handleDrop}
										className="relative border-2 border-dashed border-gray-300 rounded-2xl p-6 md:p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer h-full flex flex-col items-center justify-center min-h-[200px] md:min-h-[300px]"
									>
										<input
											type="file"
											onChange={handleFileChange}
											className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
											accept="image/*"
										/>
										<div className="bg-blue-100 p-4 rounded-full mb-4">
											<Upload className="w-8 h-8 text-blue-600" />
										</div>
										<p className="text-lg font-bold text-gray-700">
											Upload your selfie
										</p>
										<p className="text-sm text-gray-500 mt-2">JPG or PNG</p>
									</div>
								) : (
									<div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 group h-full">
										<img
											src={previewUrl!}
											alt="Preview"
											className="w-full h-48 md:h-64 object-cover"
										/>
										<button
											onClick={clearFile}
											className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white text-gray-700 transition-colors"
										>
											<X className="w-5 h-5" />
										</button>
										<div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-sm backdrop-blur-sm">
											Original Photo
										</div>
									</div>
								)}
							</div>

							{/* Middle: Animation (Only if file present) */}
							<AnimatePresence>
								{file && (
									<motion.div
										initial={{ opacity: 0, scale: 0.5 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.5 }}
										className="flex items-center justify-center"
									>
										<div className="relative">
											<div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
											<ArrowRight className="w-10 h-10 text-blue-500 animate-pulse" />
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Right: Generate Action (Only if file present) */}
							<AnimatePresence>
								{file && (
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										className="flex-1 w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100"
									>
										<div className="text-center mb-6">
											<h3 className="text-xl font-bold text-gray-800 mb-2">
												Ready to transform?
											</h3>
											<p className="text-gray-500 text-sm">
												We'll generate a high-quality{" "}
												{styles.find((s) => s.id === style)?.label} headshot for
												you.
											</p>
										</div>

										{isUploading ? (
											<div className="w-full">
												<div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
													<span>Generating...</span>
													<span>{progress}%</span>
												</div>
												<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden relative">
													<motion.div
														className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
														initial={{ width: "0%" }}
														animate={{ width: `${progress}%` }}
														transition={{ duration: 0.5 }}
													/>
												</div>
												<p className="text-xs text-center mt-3 text-gray-500 animate-pulse font-medium">
													{loadingMessages[loadingMsgIndex]}
												</p>
											</div>
										) : (
											<button
												onClick={handleSubmit}
												className="relative group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden"
											>
												<div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 skew-x-12 -translate-x-full"></div>
												<div className="flex items-center justify-center gap-2 relative z-10">
													<Sparkles className="w-5 h-5 animate-pulse" />
													Generate Headshot
												</div>
											</button>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						{error && (
							<div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium border border-red-100 animate-shake">
								{error}
							</div>
						)}
					</div>
				</div>
			</div>
			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
		</>
	);
}
