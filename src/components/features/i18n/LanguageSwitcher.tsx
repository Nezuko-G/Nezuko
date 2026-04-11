'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'

interface LanguageSwitcherProps {
  currentLocale: string
  className?: string
}

export function LanguageSwitcher({ currentLocale, className }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = useCallback((newLocale: string) => {
    if (newLocale === currentLocale) return

    const segments = pathname.split('/')
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPath = segments.join('/')
    router.push(newPath)
  }, [pathname, router, currentLocale])

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          currentLocale === 'en'
            ? 'bg-[#D4FF00] text-black'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ar')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          currentLocale === 'ar'
            ? 'bg-[#D4FF00] text-black'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
      >
        AR
      </button>
    </div>
  )
}