"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function RolesSection() {
  const t = useTranslations("landing.roles");

  const roles = [
    { 
      id: "admin", 
      ...t.raw("items.admin"), 
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600" 
    },
    { 
      id: "manager", 
      ...t.raw("items.manager"), 
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600" 
    },
    { 
      id: "chro", 
      ...t.raw("items.chro"), 
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600" 
    },
    { 
      id: "payroll", 
      ...t.raw("items.payroll"), 
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600" 
    },
  ];

  const duplicatedRoles = [...roles, ...roles, ...roles];

  return (
    <section className="w-full py-32 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center px-6 mb-20">
        <h2 className="text-4xl md:text-6xl font-extrabold text-secondary text-center leading-tight">
          {t("title")}
        </h2>
      </div>

      <div className="relative w-full flex overflow-x-hidden py-10 group">
        <div className="absolute top-0 bottom-0 left-0 w-32 md:w-64 bg-linear-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-32 md:w-64 bg-linear-to-l from-background to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex gap-8 px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity,
          }}
        >
          {duplicatedRoles.map((role, index) => (
            <div
              key={`${role.id}-${index}`}
              className="relative w-87.5 md:w-100 h-125 shrink-0 bg-[#F4F5F7] rounded-[40px] overflow-hidden border border-gray-200/50 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-end"
            >
              <div className="absolute top-0 left-0 right-0 h-[90%] bg-gray-200">
                <Image 
                  src={role.img}
                  alt={role.title}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#F4F5F7] via-[#F4F5F7]/40 to-transparent" />
              </div>

              <div className="relative z-10 p-10 pt-0">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">
                  {role.title}
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed font-semibold">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}