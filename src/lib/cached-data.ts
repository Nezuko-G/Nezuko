import { getTranslation } from '@/i18n/request'

// "use cache" - caches the result until manually invalidated
'use cache'
export async function getCachedHomeData() {
  const { t } = await getTranslation('home')
  
  return {
    title: t('title'),
    hero: {
      slogan: t('hero.slogan'),
      description: t('hero.description'),
    },
  }
}

// Without "use cache" - fetches fresh every time
export async function getHomeData() {
  const { t } = await getTranslation('home')
  
  return {
    title: t('title'),
    hero: {
      slogan: t('hero.slogan'),
      description: t('hero.description'),
    },
  }
}

// Cache with expiration (using cacheLife)
'use cache'
export async function getDailyData() {
  // This will be cached for 1 day
  const response = await fetch('/api/daily')
  return response.json()
}