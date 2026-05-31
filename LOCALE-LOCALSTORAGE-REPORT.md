# Localization: URL → localStorage Migration Report

**Date:** May 31, 2026
**Author:** Nezuko Dev

---

## Summary

Moved locale detection from URL path segments (`/en/...`, `/ar/...`) to `localStorage` (key: `'locale'`), defaulting to `'en'`. Cleaned up all routes by removing the `[locale]` directory segment.

---

## What Changed

### 1. Locale source: URL → localStorage

| Before | After |
|--------|-------|
| Locale from `[locale]` URL segment | Locale from `localStorage.getItem('locale')` |
| Default: `en` (from `routing.ts`) | Default: `en` (same) |
| No persistence between sessions | Persisted in `localStorage` |

### 2. URLs cleaned up

| Before | After |
|--------|-------|
| `/en/dashboard` | `/dashboard` |
| `/ar/employees` | `/employees` |
| `/en/login` | `/login` |

All 36 routes cleaned — no locale prefixes anywhere.

### 3. `src/i18n/routing.ts`
- `localePrefix: 'always'` → `'never'`

Removes locale prefix requirement from URLs. The `getDir()` helper and `defaultLocale: 'en'` remain unchanged.

### 4. `src/i18n/request.ts`
- Added `cookies()` from `next/headers` to read `NEXT_LOCALE` cookie directly
- Fallback chain: `requestLocale` → `NEXT_LOCALE` cookie → `defaultLocale` (`'en'`)

Previously relied solely on `requestLocale` (provided by next-intl middleware). Now reads cookie directly as fallback.

### 5. `src/proxy.ts`
**Replaced entirely.** Previously used `createMiddleware` from `next-intl/middleware`, which caused all routes to return 404 with `localePrefix: 'never'`.

**New implementation:** Custom proxy that:
- Checks for `NEXT_LOCALE` cookie
- If missing, sets it to `'en'` (so the server always has a locale)
- Passes through via `NextResponse.next()`
- Excludes `api`, `_next/static`, `_next/image`, assets, favicon, etc. via matcher

```ts
export function proxy(request: NextRequest) {
  if (!request.cookies.has('NEXT_LOCALE')) {
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', routing.defaultLocale, { path: '/', maxAge: 31536000, sameSite: 'lax' })
    return response
  }
  return NextResponse.next()
}
```

### 6. `src/app/layout.tsx` (root layout)
Merged the old `[locale]/layout.tsx` into the root layout:
- Uses `getLocale()` and `getMessages()` from `next-intl/server` for SSR
- Dynamic `lang` and `dir` on `<html>` tag
- Wraps children with `NextIntlClientProvider` → `Providers` → `LocaleProvider`
- Inline `<script>` in `<head>` syncs `localStorage` → `NEXT_LOCALE` cookie before React hydrates
- `suppressHydrationWarning` on `<html>` to handle first-visit locale flash

### 7. `src/components/i18n/LocaleProvider.tsx` (NEW)
Client component that runs on mount:
- Reads `localStorage.getItem('locale')`
- If different from current locale (from server render), sets `NEXT_LOCALE` cookie and calls `router.refresh()` to re-render with correct locale
- Updates `document.documentElement.dir` and `lang` on locale change

### 8. `src/components/i18n/LanguageSwitcher.tsx`
On locale switch:
1. `localStorage.setItem('locale', newLocale)`
2. Sets `NEXT_LOCALE` cookie
3. `router.replace(pathname, { locale: newLocale })`
4. `router.refresh()` to trigger SSR re-render

### 9. `src/app/[locale]/(auth)/login/components/LangSwitcher.tsx`
Same pattern as `LanguageSwitcher`.

### 10. `src/hooks/use-translation.ts`
Replaced fragile pathname-based locale parsing:
```ts
// Before: extracted locale from pathname.split('/')
const firstSegment = pathname.split('/').filter(Boolean)[0]

// After: uses useLocale() from next-intl
const locale = useLocale()
```

### 11. Route restructuring
Deleted `src/app/[locale]/` directory and moved all routes up one level:

