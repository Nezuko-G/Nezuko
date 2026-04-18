import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  defaultLocale: 'en',
  locales: ['en', 'ar'],
  localePrefix: 'always',
  localeDetection: false,
})

export type Locale = (typeof routing.locales)[number]

export function getDir(locale: string) {
  return locale === 'ar' ? 'rtl' : 'ltr'
}