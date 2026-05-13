"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DARK_BG = "bg-[#000028]";

const POSTS_META: Record<string, { category: string; coverImg: string; readingTime: number }> = {
    "ai-hiring-bias": { category: "ai-hr", coverImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=85", readingTime: 6 },
    "smart-screening": { category: "recruitment", coverImg: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=1200&q=85", readingTime: 5 },
    "performance-360": { category: "performance", coverImg: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85", readingTime: 7 },
    "sabic-case-study": { category: "case-study", coverImg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85", readingTime: 8 },
    "onboarding-automation": { category: "ai-hr", coverImg: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85", readingTime: 5 },
    "talent-analytics": { category: "performance", coverImg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85", readingTime: 9 },
    "telecom-case-study": { category: "case-study", coverImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85", readingTime: 6 },
    "job-description-ai": { category: "recruitment", coverImg: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=85", readingTime: 4 },
};

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const t = useTranslations("blogs");

    const meta = POSTS_META[id];
    if (!meta) notFound();

    const posts = t.raw("posts") as Record<string, {
        title: string; excerpt: string; author: string; authorRole: string;
        date: string; content: { heading: string; body: string }[]; tags: string[];
    }>;
    const categoryLabels = t.raw("categories") as Record<string, string>;
    const post = posts[id];
    if (!post) notFound();

    const related = Object.entries(POSTS_META)
        .filter(([s, p]) => s !== id && p.category === meta.category)
        .slice(0, 2)
        .map(([s, p]) => ({ slug: s, ...p, title: posts[s]?.title ?? "", date: posts[s]?.date ?? "" }));

    return (
        <>
            <Navbar />
            <main className="w-full overflow-hidden">

                {/* HERO */}
                <div className={`w-full ${DARK_BG} pt-28 md:pt-32 pb-0`}>
                    <div className="max-w-4xl mx-auto px-4 md:px-6 pb-10">
                        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                            <Link href="/blogs" className="inline-flex items-center gap-2 text-white/40 hover:text-primary text-sm font-bold transition-colors mb-8">
                                <ArrowLeft size={15} /> {t("post.back")}
                            </Link>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <div className="flex items-center gap-2 flex-wrap mb-5">
                                <span className="bg-primary/20 text-primary text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {categoryLabels[meta.category]}
                                </span>
                                {post.tags?.map((tag) => (
                                    <span key={tag} className="bg-white/10 text-white/40 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                                        <Tag size={10} /> {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">{post.title}</h1>
                            <p className="text-white/50 text-lg leading-relaxed mb-8">{post.excerpt}</p>
                            <div className="flex items-center gap-4 pb-10 border-b border-white/10">
                                <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-extrabold text-base shrink-0">
                                    {post.author[0]}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{post.author}</p>
                                    <p className="text-white/40 text-xs">{post.authorRole}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-5 text-white/30 text-xs">
                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {meta.readingTime} {t("minRead")}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="max-w-5xl mx-auto px-4 md:px-6">
                        <div className="relative h-64 md:h-[480px] rounded-t-[2rem] overflow-hidden">
                            <Image src={meta.coverImg} alt={post.title} fill className="object-cover" priority unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000028]/40 to-transparent" />
                        </div>
                    </motion.div>
                </div>

                {/* ARTICLE BODY */}
                <div className="w-full bg-[#f8fafc] px-4 md:px-6 py-16 md:py-20">
                    <div className="max-w-3xl mx-auto">
                        {post.content?.map((section, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="mb-10">
                                {section.heading && (
                                    <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a] mb-4 flex items-center gap-3">
                                        <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                                        {section.heading}
                                    </h2>
                                )}
                                <p className="text-[#334155] leading-[1.85] text-base md:text-[1.05rem]">{section.body}</p>
                            </motion.div>
                        ))}
                        {post.tags?.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap pt-8 border-t border-gray-100 mt-6">
                                <span className="text-xs text-gray-400 font-bold mr-1">{t("post.tags")}:</span>
                                {post.tags.map((tag) => (
                                    <span key={tag} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg">#{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RELATED */}
                {related.length > 0 && (
                    <div className="w-full bg-white px-4 md:px-6 py-16 border-t border-gray-100">
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-xl font-extrabold text-[#0f172a] mb-8">{t("post.related")}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {related.map((rel, i) => (
                                    <motion.div key={rel.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                                        <Link href={`/blogs/${rel.slug}`} className="group flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all">
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                <Image src={rel.coverImg} alt={rel.title} fill className="object-cover" unoptimized />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-xs text-primary font-bold mb-1 capitalize">{categoryLabels[rel.category]}</span>
                                                <p className="text-sm font-extrabold text-[#0f172a] leading-snug group-hover:text-primary transition-colors line-clamp-2">{rel.title}</p>
                                                <span className="flex items-center gap-1 text-xs text-gray-400 mt-1.5"><Clock size={10} /> {rel.readingTime} {t("minRead")}</span>
                                            </div>
                                            <ChevronRight size={16} className="ml-auto self-center text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* BACK */}
                <div className={`w-full ${DARK_BG} px-4 py-12 text-center`}>
                    <Link href="/blogs" className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/15 transition-all text-sm">
                        <ArrowLeft size={14} /> {t("post.backAll")}
                    </Link>
                </div>

            </main>
            <Footer />
        </>
    );
}