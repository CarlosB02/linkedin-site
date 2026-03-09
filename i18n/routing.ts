import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'pt', 'es', 'fr', 'de', 'it', 'el'],

    // Used when no locale matches
    defaultLocale: 'en',

    pathnames: {
        '/': '/',
        '/privacy': {
            en: '/privacy',
            pt: '/privacidade',
            es: '/privacidad',
            fr: '/confidentialite',
            de: '/datenschutz',
            it: '/privacy',
            el: '/aporrito'
        },
        '/terms': {
            en: '/terms',
            pt: '/termos',
            es: '/terminos',
            fr: '/conditions',
            de: '/bedingungen',
            it: '/termini',
            el: '/oroi'
        },
        '/about': {
            en: '/about',
            pt: '/sobre',
            es: '/nosotros',
            fr: '/a-propos',
            de: '/ueber-uns',
            it: '/chi-siamo',
            el: '/schetika'
        },
        '/contacts': {
            en: '/contacts',
            pt: '/contactos',
            es: '/contactos',
            fr: '/contactos',
            de: '/kontakt',
            it: '/contatti',
            el: '/epikoinonia'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
