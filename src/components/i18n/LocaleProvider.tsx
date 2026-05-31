'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import { getDir } from '@/i18n/routing'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()

  useEffect(() => {
    const dir = getDir(locale)
    document.documentElement.dir = dir
    document.documentElement.lang = locale
  }, [locale])

  return <>{children}</>
}
