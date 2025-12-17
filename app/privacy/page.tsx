import BackgroundGrid from "@/components/BackgroundGrid";

export default function PrivacyPolicy() {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[600px] z-0 overflow-hidden pointer-events-none">
                <BackgroundGrid />
            </div>
            <div className="max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose prose-blue max-w-none">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>1. Introduction</h2>
                    <p>Welcome to LinkedInGen. We respect your privacy and are committed to protecting your personal data.</p>

                    <h2>2. Data We Collect</h2>
                    <p>We collect images you upload for the purpose of generating professional headshots. We also collect authentication data if you sign in.</p>

                    <h2>3. How We Use Your Data</h2>
                    <p>Your uploaded images are used solely for the generation process and are deleted shortly after processing. We do not use your photos for training public AI models without your consent.</p>

                    <h2>4. Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information.</p>

                    <h2>5. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@linkedingen.com.</p>
                </div>
            </div>
        </div>
    );
}
