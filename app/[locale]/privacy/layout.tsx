import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return {
        title: t("Privacy.title"),
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
