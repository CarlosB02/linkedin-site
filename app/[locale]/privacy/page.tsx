"use client";

import BackgroundGrid from "@/components/BackgroundGrid";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
	const t = useTranslations("Privacy");

	return (
		<div className="relative w-full overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-[600px] z-0 overflow-hidden pointer-events-none">
				<BackgroundGrid />
			</div>
			<div className="max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10">
				<h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
				<div className="prose prose-blue max-w-none text-zinc-800 dark:text-zinc-200">
					<p className="font-semibold">{t("lastUpdated")}</p>

					{t.has("intro") && (
						<div className="mb-8">
							{t("intro").split('\n').map((line, i) => (
								<p key={"intro" + i} className="mb-2">{line}</p>
							))}
						</div>
					)}

					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
						const titleKey = `s${num}Title` as any;
						const textKey = `s${num}Text` as any;

						if (!t.has(titleKey)) return null;

						return (
							<div key={num} className="mb-8">
								<h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">{t(titleKey)}</h2>
								{t(textKey).split('\n').map((line, i) => (
									<p key={i} className="mb-2">{line}</p>
								))}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
