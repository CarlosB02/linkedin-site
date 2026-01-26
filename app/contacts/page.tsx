import { Mail } from "lucide-react";
import BackgroundGrid from "@/components/BackgroundGrid";

export default function Contacts() {
	return (
		<div className="min-h-screen bg-[#ecf6ff] py-24 px-6 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
				<BackgroundGrid />
			</div>
			<div className="max-w-4xl mx-auto relative z-10">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-bold mb-4 text-gray-900">
						Contact Support
					</h1>
					<p className="text-xl text-gray-600">
						We're here to help with any questions or issues.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
					{/* Contact Info Card */}
					<div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-50 flex flex-col items-center text-center">
						<div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
							<Mail className="w-8 h-8" />
						</div>
						<h3 className="font-bold text-2xl mb-4 text-gray-900">Email Us</h3>
						<p className="text-gray-500 mb-8 leading-relaxed">
							For general inquiries, technical support, or partnership
							opportunities. We usually respond within 24 hours.
						</p>
						<a
							href="mailto:support@linkedingen.com"
							className="text-blue-600 font-bold text-lg hover:underline bg-blue-50 px-6 py-3 rounded-xl transition-colors hover:bg-blue-100"
						>
							support@linkedingen.com
						</a>
					</div>

					{/* Contact Form */}
					<div className="bg-white rounded-3xl p-10 shadow-xl border border-blue-50">
						<h2 className="text-2xl font-bold mb-6 text-gray-900">
							Send us a message
						</h2>
						<form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Name
								</label>
								<input
									type="text"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder="Your name"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder="your@email.com"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Message
								</label>
								<textarea
									rows={4}
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder="How can we help?"
								></textarea>
							</div>
							<button
								type="submit"
								className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
							>
								Send Message
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