| Old Path | New Path |
|----------|----------|
| `app/[locale]/page.tsx` | `app/page.tsx` |
| `app/[locale]/(auth)/login/` | `app/(auth)/login/` |
| `app/[locale]/(hr-system)/` | `app/(hr-system)/` |
| `app/[locale]/components/` | `app/components/` |

### 12. `src/app/(hr-system)/_components/Navbar.tsx`
Fixed relative import path:
```ts
// Before
import { LanguageSwitcher } from "../../../../components/i18n/LanguageSwitcher"
// After
import { LanguageSwitcher } from "../../../components/i18n/LanguageSwitcher"
```

### 13. Batch import fix
70+ files had hardcoded `@/app/[locale]/` imports. Batch-replaced with `@/app/` using sed.

### 14. `src/app/api/jobs-proxy/[...path]/route.ts`
Added `NEXT_LOCALE` cookie as locale fallback:
```ts
const locale = req.headers.get("accept-language") || cookieStore.get("NEXT_LOCALE")?.value || "en"
```

---

## Known Issues / Notes

- **Hydration mismatch warnings**: Caused by browser extensions (Grammarly adding `data-new-gr-c-s-check-loaded`), not our code. Harmless.
- **First visit**: Server renders in `en` by default. `LocaleProvider` detects stored locale, syncs cookie, refreshes. Brief flash of English if Arabic was stored. This is unavoidable with localStorage-only approach (SSR can't read client storage).
- **Return visits**: Inline `<script>` in `<head>` reads localStorage and sets cookie before React hydrates, so SSR picks up the correct locale from the first render.
- **Swiper warnings** (loop mode): Pre-existing, unrelated to this change.
- **`/ar` and `/en` paths**: Now return 404 as expected (no more locale prefixes).

---

## Files Touched

| # | File | Action |
|---|------|--------|
| 1 | `src/i18n/routing.ts` | Edit |
| 2 | `src/i18n/request.ts` | Edit |
| 3 | `src/proxy.ts` | Rewrite |
| 4 | `src/app/layout.tsx` | Rewrite |
| 5 | `src/components/i18n/LocaleProvider.tsx` | **NEW** |
| 6 | `src/components/i18n/LanguageSwitcher.tsx` | Edit |
| 7 | `src/app/(auth)/login/components/LangSwitcher.tsx` | Edit |
| 8 | `src/hooks/use-translation.ts` | Edit |
| 9 | `src/app/page.tsx` | Moved + cleaned |
| 10 | `src/app/components/` (HeroSection, etc.) | Moved |
| 11 | `src/app/(hr-system)/` | Moved (entire directory) |
| 12 | `src/app/(auth)/` | Moved (entire directory) |
| 13 | `src/app/(hr-system)/_components/Navbar.tsx` | Edit (import path) |
| 14 | `src/app/api/jobs-proxy/[...path]/route.ts` | Edit |
| 15 | `.opencode/plans/locale-localstorage.md` | **NEW** (plan) |
| 16 | `LOCALE-LOCALSTORAGE-REPORT.md` | **NEW** (this file) |
| — | 70+ files across `app/(hr-system)/` and `app/(auth)/` | Batch import fix |

---

## Rollback Notes

If something goes wrong:
1. Restore `routing.ts` → `localePrefix: 'always'`
2. Restore `proxy.ts` → `createMiddleware(routing)`
3. Restore `request.ts` → remove `cookies()` import and fallback
4. Restore root `layout.tsx` → hardcoded `lang="en" dir="ltr"` + old structure
5. Move `app/page.tsx` → `app/[locale]/page.tsx`, re-add `generateStaticParams`
6. Move `app/(hr-system)/` → `app/[locale]/(hr-system)/`
7. Move `app/(auth)/` → `app/[locale]/(auth)/`
8. Move `app/components/` → `app/[locale]/components/`
9. Delete `LocaleProvider.tsx`
10. Revert `LanguageSwitcher.tsx`, `LangSwitcher.tsx`, `use-translation.ts`
11. Revert import paths in 70+ files
12. Run `rm -rf .next && npm run dev`
