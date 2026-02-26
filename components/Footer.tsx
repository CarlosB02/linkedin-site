"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("Footer");

	return (
		<footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
			<div className="max-w-6xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
					{/* Column 1: Logo & Description */}
					<div>
						<Link href="/" className="block mb-4">
							<img src="/polly-logo.png" alt="Polly" className="h-10 w-auto" />
						</Link>
						<p className="text-sm leading-relaxed max-w-xs">
							{t("description")}
						</p>
					</div>

					{/* Column 2: Product */}
					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							{t("product")}
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href="/#upload-zone"
									className="hover:text-blue-400 transition-colors"
								>
									{t("uploadPhoto")}
								</Link>
							</li>
							<li>
								<Link
									href="/about#otherSolutions"
									className="hover:text-blue-400 transition-colors"
								>
									{t("otherProducts")}
								</Link>
							</li>
							<li>
								<Link
									href="/#pricing"
									className="hover:text-blue-400 transition-colors"
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Legal */}
					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							{t("legal")}
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href="/privacy"
									className="hover:text-blue-400 transition-colors"
								>
									{t("privacy")}
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-blue-400 transition-colors"
								>
									{t("terms")}
								</Link>
							</li>
							<li>
								<Link
									href="/contacts"
									className="hover:text-blue-400 transition-colors"
								>
									{t("contacts")}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-gray-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
					<div>
						© {new Date().getFullYear()} Polly. {t("rights")}{" "}
						<a
							href="https://enimble.pt"
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none' }}
						>
							E-Nimble
						</a>
					</div>
					<div className="flex gap-4">{/* Social icons could go here */}</div>
				</div>
			</div>
		</footer>
	);
}
