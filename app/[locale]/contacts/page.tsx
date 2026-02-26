"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import BackgroundGrid from "@/components/BackgroundGrid";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Contacts() {
	const t = useTranslations("Contacts");
	const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("submitting");

		const formData = new FormData(e.currentTarget);
		const name = formData.get("name");
		const email = formData.get("email");
		const message = formData.get("message");

		try {
			const res = await fetch("https://formsubmit.co/ajax/geral@polly.photo", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					Nome: name,
					Email: email,
					Mensagem: message,
					_subject: `Novo contacto de ${name}`,
					_template: "table"
				}),
			});

			if (res.ok) {
				setStatus("success");
				(e.target as HTMLFormElement).reset();
				setTimeout(() => setStatus("idle"), 5000);
			} else {
				setStatus("error");
				setTimeout(() => setStatus("idle"), 5000);
			}
		} catch (error) {
			setStatus("error");
			setTimeout(() => setStatus("idle"), 5000);
		}
	};

	return (
		<div className="min-h-screen bg-[#ecf6ff] py-24 px-6 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
				<BackgroundGrid />
			</div>
			<div className="max-w-4xl mx-auto relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl font-bold mb-4 text-gray-900">
						{t("title")}
					</h1>
					<p className="text-xl text-gray-600">
						{t("subtitle")}
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
					{/* Contact Info Card */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="bg-white p-10 rounded-3xl shadow-xl border border-blue-50 flex flex-col items-center text-center"
					>
						<div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
							<Mail className="w-8 h-8" />
						</div>
						<h3 className="font-bold text-2xl mb-4 text-gray-900">{t("emailTitle")}</h3>
						<p className="text-gray-500 mb-8 leading-relaxed">
							{t("emailDesc")}
						</p>
						<a
							href="mailto:geral@polly.photo"
							className="text-blue-600 font-bold text-lg hover:underline bg-blue-50 px-6 py-3 rounded-xl transition-colors hover:bg-blue-100"
						>
							geral@polly.photo
						</a>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="bg-white rounded-3xl p-10 shadow-xl border border-blue-50"
					>
						<h2 className="text-2xl font-bold mb-6 text-gray-900">
							{t("formTitle")}
						</h2>
						<form
							className="space-y-4"
							onSubmit={handleSubmit}
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									{t("name")}
								</label>
								<input
									name="name"
									type="text"
									required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder={t("namePlaceholder")}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									{t("email")}
								</label>
								<input
									name="email"
									type="email"
									required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder={t("emailPlaceholder")}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									{t("message")}
								</label>
								<textarea
									name="message"
									rows={4}
									required
									className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
									placeholder={t("messagePlaceholder")}
								></textarea>
							</div>
							<button
								type="submit"
								disabled={status === "submitting"}
								className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:-translate-y-0"
							>
								{status === "submitting" ? t("sending") : t("send")}
							</button>

							{status === "success" && (
								<div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-sm font-medium">
									{t("successMsg")}
								</div>
							)}
							{status === "error" && (
								<div className="p-4 bg-red-50 text-red-700 rounded-xl text-center text-sm font-medium">
									{t("errorMsg")}
								</div>
							)}
						</form>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
