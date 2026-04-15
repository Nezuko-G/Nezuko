import { useTranslations } from "next-intl";
import Link from "next/link";
import { Twitter, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="w-full bg-secondary text-white pt-20 pb-8 px-4 border-t border-gray-800 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        
        <div className="lg:col-span-2 flex flex-col items-start">
          <Link href="/" className="text-3xl font-bold tracking-wider text-white mb-6">
            NEZUKO
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8">
            {t("desc")}
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-secondary transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-secondary transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-secondary transition-colors">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold mb-2">{t("sections.product")}</h4>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.features")}</Link>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.pricing")}</Link>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.updates")}</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold mb-2">{t("sections.company")}</h4>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.about")}</Link>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.careers")}</Link>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.contact")}</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold mb-2">{t("sections.legal")}</h4>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.privacy")}</Link>
          <Link href="#" className="text-gray-400 hover:text-primary text-sm transition-colors">{t("links.terms")}</Link>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          {t("rights")}
        </p>
      </div>
    </footer>
  );
}