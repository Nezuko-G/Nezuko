import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { getDir } from '@/i18n/routing'
import { Providers } from '@/components/providers/Providers'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'

export const metadata: Metadata = {
  title: "Nezuko | HR Portal",
  description: "Secure HR Management System",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale()
  const messages = await getMessages()
  const dir = getDir(locale)

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var l=localStorage.getItem('locale');if(l==='en'||l==='ar'){document.cookie='NEXT_LOCALE='+l+';path=/;max-age=31536000;SameSite=Lax';}}catch(e){}})()`
        }} />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <LocaleProvider>
              {children}
            </LocaleProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}