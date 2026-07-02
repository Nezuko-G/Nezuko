"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const t = useTranslations("landing.hero");
  const router = useRouter();

  return (
    <section className="top-0 relative w-full min-h-screen bg-secondary flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center overflow-hidden">

      {/* Content */}
      <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
          {t("title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
          {t("subtitle")}
        </p>

        <button
          onClick={() => router.push("/book-demo")}
          className="bg-white hover:bg-gray-100 text-secondary font-bold py-3 px-8 rounded-full transition-colors text-lg cursor-pointer"
        >
          {t("cta")}
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 items-end z-10">

        <div className="relative bg-card rounded-2xl h-62.5 shadow-xl overflow-hidden border border-gray-100/10">
          <Image
            src="/home/first.png"
            alt={t("placeholders.chart")}
            fill
            className="object-cover opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="bg-content rounded-t-[40px] h-87.5 shadow-2xl relative overflow-hidden border border-gray-100/10">
          <Image
            src="/home/third.png"
            alt={t("placeholders.main_image")}
            fill
            priority
            className="object-cover object-top"
          />
        </div>

        <div className="relative bg-card rounded-2xl h-62.5 shadow-xl overflow-hidden border border-gray-100/10">
          <Image
            src="/home/second.png"
            alt={t("placeholders.icon_3d")}
            fill
            className="object-cover opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>

      </div>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary opacity-5 blur-[150px] rounded-full"></div>
    </section>
  );
}