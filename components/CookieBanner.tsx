"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Script from "next/script";

export default function CookieBanner() {
    const t = useTranslations("CookieBanner");
    const [isVisible, setIsVisible] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("polly_consent");
        if (consent === "true") {
            setHasConsent(true);
        } else if (consent === null) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("polly_consent", "true");
        setHasConsent(true);
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("polly_consent", "false");
        setHasConsent(false);
        setIsVisible(false);
    };

    return (
        <>
            {/* Inject GA if consent given */}
            {hasConsent && (
                <>
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-8WDS98YH45"
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', 'G-8WDS98YH45');
						`}
                    </Script>
                </>
            )}

            {/* Banner UI */}
            {isVisible && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {t("text")}
                            <Link href="/privacy" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{t("privacy")}</Link>
                            {t("and")}
                            <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">{t("terms")}</Link>.
                        </div>
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                onClick={handleDecline}
                                className="flex-1 sm:flex-none border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {t("decline")}
                            </button>
                            <button
                                onClick={handleAccept}
                                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                {t("accept")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
