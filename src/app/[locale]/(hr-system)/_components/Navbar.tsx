"use client"
import { useTranslations, useLocale } from "next-intl";
import { Search, Plus, Bell, MessageSquare, X, Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { useState } from "react";

import { LanguageSwitcher } from "../../../../components/i18n/LanguageSwitcher";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("dashboard.navbar");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Center: Search — hidden on mobile unless toggled */}
        <div
          className={`
            absolute inset-x-0 top-0 h-16 md:h-20 px-4 bg-secondary flex items-center
            transition-all duration-200
            md:static md:inset-auto md:h-auto md:px-0 md:flex md:justify-center md:flex-1
            ${searchOpen ? "flex z-20" : "hidden md:flex"}
          `}
        >
          {/* Close button on mobile */}
          {/* {searchOpen && (
            <button
              onClick={() => setSearchOpen(false)}
              className="md:hidden mr-3 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          )}

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              autoFocus={searchOpen}
              className="w-full bg-white/5 text-white placeholder-white/40 border border-transparent focus:border-primary/50 focus:bg-white/10 rounded-full px-4 pr-10 py-2 md:py-2.5 text-sm focus:outline-none transition-all"
            />
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
              size={16}
            />
          </div> */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          {/* Search icon — mobile only */}
          {/* <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Search size={18} className="text-white/70" />
          </button> */}

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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-secondary" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border-2 border-primary/20 overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-colors">
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
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
            <span className="text-sm font-medium text-white">Language</span>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      )}
    </header>
  );
}
