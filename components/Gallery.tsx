"use client";

import { Download, FileText, Lock, Wand2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getUserGenerations } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import ResultView from "./ResultView";

export default function Gallery() {
	const { data: session } = authClient.useSession();
	const [generations, setGenerations] = useState<any[]>([]);
	const [isAllGenerationsOpen, setIsAllGenerationsOpen] = useState(false);
	const [editingGeneration, setEditingGeneration] = useState<any | null>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		if (session) {
			getUserGenerations().then(setGenerations);
		}
	}, [session]);

	// Scroll lock effect
	useEffect(() => {
		if (editingGeneration || isAllGenerationsOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [editingGeneration, isAllGenerationsOpen]);

	if (!session || generations.length === 0) return null;

	const renderGenerationCard = (gen: any) => (
		<div
			key={gen.id}
			className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm group"
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={gen.image}
				alt="Generated"
				className={`w-full h-full object-cover ${!gen.unlocked ? "blur-sm" : ""}`}
			/>

			{/* Lock Overlay */}
			{!gen.unlocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
					<Lock className="w-6 h-6 text-white" />
				</div>
			)}

			{/* Hover Actions Overlay */}
			<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
				<button
					onClick={() => setEditingGeneration(gen)}
					className="px-5 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:scale-105 hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300"
				>
					<Wand2 className="w-4 h-4 text-purple-600" />
					Edit / Unlock
				</button>

				{gen.unlocked && (
					<a
						href={gen.image}
						download={`generated-${gen.id}.jpg`}
						className="px-5 py-2.5 bg-gray-900/80 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 border border-white/10"
						onClick={(e) => e.stopPropagation()}
					>
						<Download className="w-4 h-4" />
						Download
					</a>
				)}
			</div>
		</div>
	);

	return (
		<div className="w-full max-w-6xl mx-auto px-6 pt-6 pb-6">
			<h2 className="text-2xl font-bold mb-6">Your Recent Generations</h2>
			{/* Desktop View (4 items) */}
			<div className="hidden md:grid grid-cols-4 lg:grid-cols-5 gap-4">
				{generations.slice(0, 4).map(renderGenerationCard)}

				{generations.length > 4 && (
					<button
						onClick={() => setIsAllGenerationsOpen(true)}
						className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
					>
						<div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
							<FileText className="w-6 h-6 text-blue-600" />
						</div>
						<span className="font-medium text-gray-600 group-hover:text-blue-600">
							View All
						</span>
						<span className="text-xs text-gray-400">
							({generations.length - 4} more)
						</span>
					</button>
				)}
			</div>

			{/* Mobile View (3 items) */}
			<div className="md:hidden grid grid-cols-2 gap-4">
				{generations.slice(0, 3).map(renderGenerationCard)}

				{generations.length > 3 && (
					<button
						onClick={() => setIsAllGenerationsOpen(true)}
						className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
					>
						<div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-95 transition-transform">
							<FileText className="w-6 h-6 text-blue-600" />
						</div>
						<span className="font-medium text-gray-600 group-active:text-blue-600">
							View All
						</span>
						<span className="text-xs text-gray-400">
							({generations.length - 3} more)
						</span>
					</button>
				)}
			</div>

			{/* All Generations Modal - Portaled */}
			{mounted &&
				isAllGenerationsOpen &&
				createPortal(
					<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
						<div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
							<div className="p-6 border-b border-gray-100 flex items-center justify-between">
								<h3 className="text-xl font-bold">
									All Generations ({generations.length})
								</h3>
								<button
									onClick={() => setIsAllGenerationsOpen(false)}
									className="p-2 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X className="w-5 h-5 text-gray-500" />
								</button>
							</div>
							<div className="flex-1 overflow-y-auto p-6">
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
									{generations.map(renderGenerationCard)}
								</div>
							</div>
						</div>
					</div>,
					document.body,
				)}

			{/* Edit / Result View Modal - Portaled */}
			{mounted &&
				editingGeneration &&
				createPortal(
					<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
						<div className="relative w-full max-w-5xl my-auto">
							{/* Desktop Close Button (Fixed to screen) */}
							{/* Desktop Close Button (Outside top-right) */}
							<button
								onClick={() => setEditingGeneration(null)}
								className="hidden md:flex absolute -top-2 -right-12 p-2 bg-white text-gray-900 rounded-full transition-all shadow-lg hover:bg-gray-100 z-50 hover:scale-110"
								title="Close"
							>
								<X className="w-6 h-6" />
							</button>

							<div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
								{/* Mobile Close Button (inside) */}
								<button
									onClick={() => setEditingGeneration(null)}
									className="md:hidden absolute top-3 right-3 p-2 bg-gray-100/80 hover:bg-gray-200 text-gray-800 rounded-full transition-colors z-[100] shadow-sm backdrop-blur-md"
								>
									<X className="w-5 h-5" />
								</button>

								<ResultView
									resultUrl={editingGeneration.image}
									originalImage={editingGeneration.image}
									generationId={editingGeneration.id}
									onReset={() => setEditingGeneration(null)}
									initialUnlocked={editingGeneration.unlocked}
									showComparison={false}
								/>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
