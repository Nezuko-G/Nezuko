'use client'
// examples of translation in clientComponents

import { useTranslation } from 'react-i18next'

export function HomeComponent() {
  const { t } = useTranslation('home')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('hero.slogan')}</p>
      <p>{t('hero.description')}</p>
      <button>{t('cta')}</button>
    </div>
  )
}