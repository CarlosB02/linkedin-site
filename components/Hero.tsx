import { ArrowDown } from "lucide-react";
import BackgroundGrid from "./BackgroundGrid";

export default function Hero() {
	return (
		<div className="relative w-full overflow-hidden">
			{/* Background Design Elements */}
			{/* Background Design Elements */}
			<div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
				<BackgroundGrid />
			</div>

			<div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
				<div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm border border-blue-100">
					✨ #1 LinkedIn Photo Generator
				</div>
				<h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
					Turn your selfie into a <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
						LinkedIn Photo
					</span>
				</h1>
				<p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
					Stop losing opportunities because of a bad profile picture. Get a
					studio-quality headshot in seconds without leaving your house.
				</p>

				<div className="flex justify-center animate-bounce text-gray-400">
					<ArrowDown className="w-6 h-6" />
				</div>
			</div>
		</div>
	);
}
