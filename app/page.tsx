import BeforeAfterSection from "@/components/BeforeAfterSection";
import ComparisonSlider from "@/components/ComparisonSlider";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import UploadZone from "@/components/UploadZone";

export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			<div className="flex flex-col items-center w-full">
				<div className="w-full bg-[#ecf6ff] flex flex-col items-center">
					<Hero />

					<div className="w-full px-6 mb-6">
						<UploadZone />
					</div>

					<Gallery />

					<BeforeAfterSection />
				</div>

				{/* <ComparisonSlider /> */}

				<Pricing />

				<SocialProof />
			</div>
		</div>
	);
}
