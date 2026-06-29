"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, UserCircle2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BridgeSection() {
  const t = useTranslations("landing.bridge");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentStateKey = isConnected ? "connected" : "disconnected";
  const rows = [
    { id: 1, ...t.raw(`states.${currentStateKey}.row1`) },
    { id: 2, ...t.raw(`states.${currentStateKey}.row2`) },
    { id: 3, ...t.raw(`states.${currentStateKey}.row3`) },
  ];

  return (
    <section className="w-full py-16 md:py-28 bg-background px-4 md:px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-6xl font-extrabold text-secondary mb-12 md:mb-20 text-center max-w-4xl leading-tight">
          {t("title")}
        </h2>

        <div className="relative flex items-center justify-center w-full h-37.5 md:h-70 mb-8 md:mb-16">
          <div className="relative w-full h-full flex items-center justify-center scale-[0.55] sm:scale-75 md:scale-100 origin-center">
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-87.5 md:w-125">
              <motion.div
                className={cn(
                  "absolute w-full border-t-2 transition-colors duration-500",
                  isConnected ? "border-status-success border-solid" : "border-status-error border-dashed"
                )}
                initial={false}
                animate={{ opacity: isConnected ? 1 : 0.3 }}
              />
              
              <motion.div
                animate={{
                  rotate: isConnected ? 0 : 180,
                  scale: isConnected ? 1.1 : 1,
                  backgroundColor: isConnected ? "var(--color-status-success)" : "var(--color-status-error)"
                }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="z-20 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
              >
                {isConnected ? <Check size={28} strokeWidth={3.5} /> : <X size={28} strokeWidth={3.5} />}
              </motion.div>
            </div>

            <motion.div
              animate={{
                x: isConnected ? -125 : -220,
                rotate: isConnected ? 0 : -10,
                opacity: isConnected ? 1 : 0.4
              }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              className="absolute z-10 flex flex-col items-center bg-card p-4 rounded-4xl shadow-xl border border-gray-100"
            >
              <div className="w-38 h-38 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                 <UserCircle2 size={80} className="text-gray-400" />
              </div>
              <span className="font-bold text-secondary text-lg">{t("hr")}</span>
            </motion.div>

            <motion.div
              animate={{
                x: isConnected ? 125 : 220,
                rotate: isConnected ? 0 : 10,
                opacity: isConnected ? 1 : 0.4
              }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              className="absolute z-10 flex flex-col items-center bg-card p-4 rounded-4xl shadow-xl border border-gray-100"
            >
              <div className="w-38 h-38 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
                 <Briefcase size={80} className="text-gray-400" />
              </div>
              <span className="font-bold text-secondary text-lg">{t("finance")}</span>
            </motion.div>
          </div>
        </div>

        <div className="w-full max-w-4xl flex flex-col gap-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {rows.map((row, index) => (
              <motion.div
                key={`${currentStateKey}-${row.id}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between w-full"
              >
                <div className={cn(
                  "flex-1 py-3 px-2 sm:px-4 md:py-5 md:px-8 rounded-lg md:rounded-xl font-bold text-[15px] sm:text-xs md:text-xl text-center md:text-start transition-all duration-500",
                  isConnected ? "bg-card text-content shadow-lg border border-gray-100 scale-100" : "bg-transparent text-content-muted border border-gray-100/30 opacity-60 scale-95"
                )}>
                  {row.l}
                </div>

                <div className="mx-1 sm:mx-3 md:mx-10 w-20 sm:w-24 md:w-40 flex justify-center">
                  <span className={cn(
                    "px-2 py-1 md:px-6 md:py-2 rounded-md md:rounded-lg text-[10px] sm:text-[10px] md:text-base font-black tracking-wider md:tracking-widest transition-all duration-500",
                    isConnected 
                      ? "text-status-success bg-status-success/10 border border-status-success/20 shadow-md" 
                      : "text-status-error bg-transparent border-b-2 border-status-error/30 border-dashed"
                  )}>
                    {row.c}
                  </span>
                </div>

                <div className={cn(
                  "flex-1 py-3 px-2 sm:px-4 md:py-5 md:px-8 rounded-lg md:rounded-xl font-bold text-[15px] sm:text-xs md:text-xl text-center md:text-end transition-all duration-500",
                  isConnected ? "bg-card text-content shadow-lg border border-gray-100 scale-100" : "bg-transparent text-content-muted border border-gray-100/30 opacity-60 scale-95"
                )}>
                  {row.r}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}