import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  
  // Validate locale - must be in the supported list
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale
  }

  // Load available namespace files
  const messages: Record<string, Record<string, unknown>> = {}
  
  // Common namespace (always required)
  messages.common = (await import(`../../messages/${locale}/common.json`)).default
  
  // Home namespace
  messages.home = (await import(`../../messages/${locale}/home.json`)).default

  return {
    locale: locale as typeof routing.locales[number],
    messages
  }
})