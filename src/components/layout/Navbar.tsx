"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("common.navbar");
  const locale = useLocale();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [token] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("auth");
      if (!raw) return false;
      return (JSON.parse(raw) as { isAuthenticated?: boolean }).isAuthenticated === true;
    } catch {
      return false;
    }
  });

  function handleLogout() {
    localStorage.removeItem("auth");
    router.push("/login");
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl">
      <nav
        className={cn(
          "transition-all duration-300 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between rounded-full",
          isScrolled
            ? "bg-card/90 backdrop-blur-md text-content shadow-lg border border-white/10"
            : "bg-transparent text-white",
        )}
      >
        <Link
          href={`/`}
          className="text-2xl md:text-2xl font-black tracking-tighter"
        >
          NEZUKO
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-bold text-sm uppercase tracking-wide">
          <Link
            href="#"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            {t("product")} <ChevronDown size={14} />
          </Link>

          <Link href="/blogs" className="hover:text-primary transition-colors">
            {t("blogs")}
          </Link>
          <Link
            href="/services"
            className="hover:text-primary transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href="/pricing"
            className="hover:text-primary transition-colors"
          >
            {t("pricing")}
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:block">
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {token ? (
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-1.5 font-bold text-xs hover:text-primary transition-colors uppercase"
            >
              <LogOut size={14} className="ltr:rotate-180"/>
              {t("logout")}
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block font-bold text-xs hover:text-primary transition-colors uppercase"
            >
              {t("login")}
            </Link>
          )}

          <Link
            href="/book-demo"
            className="bg-primary hover:bg-primary/90 text-secondary font-black py-2 px-4 md:py-3 md:px-6 rounded-full transition-all active:scale-95 text-[13px] md:text-xs"
          >
            {t("demo")}
          </Link>
          <button
            className="lg:hidden p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "absolute top-[110%] left-0 w-full bg-secondary/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-6 transition-all duration-300 lg:hidden origin-top shadow-2xl",
          isMobileMenuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none",
        )}
      >
        <Link
          href="#"
          className="font-bold text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("product")}
        </Link>
        <Link
          href="#"
          className="font-bold text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("blogs")}
        </Link>
        <Link
          href="#"
          className="font-bold text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("pricing")}
        </Link>
        <Link
          href="#"
          className="font-bold text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("services")}
        </Link>
        {token ? (
          <button
            onClick={() => {
              handleLogout();
              setIsMobileMenuOpen(false);
            }}
            className="font-bold text-white flex items-center gap-1.5"
          >
            <LogOut size={14} /> Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="font-bold text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t("login")}
          </Link>
        )}

        <div className="pt-2 w-full flex justify-center border-t border-white/10">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </div>
  );
}
