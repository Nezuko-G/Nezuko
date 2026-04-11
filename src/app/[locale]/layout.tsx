import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { getDir, routing } from '@/i18n/routing'
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
  
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <header className="flex justify-end p-4" dir={getDir(locale)}>
          <LanguageSwitcher currentLocale={locale} />
        </header>
        <main dir={getDir(locale)}>
          {children}
        </main>
      </Providers>
    </NextIntlClientProvider>
  )
}