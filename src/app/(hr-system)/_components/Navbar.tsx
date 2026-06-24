"use client"
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Bell, MessageSquare, X, Menu, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

import { LanguageSwitcher } from "../../../components/i18n/LanguageSwitcher";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("dashboard.navbar");
  const [menuOpen, setMenuOpen] = useState(false);
  const avatarBase64 = useAuthStore((s) => s.avatarBase64);
  const firstName = useAuthStore((s) => s.firstName);
  const lastName = useAuthStore((s) => s.lastName);

  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : null;

  return (
    <header className="h-16 md:h-20 bg-secondary text-white sticky top-0 z-10 w-full shrink-0 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-full gap-3">
        {/* Left: Title + Role Badge */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0 shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <h1 className="text-base md:text-xl font-bold tracking-tight truncate">
            {t("title")}
          </h1>


        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">

          {/* AI Chat */}
          <Link
            href="/chatbot"
            className="hidden sm:flex items-center gap-2 hover:bg-white/10 px-2 md:px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <MessageSquare size={18} className="text-primary" />
            <span className="hidden lg:inline-block">{t("aiChat")}</span>
          </Link>

          {/* Language Switcher (Desktop) */}
          <div className="hidden sm:flex items-center px-1">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
            <Bell
              size={20}
              className="group-hover:text-primary transition-colors"
            />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-secondary" />
          </button>

          {/* Avatar */}
          <Link
            href="/profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border-2 border-primary/20 overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-colors flex items-center justify-center"
          >
            {avatarBase64 ? (
              <Image
                src={avatarBase64}
                alt={t("profile")}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-white text-sm font-bold">
                {initials ?? <User size={18} />}
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10 px-4 py-3 flex flex-col gap-2 shadow-lg">
          <Link
            href="/chatbot"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium w-full"
          >
            <MessageSquare size={18} className="text-primary" />
            {t("aiChat")}
          </Link>

          {/* Language Switcher (Mobile) */}
          <div className="flex items-center justify-between hover:bg-white/10 px-3 py-2.5 rounded-lg transition-colors w-full">
            <span className="text-sm font-medium text-white">{t("language")}</span>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      )}
    </header>
  );
}
