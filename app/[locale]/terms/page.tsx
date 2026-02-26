"use client";

import BackgroundGrid from "@/components/BackgroundGrid";
import { useTranslations } from "next-intl";

export default function TermsOfService() {
	const t = useTranslations("Terms");

	return (
		<div className="relative w-full overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-[600px] z-0 overflow-hidden pointer-events-none">
				<BackgroundGrid />
			</div>
			<div className="max-w-4xl mx-auto pt-24 pb-12 px-6 relative z-10">
				<h1 className="text-4xl font-bold mb-8">{t("title")}</h1>
				<div className="prose prose-blue max-w-none">
					<p>{t("lastUpdated")}: {new Date().toLocaleDateString()}</p>

					<h2>{t("s1Title")}</h2>
					<p>{t("s1Text")}</p>

					<h2>{t("s2Title")}</h2>
					<p>{t("s2Text")}</p>

					<h2>{t("s3Title")}</h2>
					<p>{t("s3Text")}</p>

					<h2>{t("s4Title")}</h2>
					<p>{t("s4Text")}</p>

					<h2>{t("s5Title")}</h2>
					<p>{t("s5Text")}</p>
				</div>
			</div>
		</div>
	);
}
