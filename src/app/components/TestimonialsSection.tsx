"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  const testimonials = [
    { id: "1", ...t.raw("items.1"), img: "/team/nagy.png" },
    { id: "2", ...t.raw("items.2"), img: "/team/naguib.png" },
    { id: "3", ...t.raw("items.3"), img: "/team/selim.png" },
  ];

  return (
    <section className="w-full py-32 bg-[#F4F5F7] px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extrabold text-secondary mb-6 leading-tight">
            {t("title")}
          </h2>
          <p className="text-content-muted text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-card p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col justify-between min-h-112.5"
            >
              <div>
                <Quote className="text-primary opacity-40 mb-8" size={48} />
                <p className="text-gray-800 text-lg md:text-xl leading-relaxed font-semibold mb-10">
                  {item.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-5 border-t border-gray-100 pt-8">
                <div className="relative w-16 h-16 shrink-0">
                  <Image 
                    src={item.img} 
                    alt={item.name} 
                    fill
                    className="rounded-full object-cover border-2 border-primary/30"
                  />
                </div>
                <div>
                  <h4 className="font-black text-secondary text-lg">{item.name}</h4>
                  <p className="text-base text-content-muted font-medium">
                    {item.role} <span className="text-primary font-bold">@ {item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}