import { getTranslation, getResources } from '@/i18n/request'
import { routing } from '@/i18n/routing'
import { LanguageSwitcher } from '@/components/features/i18n'
import { Providers } from '@/components/providers/Providers'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  const { t } = await getTranslation('common')
  const { i18n } = await getTranslation()
  const resources = getResources(i18n, ['common'])

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <Providers locale={locale}>
          <header className="flex justify-end p-4">
            <LanguageSwitcher currentLocale={locale} />
          </header>
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}