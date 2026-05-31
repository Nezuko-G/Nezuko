'use client'

import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Globe } from "lucide-react";
import { setLocaleCookie } from '@/lib/cookie';

export default function LangSwitcher() {
    const locale = useLocale()
    const router = useRouter()

    const toggle = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar'
        setLocaleCookie(newLocale)
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