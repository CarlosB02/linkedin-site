"use client";

import {
	ChevronDown,
	Coins,
	LogOut,
	Menu as MenuIcon,
	Sparkles,
	User as UserIcon,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getCredits } from "@/app/actions";
import { authClient } from "@/lib/auth-client";
import LoginModal from "./LoginModal";

export default function Header() {
	const { data: session } = authClient.useSession();
	const [isLoginOpen, setIsLoginOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isServicesOpen, setIsServicesOpen] = useState(false);
	const [credits, setCredits] = useState(0);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (session) {
			// Initialize with session data if available
			setCredits((session.user as any).credits || 0);

			// Fetch latest from server
			getCredits().then(setCredits);
		}
	}, [session]);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	const handlePricingClick = () => {
		if (pathname === "/") {
			const pricingElement = document.getElementById("pricing");
			if (pricingElement) {
				pricingElement.scrollIntoView({ behavior: "smooth" });
			}
		} else {
			router.push("/#pricing");
		}
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<a href="/" className="text-xl font-bold z-50 relative">
						LinkedIn<span className="text-blue-600">Gen</span>
					</a>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							Home
						</Link>
						<button
							onClick={handlePricingClick}
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							Pricing
						</button>

						{/* Services Dropdown */}
						<div className="relative group">
							<button className="flex items-center gap-1 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors py-2">
								Services
								<ChevronDown className="w-4 h-4" />
							</button>
							<div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
								<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-48 min-w-max flex flex-col gap-1 overflow-hidden">
									{/* Placeholder links as requested */}
									<div className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors">
										Exemplo 1
									</div>
									<div className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors">
										Exemplo 2
									</div>
									<div className="px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors">
										Exemplo 3
									</div>
								</div>
							</div>
						</div>

						<Link
							href="/about"
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							About Us
						</Link>
						<Link
							href="/contacts"
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							Contacts
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{/* Auth / Credits Section */}
						<div className="hidden md:block">
							{session ? (
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
										<Coins className="w-4 h-4" />
										{credits} Credits
									</div>

									<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
										<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
											{session.user.image ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={session.user.image}
													alt={session.user.name || ""}
													className="w-full h-full object-cover"
												/>
											) : (
												<UserIcon className="w-4 h-4 text-gray-500" />
											)}
										</div>
										<button
											onClick={() => authClient.signOut()}
											className="text-gray-500 hover:text-red-500 transition-colors"
										>
											<LogOut className="w-5 h-5" />
										</button>
									</div>
								</div>
							) : (
								<button
									onClick={() => setIsLoginOpen(true)}
									className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
								>
									Sign In
								</button>
							)}
						</div>

						{/* Mobile Actions */}
						<div className="md:hidden flex items-center gap-3">
							<button
								className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 z-50 transition-transform active:scale-95"
								onClick={() =>
									document
										.getElementById("upload-zone")
										?.scrollIntoView({ behavior: "smooth" })
								}
								title="Go to Upload"
							>
								<Sparkles className="w-5 h-5" />
							</button>

							<button
								className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 z-50 transition-transform active:scale-95"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								{isMobileMenuOpen ? (
									<X className="w-5 h-5" />
								) : (
									<MenuIcon className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Menu Portal */}
			{mounted &&
				createPortal(
					<div
						className={`fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden transition-all duration-300 md:hidden flex justify-end ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}
					>
						{/* Backdrop */}
						<div className="absolute inset-0 bg-white/95 backdrop-blur-md" />

						<nav className="flex flex-col w-full h-full relative z-10">
							{/* Internal Menu Header */}
							<div className="flex items-center justify-between px-6 h-20">
								<a href="/" className="text-2xl font-bold">
									LinkedIn<span className="text-blue-600">Gen</span>
								</a>
								<div className="flex items-center gap-4">
									<button
										className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-blue-50 text-blue-600 z-50 transition-transform active:scale-95"
										onClick={() => {
											setIsMobileMenuOpen(false);
											document
												.getElementById("upload-zone")
												?.scrollIntoView({ behavior: "smooth" });
										}}
										title="Go to Upload"
									>
										<Sparkles className="w-5 h-5" />
									</button>
									<button
										onClick={() => setIsMobileMenuOpen(false)}
										className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
									>
										<X className="w-6 h-6" />
									</button>
								</div>
							</div>

							<div className="flex flex-col flex-1 justify-center items-center gap-8 px-6 pb-20">
								{/* Navigation Links */}
								<div className="flex flex-col items-center gap-6 w-full">
									<Link
										href="/"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										Home
									</Link>

									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											handlePricingClick();
										}}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										Pricing
									</button>

									{/* Mobile Services Accordion */}
									<div className="flex flex-col items-center w-full">
										<button
											onClick={() => setIsServicesOpen(!isServicesOpen)}
											className="flex items-center gap-2 text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
										>
											Services
											<ChevronDown
												className={`w-5 h-5 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
											/>
										</button>

										<div
											className={`flex flex-col gap-4 items-center overflow-hidden transition-all duration-300 ${isServicesOpen ? "max-h-64 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
										>
											<div
												onClick={() => setIsMobileMenuOpen(false)}
												className="text-lg font-medium text-gray-500 cursor-pointer hover:text-blue-600"
											>
												Exemplo 1
											</div>
											<div
												onClick={() => setIsMobileMenuOpen(false)}
												className="text-lg font-medium text-gray-500 cursor-pointer hover:text-blue-600"
											>
												Exemplo 2
											</div>
											<div
												onClick={() => setIsMobileMenuOpen(false)}
												className="text-lg font-medium text-gray-500 cursor-pointer hover:text-blue-600"
											>
												Exemplo 3
											</div>
										</div>
									</div>

									<Link
										href="/about"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										About Us
									</Link>

									<Link
										href="/contacts"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										Contacts
									</Link>
								</div>

								{/* Divider */}
								<div className="w-16 h-1 bg-gray-100 rounded-full my-2" />

								{/* Auth Actions */}
								<div className="flex flex-col items-center gap-4 w-full max-w-xs">
									{session ? (
										<>
											<div className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 px-8 py-4 rounded-2xl w-full justify-center text-lg">
												<Coins className="w-6 h-6" />
												{credits} Credits
											</div>
											<button
												onClick={() => {
													authClient.signOut();
													setIsMobileMenuOpen(false);
												}}
												className="text-red-500 font-medium flex items-center justify-center gap-2 w-full py-3 hover:bg-red-50 rounded-2xl transition-colors text-lg"
											>
												<LogOut className="w-5 h-5" /> Sign Out
											</button>
										</>
									) : (
										<button
											onClick={() => {
												setIsLoginOpen(true);
												setIsMobileMenuOpen(false);
											}}
											className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition-all"
										>
											Sign In
										</button>
									)}
								</div>
							</div>
						</nav>
					</div>,
					document.body,
				)}

			<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
		</>
	);
}
