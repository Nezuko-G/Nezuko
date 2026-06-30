"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Tag,
  Search,
  ChevronRight,
  Rss,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

const CATEGORIES = [
  "all",
  "ai-hr",
  "recruitment",
  "performance",
  "case-study",
] as const;
type Category = (typeof CATEGORIES)[number];

interface BlogPost {
  slug: string;
  category: Exclude<Category, "all">;
  coverImg: string;
  readingTime: number;
  featured?: boolean;
}

const POSTS: BlogPost[] = [
  {
    slug: "ai-hiring-bias",
    category: "ai-hr",
    coverImg:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    readingTime: 6,
    featured: true,
  },
  {
    slug: "smart-screening",
    category: "recruitment",
    coverImg:
      "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&q=80",
    readingTime: 5,
  },
  {
    slug: "performance-360",
    category: "performance",
    coverImg:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    readingTime: 7,
  },
  {
    slug: "sabic-case-study",
    category: "case-study",
    coverImg:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    readingTime: 8,
  },
  {
    slug: "onboarding-automation",
    category: "ai-hr",
    coverImg:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
    readingTime: 5,
  },
  {
    slug: "talent-analytics",
    category: "performance",
    coverImg:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    readingTime: 9,
  },
  {
    slug: "telecom-case-study",
    category: "case-study",
    coverImg:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    readingTime: 6,
  },
  {
    slug: "job-description-ai",
    category: "recruitment",
    coverImg:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    readingTime: 4,
  },
];

export default function BlogsPage() {
  const t = useTranslations("blogs");

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryLabels = t.raw("categories") as Record<string, string>;
  const posts = t.raw("posts") as Record<
    string,
    {
      title: string;
      excerpt: string;
      author: string;
      authorRole: string;
      date: string;
    }
  >;

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const postData = posts[p.slug];
    const matchSearch =
      searchQuery === "" ||
      postData?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      postData?.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = POSTS.find((p) => p.featured);
  const featuredData = featured ? posts[featured.slug] : null;

  return (
    <>
      <Navbar />

      <main className="w-full overflow-hidden">
        {/* ══════ HERO ══════ */}
        <Section dark className="pt-28 md:pt-32 pb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center mb-14"
            >
              <span className="inline-flex items-center gap-2 bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Rss size={12} />
                {t("hero.badge")}
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                {t("hero.title1")}{" "}
                <span className="text-primary">{t("hero.title2")}</span>
              </h1>
              <p className="text-white/50 text-lg md:text-xl leading-relaxed max-w-2xl mb-10">
                {t("hero.subtitle")}
              </p>

              {/* Search */}
              <div className="relative w-full max-w-lg">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("hero.searchPlaceholder")}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/8 transition-all"
                />
              </div>
            </motion.div>

            {/* Featured post */}
            {featured && featuredData && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Link href={`/blogs/${featured.slug}`} className="group block">
                  <div className="relative rounded-4xl overflow-hidden border border-white/10 shadow-2xl">
                    <div className="relative h-64 md:h-105 w-full">
                      <Image
                        src={featured.coverImg}
                        alt={featuredData.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-secondary via-secondary/60 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/20 text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          {t("featured")}
                        </span>
                        <span className="bg-white/10 text-white/60 text-xs font-bold px-3 py-1 rounded-full capitalize">
                          {categoryLabels[featured.category]}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                        {featuredData.title}
                      </h2>
                      <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mb-6 hidden md:block">
                        {featuredData.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary font-extrabold text-xs">
                            {featuredData.author[0]}
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold">
                              {featuredData.author}
                            </p>
                            <p className="text-white/40 text-xs">
                              {featuredData.date}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 text-white/40 text-xs">
                          <Clock size={12} />
                          {featured.readingTime} {t("minRead")}
                        </span>
                        <span className="ml-auto flex items-center gap-1.5 text-primary text-sm font-bold group-hover:gap-3 transition-all">
                          {t("readMore")} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </Section>

        {/* ══════ BLOG GRID ══════ */}
        <Section dark={false}>
          <div className="max-w-6xl mx-auto">
            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap mb-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border border-gray-100 text-gray-500 hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {cat !== "all" && <Tag size={11} />}
                  {categoryLabels[cat]}
                </button>
              ))}
              <span className="ml-auto text-xs text-gray-400 font-medium">
                {filtered.length} {t("results")}
              </span>
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 text-gray-400"
                >
                  <p className="text-xl font-bold mb-2">
                    {t("noResults.title")}
                  </p>
                  <p className="text-sm">{t("noResults.subtitle")}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filtered
                    .filter(
                      (p) =>
                        !p.featured ||
                        activeCategory !== "all" ||
                        searchQuery !== "",
                    )
                    .map((post, i) => {
                      const data = posts[post.slug];
                      if (!data) return null;
                      return (
                        <motion.div
                          key={post.slug}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.4, delay: i * 0.06 }}
                        >
                          <Link
                            href={`/blogs/${post.slug}`}
                            className="group block h-full"
                          >
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                              <div className="relative h-48 overflow-hidden">
                                <Image
                                  src={post.coverImg}
                                  alt={data.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                  unoptimized
                                />
                                <div className="absolute top-3 left-3">
                                  <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-lg text-primary capitalize">
                                    {categoryLabels[post.category]}
                                  </span>
                                </div>
                              </div>
                              <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                  <span className="flex items-center gap-1">
                                    <Clock size={11} />
                                    {post.readingTime} {t("minRead")}
                                  </span>
                                  <span>·</span>
                                  <span>{data.date}</span>
                                </div>
                                <h3 className="font-extrabold text-[#0f172a] text-base leading-snug mb-2 group-hover:text-primary transition-colors">
                                  {data.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-5 line-clamp-3">
                                  {data.excerpt}
                                </p>
                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-xs">
                                      {data.author[0]}
                                    </div>
                                    <span className="text-xs font-bold text-[#0f172a]">
                                      {data.author}
                                    </span>
                                  </div>
                                  <span className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                                    {t("readMore")} <ChevronRight size={12} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ══════ NEWSLETTER CTA ══════ */}
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
              <span className="inline-flex items-center gap-2 bg-primary/15 text-primary text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                <Rss size={12} />
                {t("newsletter.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                {t("newsletter.title")}
              </h2>
              <p className="text-white/40 text-base mb-8 max-w-lg mx-auto">
                {t("newsletter.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-all"
                />
                <button className="flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-all text-sm whitespace-nowrap">
                  {t("newsletter.cta")} <ArrowRight size={14} />
                </button>
              </div>
              <p className="text-white/20 text-xs mt-4">
                {t("newsletter.note")}
              </p>
            </div>
          </motion.div>
        </Section>
      </main>

      <Footer />
    </>
  );
}
