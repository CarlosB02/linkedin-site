import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SocialProofNotifications from "@/components/SocialProofNotifications";
import OverscrollFix from "@/components/OverscrollFix";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { UIProvider } from "@/lib/ui-context";
import { GenerationProvider } from "@/lib/generationContext";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
	title: "LinkedIn Photo Generator",
	description:
		"Transform your selfies into professional LinkedIn photos with AI.",
};

export default async function RootLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body
				className={`${poppins.variable} antialiased font-sans flex flex-col min-h-screen relative`}
			>
				<NextIntlClientProvider messages={messages}>
					<UIProvider>
						<GenerationProvider>
							<Header />
							<main className="flex-1 w-full pt-16 relative z-10">{children}</main>
							<Footer />
							<SocialProofNotifications />
							<OverscrollFix />
						</GenerationProvider>
					</UIProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
