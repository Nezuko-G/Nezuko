import type { Metadata } from "next";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { getDir } from '@/i18n/routing'
import { Providers } from '@/components/providers/Providers'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'

export const metadata: Metadata = {
  title: {
    default: "Nezuko | HR Portal",
    template: "%s | Nezuko",
  },
  description:
    "Secure HR Management System — Streamline workforce management with AI-powered tools",
  openGraph: {
    title: "Nezuko | HR Portal",
    description:
      "Secure HR Management System — Streamline workforce management with AI-powered tools",
    url: "https://nezuko.com",
    siteName: "Nezuko",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 400,
        alt: "Nezuko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nezuko | HR Portal",
    description:
      "Secure HR Management System — Streamline workforce management with AI-powered tools",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
      <head />
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