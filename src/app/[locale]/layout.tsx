import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { getDir, routing } from '@/i18n/routing'
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
  const direction = getDir(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <main dir={direction}>
          {children}
        </main>
      </Providers>
    </NextIntlClientProvider>
  )
}