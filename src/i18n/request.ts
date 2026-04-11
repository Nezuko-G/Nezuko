import { initServerI18next, getT, getResources } from "next-i18next/server";
import type { i18n } from "i18next";
import i18nConfig from "../../i18n.config";

initServerI18next(i18nConfig);

export const getTranslation = getT;
export { getResources };

export const { getI18n } = (() => {
  let i18nInstance: i18n | null = null;

  return {
    get getI18n() {
      return i18nInstance;
    },
    set getI18n(value) {
      i18nInstance = value;
    },
  };
})();
