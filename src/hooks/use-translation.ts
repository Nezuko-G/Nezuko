'use client'

import { useTranslations as useNextIntlTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export function useTranslation(ns?: string) {
  const pathname = usePathname()
  
  const locale = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]
    return firstSegment === 'en' || firstSegment === 'ar' ? firstSegment : 'en'
  }, [pathname])

  const t = useNextIntlTranslations(ns)

  return { t, locale }
}