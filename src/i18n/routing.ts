import i18nConfig from '../../i18n.config'

export const routing = {
  defaultLocale: i18nConfig.fallbackLng,
  locales: i18nConfig.supportedLngs,
}

export type Locale = (typeof routing.locales)[number]