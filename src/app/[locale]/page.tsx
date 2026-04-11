import { getTranslation } from '@/i18n/request'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await getTranslation('common')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">
        {t('welcome')}
      </h1>
      <p className="text-lg text-gray-600">
        now locale: {locale}
      </p>
    </div>
  )
}