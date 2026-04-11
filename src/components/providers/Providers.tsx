'use client'

import { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { I18nProvider } from './I18nProvider'

interface ProvidersProps {
  children: ReactNode
  locale?: string
}

export function Providers({ children, locale = 'en' }: ProvidersProps) {
  return (
    <QueryProvider>
      <I18nProvider locale={locale}>
        {children}
      </I18nProvider>
    </QueryProvider>
  )
}