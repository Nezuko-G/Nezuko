"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Wallet, CheckCircle2 } from "lucide-react";

export default function MenaSection() {
  const t = useTranslations("landing.mena");

  return (
    <section className="w-full py-32 bg-background px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
        <h2 className="text-4xl md:text-6xl font-extrabold text-secondary text-center leading-tight whitespace-pre-line mb-10">
          {t("title")}
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#121212] rounded-[2.5rem] rounded-br-[120px] md:rounded-br-[250px] flex flex-col md:flex-row items-center overflow-hidden min-h-150"
        >
          <div className="flex-1 p-10 md:p-20 flex flex-col justify-center">
            <Wallet className="text-gray-400 mb-8" size={56} />
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {t("f1_title")}
            </h3>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
              {t("f1_desc")}
            </p>
          </div>
          <div className="flex-1 relative w-full h-100 md:h-150">
            <Image
              src="/home/second.png"
              alt="Salary Data"
              fill
              className="object-cover object-left"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full bg-[#F4F5F7] rounded-[2.5rem] rounded-tl-[120px] md:rounded-tl-[250px] flex flex-col-reverse md:flex-row items-center overflow-hidden min-h-150"
        >
          <div className="flex-1 relative w-full h-100 md:h-150 bg-white/50 p-10 flex items-center justify-center">
            <Image
              src="/home/fourth.png"
              alt="Compliance Integrations"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-10 md:p-20 flex flex-col justify-center">
            <CheckCircle2 className="text-gray-500 mb-8" size={56} />
            <h3 className="text-3xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
              {t("f2_title")}
            </h3>
            <p className="text-content-muted text-lg md:text-xl leading-relaxed">
              {t("f2_desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}