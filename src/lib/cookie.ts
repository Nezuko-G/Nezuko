const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_OPTIONS = "path=/;max-age=31536000;SameSite=Lax";

export function setLocaleCookie(locale: string) {
  if (typeof window === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale};${COOKIE_OPTIONS}`;
}

export function getLocaleCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^| )${LOCALE_COOKIE}=([^;]+)`),
  );
  return match ? match[2] : null;
}
