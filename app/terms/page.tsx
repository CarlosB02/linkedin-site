import BackgroundGrid from "@/components/BackgroundGrid";

export default function TermsOfService() {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[600px] z-0 overflow-hidden pointer-events-none">
                <BackgroundGrid />
            </div>
            <div className="max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose prose-blue max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using LinkedInGen, you accept and agree to be bound by the terms and provision of this agreement.</p>

                    <h2>2. Description of Service</h2>
                    <p>LinkedInGen provides AI-generated professional headshots based on user-uploaded photos.</p>

                    <h2>3. User Conduct</h2>
                    <p>You agree to upload only photos that you have the right to use. You usually generally agree not to use the service for any illegal or unauthorized purpose.</p>

                    <h2>4. Refunds</h2>
                    <p>Due to the nature of digital goods and the costs associated with AI generation, refunds are generally not provided unless there is a technical failure.</p>

                    <h2>5. Changes to Terms</h2>
                    <p>We reserve the right to update these terms at any time.</p>
                </div>
            </div>
        </div>
    );
}
