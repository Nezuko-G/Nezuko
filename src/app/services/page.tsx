"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    Check,
    ChevronDown,
    ChevronUp,
    Star,
    ArrowRight,
    Upload,
    X,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    SERVICES,
    PORTAL_FEATURES,
    TRUST_BADGES,
    TESTIMONIALS,
    ICON_MAP,
    type IconName,
} from "./utils/services.utils";


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
        <section
            className={`w-full py-16 md:py-20 px-4 md:px-6 ${dark ? DARK_BG : LIGHT_BG} ${className}`}
        >
            {children}
        </section>
    );
}

function FaqRow({
    q,
    a,
    index,
    dark,
}: {
    q: string;
    a: string;
    index: number;
    dark: boolean;
}) {
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
                <span
                    className={`font-semibold text-sm md:text-base transition-colors group-hover:text-primary ${dark ? "text-white/80" : "text-secondary"}`}
                >
                    {q}
                </span>
                <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:text-primary
          ${dark ? "bg-white/10 text-white/40" : "bg-gray-100 text-gray-400"}`}
                >
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
                        <p
                            className={`pb-5 text-sm leading-relaxed ${dark ? "text-white/50" : "text-gray-500"}`}
                        >
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function PortalScreenshot({ label, sub, uploaded }: { label: string; sub: string; uploaded: string }) {
    const [img, setImg] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleFile(file: File) {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => setImg(e.target?.result as string);
        reader.readAsDataURL(file);
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    return (
        <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !img && inputRef.current?.click()}
            className={`relative w-full rounded-2xl overflow-hidden border transition-all
        ${img
                    ? "border-white/10 cursor-default"
                    : "border-dashed border-white/20 hover:border-primary/60 cursor-pointer bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
            style={{ minHeight: 320 }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {img ? (
                <>
                    <Image
                        src={img}
                        alt="Portal screenshot"
                        fill
                        className="object-cover rounded-2xl"
                        unoptimized
                    />
                    {/* Remove button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setImg(null); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition z-10"
                    >
                        <X size={14} />
                    </button>
                    {/* Uploaded badge */}
                    <span className="absolute bottom-3 left-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                        {uploaded}
                    </span>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 h-full py-16 px-8 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Upload size={22} className="text-white/30" />
                    </div>
                    <p className="text-white/60 text-sm font-semibold">{label}</p>
                    <p className="text-white/25 text-xs">{sub}</p>
                </div>
            )}
        </div>
    );
}

export default function ServicesPage() {
    const t = useTranslations("services");

    const faqs = t.raw("faq.items") as { q: string; a: string }[];
    const trustLabels = t.raw("trust") as string[];
    const serviceItems = t.raw("services.items") as Record<string, string>;
    const portalFeatureLabels = t.raw("portal.features") as Record<string, string>;

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
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/book-demo"
                                className="inline-flex items-center justify-center gap-2 bg-primary text-secondry font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition-all text-sm"
                            >
                                {t("hero.cta")} <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/15 transition-all text-sm border border-white/10"
                            >
                                {t("hero.ctaSales")}
                            </Link>
                        </div>
                    </motion.div>
                </Section>

                {/* ══════ SERVICES GRID ══════ */}
                <Section dark={false}>
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-3">
                                {t("services.title")}
                            </h2>
                            <p className="text-gray-500 text-base max-w-xl mx-auto">
                                {t("services.subtitle")}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {SERVICES.map((s, i) => {
                                const Icon = ICON_MAP[s.iconName as IconName];
                                const title = serviceItems[s.titleKey];
                                const desc = serviceItems[s.descKey];
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className={`bg-white rounded-2xl border shadow-sm p-6 relative overflow-hidden transition-all
                      ${s.highlight
                                                ? "border-primary/30 ring-1 ring-primary/20 shadow-primary/10"
                                                : "border-gray-100"
                                            }`}
                                    >
                                        {s.highlight && (
                                            <span className="absolute top-4 right-4 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                                                مميّز
                                            </span>
                                        )}
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon size={20} className="text-primary" />
                                        </div>
                                        <h3 className="font-extrabold text-[#0f172a] text-base mb-1.5">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </Section>

                {/* ══════ PORTAL SPOTLIGHT ══════ */}
                <Section dark>
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-center">

                            {/* Left — text + features */}
                            <div className="flex-1">
                                <span className="inline-block bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                                    {t("portal.badge")}
                                </span>
                                <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
                                    {t("portal.title1")}{" "}
                                    <span className="text-primary">{t("portal.title2")}</span>
                                </h2>
                                <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8">
                                    {t("portal.subtitle")}
                                </p>
                                <ul className="space-y-3">
                                    {PORTAL_FEATURES.map((f, i) => {
                                        const Icon = ICON_MAP[f.iconName as IconName];
                                        const label = portalFeatureLabels[f.labelKey];
                                        return (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                                                    <Icon size={14} className="text-primary" />
                                                </span>
                                                <span className="text-white/75 text-sm font-medium">{label}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Right — portal screenshot */}
                            <div className="flex-1 w-full">
                                <Image
                                    src="https://i.ibb.co/rRZXJ6Fn/Screenshot-2026-05-11-153415.png"
                                    alt="Portal Screenshot"
                                    width={1400}
                                    height={900}
                                    className="w-full h-auto rounded-2xl shadow-2xl scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ══════ TRUST BADGES ══════ */}
                <Section dark className="py-8 md:py-10">
                    <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        {TRUST_BADGES.map((b, i) => {
                            const Icon = ICON_MAP[b.iconName as IconName];
                            return (
                                <div key={b.labelKey} className="flex items-center gap-2.5">
                                    <Icon size={18} className="text-primary" />
                                    <span className="text-sm font-bold text-white/70">
                                        {trustLabels[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                {/* ══════ TESTIMONIALS ══════ */}
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
                                    className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 flex flex-col justify-between min-h-[280px]"
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

                {/* ══════ FAQ ══════ */}
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

                {/* ══════ BOTTOM CTA ══════ */}
                <Section dark>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center relative overflow-hidden py-4 rounded-xl"
                    >
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
                                    href="/book-demo"
                                    className="inline-flex items-center justify-center gap-2 bg-primary text-secondry font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-primary/90 transition-all text-sm"
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