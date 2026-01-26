import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SocialProofNotifications from "@/components/SocialProofNotifications";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${poppins.variable} antialiased font-sans flex flex-col min-h-screen relative`}
			>
				<Header />
				<main className="flex-1 w-full pt-16 relative z-10">{children}</main>
				<Footer />
				<SocialProofNotifications />
			</body>
		</html>
	);
}
