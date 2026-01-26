import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800">
			<div className="max-w-6xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
					{/* Column 1: Logo & Description */}
					<div>
						<a href="/" className="block text-2xl font-bold text-white mb-4">
							LinkedIn<span className="text-blue-500">Gen</span>
						</a>
						<p className="text-sm leading-relaxed max-w-xs">
							Turn your selfies into professional headshots with AI. Save time
							and money while boosting your professional presence.
						</p>
					</div>

					{/* Column 2: Product */}
					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							Product
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href="/#solutions"
									className="hover:text-blue-400 transition-colors"
								>
									Solutions
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
							<li>
								<Link
									href="/#testimonials"
									className="hover:text-blue-400 transition-colors"
								>
									Testimonials
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Legal */}
					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							Legal
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href="/privacy"
									className="hover:text-blue-400 transition-colors"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-blue-400 transition-colors"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="/contacts"
									className="hover:text-blue-400 transition-colors"
								>
									Contacts
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-gray-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
					<div>
						© {new Date().getFullYear()} LinkedInGen. All rights reserved.
					</div>
					<div className="flex gap-4">{/* Social icons could go here */}</div>
				</div>
			</div>
		</footer>
	);
}
