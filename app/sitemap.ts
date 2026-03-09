import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://polly.photo';

export default function sitemap(): MetadataRoute.Sitemap {
    const sitemapEntries: MetadataRoute.Sitemap = [];

    const routes = [
        '/',
        '/privacy',
        '/terms',
        '/about',
        '/contacts',
    ] as const;

    routes.forEach((route) => {
        // We add an entry for each supported locale so that search engines can index all languages
        routing.locales.forEach((locale) => {
            let localizedPath = route as string;

            // Map to the translated pathname (e.g. /privacy -> /pt/privacidade)
            if (route !== '/' && routing.pathnames) {
                const pathMap = routing.pathnames[route as keyof typeof routing.pathnames];
                if (pathMap && typeof pathMap === 'object' && locale in pathMap) {
                    localizedPath = (pathMap as Record<string, string>)[locale];
                }
            }

            // Build the URL (format: https://polly.photo/en/privacy)
            // Note: If the root is '/', localizedPath is '' so it avoids trailing slashes like /en/
            const url = `${baseUrl}/${locale}${localizedPath === '/' ? '' : localizedPath}`;

            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: route === '/' ? 'weekly' : 'monthly',
                priority: route === '/' ? 1.0 : 0.8,
            });
        });
    });

    return sitemapEntries;
}
