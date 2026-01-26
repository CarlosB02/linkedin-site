"use client";

import { motion } from "framer-motion";
import {
	Download,
	Eraser,
	Image as ImageIcon,
	Loader2,
	Lock,
	MessageSquare,
	RefreshCw,
	Send,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	checkGenerationStatus,
	enhanceImage,
	finalizeEnhancement,
	unlockImage,
} from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import ComparisonSlider from "./ComparisonSlider";
import LoginModal from "./LoginModal";

interface ResultViewProps {
	resultUrl: string;
	originalImage: string;
	generationId: string;
	onReset: () => void;
	initialUnlocked?: boolean;
	showComparison?: boolean;
}

export default function ResultView({
	resultUrl,
	originalImage,
	generationId,
	onReset,
	initialUnlocked = false,
	showComparison = true,
}: ResultViewProps) {
	const { data: session } = authClient.useSession();
	const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);

	useEffect(() => {
		setIsUnlocked(initialUnlocked);
	}, [initialUnlocked]);

	const [isEnhancing, setIsEnhancing] = useState(false);
	const [isUnlocking, setIsUnlocking] = useState(false);
	const [currentImage, setCurrentImage] = useState(resultUrl);
	const [currentGenerationId, setCurrentGenerationId] = useState(generationId);
	const [error, setError] = useState<string | null>(null);
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

	const loadingMessages = [
		"Applying enhancement...",
		"Refining details...",
		"Polishing the look...",
		"Almost there...",
	];

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isEnhancing) {
			interval = setInterval(() => {
				setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
			}, 2000);
		} else {
			setLoadingMsgIndex(0);
		}
		return () => clearInterval(interval);
	}, [isEnhancing]);

	const handleUnlock = async () => {
		if (!session) {
			setIsLoginOpen(true);
			return;
		}

		const credits = (session.user as any).credits || 0;
		if (credits < 30) {
			document
				.getElementById("pricing")
				?.scrollIntoView({ behavior: "smooth" });
			setError("Insufficient credits. Please top up below.");
			return;
		}

		setIsUnlocking(true);
		setError(null);
		try {
			const { originalImage } = await unlockImage(currentGenerationId);
			if (originalImage) {
				setCurrentImage(originalImage);
				setIsUnlocked(true);
			}
		} catch (e: any) {
			if (e.message && e.message.includes("User not found")) {
				alert("Session invalid. Logging out to refresh...");
				await authClient.signOut();
				window.location.reload();
			} else {
				setError(e.message || "Failed to unlock");
			}
		} finally {
			setIsUnlocking(false);
		}
	};

	const handleEnhance = async (type: string) => {
		if (!session) {
			setIsLoginOpen(true);
			return;
		}

		const credits = (session.user as any).credits || 0;
		if (credits < 10) {
			alert("Insufficient credits for enhancement (10 credits required)."); // Keeping this alert or could show a nice toast/modal. User hated the 'success' alert.
			// Better to scroll to pricing if low credits
			document
				.getElementById("pricing")
				?.scrollIntoView({ behavior: "smooth" });
			return;
		}

		setIsEnhancing(true);
		setProgress(10);

		try {
			const { predictionId } = await enhanceImage(currentGenerationId, type);

			// Poll for completion
			const pollInterval = setInterval(async () => {
				try {
					const status = await checkGenerationStatus(predictionId);

					if (status.status === "succeeded") {
						clearInterval(pollInterval);
						setProgress(90);
						try {
							const { newImageUrl, newGenerationId } =
								await finalizeEnhancement(predictionId, currentGenerationId);
							setCurrentImage(newImageUrl);
							setCurrentGenerationId(newGenerationId); // Update ID for next enhancement
							setIsEnhancing(false);
							setProgress(100);
							// window.location.reload(); // Removed to prevent state reset
						} catch (finalizeError: any) {
							setIsEnhancing(false);
							setError(
								finalizeError.message || "Failed to load enhanced image",
							);
						}
					} else if (
						status.status === "failed" ||
						status.status === "canceled"
					) {
						clearInterval(pollInterval);
						setIsEnhancing(false);
						setError("Enhancement failed or was canceled. Please try again.");
					} else {
						setProgress((prev) => Math.min(prev + 15, 80));
					}
				} catch (pollError: any) {
					clearInterval(pollInterval);
					setIsEnhancing(false);
					setError("Network error while checking status. Please refresh.");
				}
			}, 1000);
		} catch (e: any) {
			console.error(e);
			setIsEnhancing(false);
			setError(e.message || "Failed to start enhancement");
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Image Preview */}
				<div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[3/4]">
					{/* Main Image */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={currentImage}
						alt="Generated Headshot"
						className={`w-full h-full object-cover transition-all duration-500 ${
							isUnlocked ? "" : "blur-md opacity-80"
						}`}
					/>

					{/* Watermark Overlay */}
					{!isUnlocked && (
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
							<div className="text-white/20 text-6xl font-black rotate-[-45deg] select-none">
								PREVIEW
							</div>
						</div>
					)}

					{/* Unlock Overlay */}
					{!isUnlocked && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-20 backdrop-blur-sm">
							<Lock className="w-12 h-12 text-white mb-4" />
							<button
								onClick={handleUnlock}
								disabled={isUnlocking}
								className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
							>
								{isUnlocking ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									"Unlock High Quality"
								)}
							</button>
							<p className="text-white mt-2 text-sm font-medium">
								Cost: 30 Credits
							</p>
							{error && (
								<p className="text-red-400 mt-2 text-sm font-bold">{error}</p>
							)}
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="flex-1 flex flex-col gap-4">
					<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
						<h3 className="text-xl font-bold mb-4 flex items-center gap-2">
							<Wand2 className="w-5 h-5 text-purple-500" />
							Enhancements{" "}
							<span className="text-xs font-normal text-gray-500 ml-auto">
								10 credits each
							</span>
						</h3>

						{isEnhancing ? (
							<div className="w-full py-4">
								<div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
									<span>Enhancing...</span>
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
							<>
								<div className="grid grid-cols-2 gap-3">
									{["Smile", "Open Eyes", "Fix Lighting", "Background"].map(
										(item) => (
											<button
												key={item}
												onClick={() => handleEnhance(item)}
												disabled={isEnhancing || !isUnlocked}
												className="p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
											>
												{item === "Background" ? (
													<ImageIcon className="w-4 h-4" />
												) : null}
												{item}
											</button>
										),
									)}
								</div>

								{/* Remove Background Button */}
								<button
									onClick={() => handleEnhance("Remove Background")}
									disabled={isEnhancing || !isUnlocked}
									className="w-full mt-3 p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
								>
									<Eraser className="w-4 h-4" />
									Remove Background
								</button>
							</>
						)}
					</div>

					<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
						<h3 className="text-xl font-bold mb-4">Actions</h3>
						<div className="flex flex-col gap-3">
							{isUnlocked ? (
								<a
									href={currentImage}
									download="linkedin-photo.jpg"
									className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-center hover:bg-green-700 flex items-center justify-center gap-2"
								>
									<Download className="w-5 h-5" />
									Download HD
								</a>
							) : (
								<button
									disabled
									className="w-full py-3 bg-gray-200 text-gray-400 rounded-xl font-bold flex items-center justify-center gap-2 cursor-not-allowed"
								>
									<Download className="w-5 h-5" />
									Download HD (Locked)
								</button>
							)}

							<button
								onClick={onReset}
								className={`w-full py-3 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors ${
									isUnlocked
										? "bg-gray-100 text-gray-700 hover:bg-gray-200"
										: "bg-gray-50 text-gray-400 cursor-not-allowed"
								}`}
								disabled={!isUnlocked} // Only allow start over if unlocked (per requirement "Unlock... Start Over")
							>
								<RefreshCw className="w-5 h-5" />
								Start Over
							</button>
							{!isUnlocked && (
								<p className="text-xs text-center text-gray-400">
									Unlock to download or start over
								</p>
							)}
						</div>
					</div>

					<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
						<h3 className="text-xl font-bold mb-3 flex items-center gap-2">
							<MessageSquare className="w-5 h-5 text-orange-500" />
							Feedback{" "}
							<span className="text-xs font-normal text-gray-500 ml-auto">
								Optional
							</span>
						</h3>
						<div className="flex-1 flex flex-col gap-3">
							<textarea
								className="w-full h-full min-h-[80px] p-3 text-sm bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
								placeholder="How is the result? Let us know..."
							/>
							<button className="w-full py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 font-medium flex items-center justify-center gap-2 transition-colors">
								<Send className="w-4 h-4" />
								Send Feedback
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Comparison Slider - Only show when unlocked and enabled */}
			{isUnlocked && showComparison && (
				<div className="mt-12">
					<ComparisonSlider
						beforeImage={originalImage}
						afterImage={currentImage}
					/>
				</div>
			)}

			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
		</div>
	);
}
