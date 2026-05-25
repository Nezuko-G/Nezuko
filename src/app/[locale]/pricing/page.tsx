"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Star, ArrowRight, Shield, CheckCircle2 } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    FEATURES,
    TRUST_BADGES,
    TESTIMONIALS,
    HOW_IT_WORKS,
    PAYMENT_METHODS,
    ICON_MAP,
    type IconName,
} from "./utils/pricing.utils";

const DARK_BG = "bg-[#000028]";
const LIGHT_BG = "bg-[#f8fafc]";

function Section({
    dark = false,
    className = "",
    children,
}: {
    dark?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <section className={`w-full py-16 md:py-20 px-4 md:px-6 ${dark ? DARK_BG : LIGHT_BG} ${className}`}>
            {children}
        </section>
    );
}

function FaqRow({ q, a, index, dark }: { q: string; a: string; index: number; dark: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className={`border-b last:border-0 ${dark ? "border-white/10" : "border-gray-100"}`}
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-5 text-left gap-4 group"
            >
                <span className={`font-semibold text-sm md:text-base transition-colors group-hover:text-primary ${dark ? "text-white/80" : "text-secondary"}`}>
                    {q}
                </span>
                <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:text-primary
                    ${dark ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-400"}`}>
                    {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <p className={`pb-5 text-sm leading-relaxed ${dark ? "text-white/50" : "text-gray-500"}`}>{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function PricingPage() {
    const t = useTranslations("pricing");

    const faqs = t.raw("faq.items") as { q: string; a: string }[];
    const included = t.raw("plan.included") as string[];
    const featureItems = t.raw("features.items") as { title: string; desc: string }[];
    const payMethods = t.raw("payment.methods") as string[];
    const trustLabels = t.raw("trust") as string[];
    const howSteps = t.raw("how.steps") as { title: string; desc: string }[];

    return (
        <>
            <Navbar />

            <main className="w-full overflow-hidden">

                {/* ══════ HERO ══════ */}
                <Section dark className="pt-28 md:pt-32 pb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="inline-block bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                            {t("hero.badge")}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                            {t("hero.title1")} <br />
                            <span className="text-primary">{t("hero.title2")}</span>
                        </h1>
                        <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
                            {t("hero.subtitle")}
                        </p>
                        <Link
                            href="/book-demo"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition-all text-sm"
                        >
                            {t("hero.cta")} <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                </Section>

                {/* ══════ HOW IT WORKS ══════ */}
                <Section dark={false}>
                    <div className="max-w-5xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl md:text-4xl font-extrabold text-[#0f172a] text-center mb-12"
                        >
                            {t("how.title")}
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {HOW_IT_WORKS.map((s, i) => {
                                const Icon = ICON_MAP[s.iconName as IconName];
                                return (
                                    <motion.div
                                        key={s.step}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.45, delay: i * 0.12 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 relative overflow-hidden"
                                    >
                                        <span className="absolute top-4 right-5 text-6xl font-black text-gray-50 select-none leading-none">
                                            {s.step}
                                        </span>
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon size={24} className="text-primary" />
                                        </div>
                                        <h3 className="font-extrabold text-[#0f172a] text-lg mb-2">{howSteps[i]?.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{howSteps[i]?.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                {/* ══════ PRICING CARD ══════ */}
                <Section dark>
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-14"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                                {t("plan.title")}
                            </h2>
                            <p className="text-white/50 text-lg max-w-xl mx-auto">
                                {t("plan.subtitle")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <div className="flex flex-col md:flex-row">

                                {/* Left — price */}
                                <div className="flex-1 p-10 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
                                    <div>
                                        <span className="inline-block bg-primary/20 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                                            {t("plan.badge")}
                                        </span>
                                        <div className="flex items-end gap-2 mb-2">
                                            <span className="text-6xl md:text-7xl font-extrabold text-white leading-none">
                                                {t("plan.price")}
                                            </span>
                                            <div className="mb-2">
                                                <span className="text-white/50 text-lg font-bold">{t("plan.currency")}</span>
                                                <p className="text-white/30 text-sm">{t("plan.per")}</p>
                                            </div>
                                        </div>
                                        <p className="text-white/40 text-sm mb-8">{t("plan.note")}</p>
                                        <p className="text-white/60 text-base leading-relaxed">{t("plan.desc")}</p>
                                    </div>
                                    <div className="mt-10 flex flex-col gap-3">
                                        <Link
                                            href="/demo"
                                            className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all text-sm"
                                        >
                                            {t("plan.ctaDemo")} <ArrowRight size={15} />
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/15 transition-all text-sm border border-white/10"
                                        >
                                            {t("plan.ctaSales")}
                                        </Link>
                                    </div>
                                </div>

                                {/* Right — included list */}
                                <div className="flex-1 p-10 md:p-14">
                                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-6">
                                        {t("plan.includedLabel")}
                                    </p>
                                    <ul className="space-y-3">
                                        {included.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                    <Check size={11} strokeWidth={3} className="text-primary" />
                                                </span>
                                                <span className="text-white/80 text-sm font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Footer strip */}
                            <div className="bg-white/5 border-t border-white/10 px-10 py-4 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-white/30 text-xs">{t("plan.footerLeft")}</p>
                                <div className="flex items-center gap-2">
                                    <Shield size={12} className="text-primary" />
                                    <span className="text-white/30 text-xs">{t("plan.footerRight")}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </Section>

                {/* ══════ FEATURES GRID ══════ */}
                <Section dark={false}>
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-3">
                                {t("features.title")}
                            </h2>
                            <p className="text-gray-500 text-base max-w-xl mx-auto">{t("features.subtitle")}</p>
                        </motion.div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {FEATURES.map((f, i) => {
                                const Icon = ICON_MAP[f.iconName as IconName];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon size={20} className="text-primary" />
                                        </div>
                                        <h3 className="font-extrabold text-[#0f172a] text-base mb-1.5">
                                            {featureItems[i]?.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {featureItems[i]?.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                {/* ══════ PAYMOB ══════ */}
                <Section dark>
                    <div className="max-w-5xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">

                            {/* Left */}
                            <div className="flex-1">
                                <span className="inline-block bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                                    {t("payment.badge")}
                                </span>
                                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                                    {t("payment.title1")}{" "}
                                    <span className="text-primary">{t("payment.title2")}</span>
                                </h2>
                                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-6">
                                    {t("payment.subtitle")}
                                </p>
                                <ul className="space-y-2.5">
                                    {payMethods.map((method, i) => (
                                        <li key={i} className="flex items-center gap-2.5 text-sm text-white/70 font-medium">
                                            <CheckCircle2 size={14} className="text-primary shrink-0" strokeWidth={2.5} />
                                            {method}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right */}
                            <div className="flex-1 flex flex-col items-center gap-6">
                                {/* Paymob logo card */}
                                <div className="relative w-[140px] max-w-xs h-32 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-2xl">
                                    <Image
                                        src="https://i.ibb.co/m5v0BBPG/images.png"
                                        alt="Paymob"
                                        width={160}
                                        height={50}
                                        className="object-contain"
                                        unoptimized
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                    {/* Fallback always rendered underneath */}
                                    {/* <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-primary" />
                                            <span className="text-[#0f172a] font-black text-2xl tracking-tight">paymob</span>
                                        </div>
                                        <span className="text-[#0f172a]/30 text-xs mt-1">{t("payment.tagline")}</span>
                                    </div> */}
                                </div>

                                {/* Payment method badges */}
                                <div className="flex flex-wrap gap-2.5 justify-center">
                                    {PAYMENT_METHODS.map((brand) => (
                                        <span key={brand} className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-xs font-bold text-white/80">
                                            {brand}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs text-white/30 text-center max-w-xs leading-relaxed">
                                    {t("payment.note")}
                                </p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ══════ 6 — TESTIMONIALS (light) ══════ */}
                <Section dark={false}>
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] mb-3">
                                {t("testimonials.title")}
                            </h2>
                            <p className="text-gray-500 text-lg">{t("testimonials.subtitle")}</p>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {TESTIMONIALS.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                    className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 flex flex-col justify-between min-h-[300px]"
                                >
                                    <div>
                                        <div className="flex gap-0.5 mb-5">
                                            {Array.from({ length: item.stars }).map((_, s) => (
                                                <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-[#0f172a] text-base leading-relaxed font-semibold mb-6">
                                            &quot;{item.quote}&quot;
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 border-t border-gray-50 pt-5">
                                        <div className="relative w-11 h-11 shrink-0">
                                            <Image
                                                src={item.img}
                                                alt={item.name}
                                                fill
                                                className="rounded-full object-cover border-2 border-primary/20"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#0f172a] text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {item.role}{" "}
                                                <span className="text-primary font-bold">@ {item.company}</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* ══════ 7 — TRUST BADGES (dark) ══════ */}
                <Section dark className="py-8 md:py-10">
                    <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {TRUST_BADGES.map((b, i) => {
                            const Icon = ICON_MAP[b.iconName as IconName];
                            return (
                                <div key={b.labelKey} className="flex items-center gap-2.5">
                                    <Icon size={18} className="text-primary" />
                                    <span className="text-sm font-bold text-white/70">{trustLabels[i]}</span>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                {/* ══════ 8 — FAQ (light) ══════ */}
                <Section dark={false}>
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#0f172a] mb-3">
                                {t("faq.title")}
                            </h2>
                            <p className="text-gray-500 text-lg">{t("faq.subtitle")}</p>
                        </motion.div>
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg px-6 md:px-10 py-2">
                            {faqs.map((item, i) => (
                                <FaqRow key={i} q={item.q} a={item.a} index={i} dark={false} />
                            ))}
                        </div>
                    </div>
                </Section>

                {/* ══════ 9 — BOTTOM CTA (dark) ══════ */}
                <Section dark>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center relative overflow-hidden"
                    >
                        {/* Decorative blobs */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-primary blur-3xl" />
                        </div>

                        <div className="relative z-10">
                            <span className="inline-block bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                                {t("cta.badge")}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                                {t("cta.title")}
                            </h2>
                            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
                                {t("cta.subtitle")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/demo"
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition-all text-sm"
                                >
                                    {t("cta.ctaDemo")} <ArrowRight size={16} />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-sm border border-white/10"
                                >
                                    {t("cta.ctaSales")}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </Section>

            </main>

            <Footer />
        </>
    );
}