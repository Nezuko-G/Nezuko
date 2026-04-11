'use client'

import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { useEffect, useRef } from 'react'

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      i18n.init({
        lng: locale,
        fallbackLng: 'en',
        resources: {},
        interpolation: {
          escapeValue: false,
        },
      })
      initialized.current = true
    } else if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}