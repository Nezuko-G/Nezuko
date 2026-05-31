import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

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

export function generateStaticParams() {
    return Object.keys(POSTS_META).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations("blogs");

    const meta = POSTS_META[slug];
    if (!meta) notFound();

    const posts = t.raw("posts") as Record<
        string,
        { title: string; excerpt: string; author: string; authorRole: string; date: string; content: { heading: string; body: string }[]; tags: string[] }
    >;
    const categoryLabels = t.raw("categories") as Record<string, string>;
    const post = posts[slug];
    if (!post) notFound();

    const related = Object.entries(POSTS_META)
        .filter(([s, p]) => s !== slug && p.category === meta.category)
        .slice(0, 2)
        .map(([s, p]) => ({ slug: s, ...p, title: posts[s]?.title ?? "", date: posts[s]?.date ?? "" }));

    return (
        <BlogPostClient
            slug={slug}
            meta={meta}
            post={post}
            related={related}
            categoryLabels={categoryLabels}
            minReadLabel={t("minRead")}
            backLabel={t("post.back")}
            backAllLabel={t("post.backAll")}
            tagsLabel={t("post.tags")}
            relatedLabel={t("post.related")}
        />
    );
}
