import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate locale - must be in the supported list
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  const common = (await import(`../../messages/${locale}/common.json`)).default
  const landing = (await import(`../../messages/${locale}/landing.json`)).default
  const auth = (await import(`../../messages/${locale}/auth.json`)).default
  const bookDemo = (await import(`../../messages/${locale}/bookDemo.json`)).default
  const pricing = (await import(`../../messages/${locale}/pricing.json`)).default
  const services = (await import(`../../messages/${locale}/services.json`)).default
  const dashboard = (await import(`../../messages/${locale}/dashboard.json`)).default
  const assets = (await import(`../../messages/${locale}/assets.json`)).default




  return {
    locale: locale as typeof routing.locales[number],
    messages: {
      common,
      landing,
      auth,
      bookDemo,
      dashboard,
      assets,
      pricing,
      services
    }
  }
})