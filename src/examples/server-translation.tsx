// examples of translation in serverComponents
import { getTranslation } from '@/i18n/request'

export default async function HomePage() {
  const { t } = await getTranslation('home')
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('hero.slogan')}</p>
      <p>{t('hero.description')}</p>
      <button>{t('cta')}</button>
    </div>
  )
}