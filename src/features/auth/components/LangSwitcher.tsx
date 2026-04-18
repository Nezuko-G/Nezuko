'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from "lucide-react";

export default function LangSwitcher() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const toggle = () => {
        const newLocale = locale === 'ar' ? 'en' : 'ar'
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
        router.push(newPath)
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