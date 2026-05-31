'use client'

import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { getDir } from '@/i18n/routing'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('locale')
    if (stored && stored !== locale) {
      document.cookie = `NEXT_LOCALE=${stored};path=/;max-age=31536000;SameSite=Lax`
      router.refresh()
      return
    }
    setReady(true)
  }, [])

  useEffect(() => {
    const dir = getDir(locale)
    document.documentElement.dir = dir
    document.documentElement.lang = locale
  }, [locale])

  if (!ready) return null

  return <>{children}</>
}
