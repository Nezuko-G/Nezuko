'use client'

import { useRouter, usePathname } from '@/i18n/navigation'
import { useCallback } from 'react'

interface LanguageSwitcherProps {
  currentLocale: string
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = useCallback((newLocale: string) => {
    if (newLocale === currentLocale) return
    router.replace(pathname, { locale: newLocale })
  }, [pathname, router, currentLocale])

  return (
    <div className="flex items-center gap-1 bg-secondary-light p-1 rounded-full border border-gray-700">
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          currentLocale === 'en'
            ? 'bg-primary text-secondary' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ar')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          currentLocale === 'ar'
            ? 'bg-primary text-secondary'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        AR
      </button>
    </div>
  )
}