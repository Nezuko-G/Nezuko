# Favicon, OG Image & Metadata Plan

## Current State

- `src/app/favicon.ico` — old default favicon
- `src/app/layout.tsx` — minimal metadata:
  ```ts
  title: "Nezuko | HR Portal"
  description: "Secure HR Management System"
  ```
- No OG / Twitter card metadata
- `public/logo.png` — 400×400 square PNG (ready to use)

---

## Changes

### 1. Remove old favicon

Delete `src/app/favicon.ico` — it's the default Next.js starter favicon. Replaced by referencing `public/logo.png` via metadata.

### 2. Update `src/app/layout.tsx` metadata

Replace the current metadata object with:

```ts
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
```

No file copying needed — `public/logo.png` is served at `/logo.png` automatically by Next.js.

---

## Notes

- OG images render best at **1200×630**. The 400×400 logo will work but shows as a small square on platforms like Facebook/LinkedIn.
- Twitter `summary_large_image` card gives the best visual result for link sharing.
- Each page can override `title` and `description` via its own `metadata` export (the `template: "%s | Nezuko"` will append " | Nezuko" automatically).
