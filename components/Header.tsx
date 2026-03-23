"use client";

import {
	ChevronDown,
	Coins,
	LogOut,
	Menu as MenuIcon,
	Sparkles,
	User as UserIcon,
	X,
	Globe,
} from "lucide-react";
import NextImage from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getCredits } from "@/app/actions";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { useUI } from "@/lib/ui-context";

export default function Header() {
	const { user, credits, setCredits } = useAuth();
	const supabase = createClient();
	const { openLoginModal } = useUI();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
	const [isLangOpen, setIsLangOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("Header");
	const locale = useLocale();

	const getFlagStyle = (code: string) => {
		if (code === "en") return "object-cover scale-150";
		return "object-cover";
	};

	const languages = [
		{ code: "en", label: "English", flag: "/images/flags/us.png" },
		{ code: "pt", label: "Português", flag: "/images/flags/pt.png" },
		{ code: "es", label: "Español", flag: "/images/flags/es.png" },
		{ code: "fr", label: "Français", flag: "/images/flags/fr.png" },
		{ code: "de", label: "Deutsch", flag: "/images/flags/de.png" },
		{ code: "it", label: "Italiano", flag: "/images/flags/it.png" },
		{ code: "el", label: "Ελληνικά", flag: "/images/flags/gr.png" },
	];

	const handleLanguageChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale });
		setIsLangOpen(false);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (user) {
			// Fetch latest from server
			getCredits().then(setCredits);
		}
	}, [user]);

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
			router.push({ pathname: "/", hash: "pricing" } as any);
		}
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link
						href="/"
						onClick={(e) => {
							e.preventDefault();
							window.location.href = e.currentTarget.href;
						}}
						className="flex items-center z-50 relative"
					>
						<NextImage src="/polly-logo.png" alt="Polly" width={120} height={40} className="h-8 w-auto" priority />
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							onClick={(e) => {
								e.preventDefault();
								window.location.href = e.currentTarget.href;
							}}
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							{t("home")}
						</Link>
						<button
							onClick={handlePricingClick}
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							{t("pricing")}
						</button>

						{/* Services Link */}
						<Link
							href={{ pathname: "/about", hash: "outros-servicos" }}
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							{t("services")}
						</Link>

						<Link
							href="/about"
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							{t("about")}
						</Link>
						<Link
							href="/contacts"
							className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
						>
							{t("contacts")}
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{/* Language Switcher Desktop */}
						<div className="hidden md:block relative group">
							<button
								onClick={() => setIsLangOpen(!isLangOpen)}
								className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium border border-gray-200/50"
							>
								<div className="relative w-5 h-5 overflow-hidden rounded-full shrink-0">
									<NextImage
										src={languages.find((l) => l.code === locale)?.flag || languages[0].flag}
										alt={locale}
										fill
										className={getFlagStyle(locale)}
									/>
								</div>
								<span className="uppercase">{locale}</span>
								<ChevronDown className="w-3 h-3 opacity-50" />
							</button>
							<div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
								<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-1 w-48 flex flex-col gap-0.5 overflow-hidden">
									{languages.map((lang) => (
										<button
											key={lang.code}
											onClick={() => handleLanguageChange(lang.code)}
											className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${locale === lang.code
												? "bg-blue-50 text-blue-700 font-medium"
												: "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
												}`}
										>
											<div className="relative w-5 h-5 overflow-hidden rounded-full shrink-0 shadow-sm border border-gray-100">
												<NextImage
													src={lang.flag}
													alt={lang.label}
													fill
													className={getFlagStyle(lang.code)}
												/>
											</div>
											{lang.label}
										</button>
									))}
								</div>
							</div>
						</div>
						<div className="hidden md:block">
							{user ? (
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
										<Coins className="w-4 h-4" />
										{credits} {t("credits")}
									</div>

									<div className="flex items-center gap-3 pl-4 border-l border-gray-200">
										<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
											<UserIcon className="w-4 h-4 text-gray-500" />
										</div>
										<button
											onClick={async () => {
												await supabase.auth.signOut();
												window.location.reload();
											}}
											className="text-gray-500 hover:text-red-500 transition-colors"
										>
											<LogOut className="w-5 h-5" />
										</button>
									</div>
								</div>
							) : (
								<button
									onClick={openLoginModal}
									className="px-6 py-2 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-sm"
								>
									{t("signIn")}
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
							<div className="flex items-center justify-between px-6 h-20 shrink-0">
								<Link
									href="/"
									onClick={(e) => {
										e.preventDefault();
										setIsMobileMenuOpen(false);
										window.location.href = e.currentTarget.href;
									}}
									className="flex items-center"
								>
									<NextImage src="/polly-logo.png" alt="Polly" width={120} height={40} className="h-8 w-auto" priority />
								</Link>
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

							<div className="flex flex-col flex-1 justify-start items-center gap-8 px-6 py-8 overflow-y-auto w-full">
								{/* Navigation Links */}
								<div className="flex flex-col items-center gap-6 w-full">
									<Link
										href="/"
										onClick={(e) => {
											e.preventDefault();
											setIsMobileMenuOpen(false);
											window.location.href = e.currentTarget.href;
										}}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										{t("home")}
									</Link>

									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											handlePricingClick();
										}}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										{t("pricing")}
									</button>

									{/* Mobile Services Link */}
									<Link
										href={{ pathname: "/about", hash: "outros-servicos" }}
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										{t("services")}
									</Link>

									<Link
										href="/about"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										{t("about")}
									</Link>

									<Link
										href="/contacts"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
									>
										{t("contacts")}
									</Link>

									{/* Mobile Language Accordion */}
									<div className="flex flex-col items-center w-full">
										<button
											onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
											className="flex items-center gap-2 text-2xl font-semibold text-gray-800 hover:text-blue-600 transition-colors"
										>
											<div className="relative w-6 h-6 overflow-hidden rounded-full shrink-0">
												<NextImage
													src={languages.find((l) => l.code === locale)?.flag || languages[0].flag}
													alt={locale}
													fill
													className={getFlagStyle(locale)}
												/>
											</div>
											<span className="uppercase">{locale}</span>
											<ChevronDown
												className={`w-5 h-5 transition-transform duration-300 ${isMobileLangOpen ? "rotate-180" : ""}`}
											/>
										</button>

										<div
											className={`flex flex-col gap-4 items-center overflow-hidden transition-all duration-300 ${isMobileLangOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
										>
											{languages.map((lang) => (
												<button
													key={lang.code}
													onClick={() => {
														handleLanguageChange(lang.code);
														setIsMobileMenuOpen(false);
													}}
													className={`flex items-center gap-3 text-lg font-medium transition-colors ${locale === lang.code
														? "text-blue-700"
														: "text-gray-500 hover:text-blue-600"
														}`}
												>
													<div className="relative w-6 h-6 overflow-hidden rounded-full shrink-0 shadow-sm border border-gray-100">
														<NextImage
															src={lang.flag}
															alt={lang.label}
															fill
															className={getFlagStyle(lang.code)}
														/>
													</div>
													{lang.label}
												</button>
											))}
										</div>
									</div>
								</div>

								{/* Divider */}
								<div className="w-16 h-1 bg-gray-100 rounded-full my-2" />

								{/* Auth Actions */}
								<div className="flex flex-col items-center gap-4 w-full max-w-xs">
									{user ? (
										<>
											<div className="flex items-center gap-2 text-blue-700 font-bold bg-blue-50 px-8 py-4 rounded-2xl w-full justify-center text-lg">
												<Coins className="w-6 h-6" />
												{credits} {t("credits")}
											</div>
											<button
												onClick={async () => {
													await supabase.auth.signOut();
													setIsMobileMenuOpen(false);
													window.location.reload();
												}}
												className="text-red-500 font-medium flex items-center justify-center gap-2 w-full py-3 hover:bg-red-50 rounded-2xl transition-colors text-lg"
											>
												<LogOut className="w-5 h-5" /> {t("signOut")}
											</button>
										</>
									) : (
										<button
											onClick={() => {
												openLoginModal();
												setIsMobileMenuOpen(false);
											}}
											className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:scale-[1.02] transition-all"
										>
											{t("signIn")}
										</button>
									)}
								</div>
							</div>
						</nav>
					</div>,
					document.body,
				)}
		</>
	);
}
