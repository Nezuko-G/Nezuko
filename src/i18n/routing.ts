export const routing = {
  defaultLocale: 'en' as const,
  locales: ['en', 'ar'] as const,
}

export type Locale = (typeof routing.locales)[number]

export function getDir(locale: string) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}