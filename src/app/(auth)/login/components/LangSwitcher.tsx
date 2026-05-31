'use client'

import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Globe } from "lucide-react";

export default function LangSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    // const pathname = usePathname()

    const toggle = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar'
        localStorage.setItem('locale', newLocale)
        document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`
        // router.replace(pathname, { locale: newLocale })
        router.refresh()
    }

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
            <Globe size={16} />
            <span>{locale === 'ar' ? 'English' : 'عربي'}</span>
        </button>
    )
}