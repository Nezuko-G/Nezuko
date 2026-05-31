'use client'

import { useTranslations as useNextIntlTranslations, useLocale } from 'next-intl'

export function useTranslation(ns?: string) {
  const locale = useLocale()
  const t = useNextIntlTranslations(ns)

  return { t, locale }
}