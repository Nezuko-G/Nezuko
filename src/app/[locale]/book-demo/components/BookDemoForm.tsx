"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function BookDemoForm() {
    const t = useTranslations("bookDemo");

    const EMPLOYEE_RANGES = [
        t("form.employees.range1"),
        t("form.employees.range2"),
        t("form.employees.range3"),
        t("form.employees.range4"),
    ];

    const INTERESTS = [
        t("form.interests.all"),
        t("form.interests.coreHR"),
        t("form.interests.talent"),
        t("form.interests.spend"),
    ];

    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (item: string) => {
        const allLabel = t("form.interests.all");
        if (item === allLabel) {
            setSelectedInterests(selectedInterests.includes(allLabel) ? [] : [allLabel]);
        } else {
            setSelectedInterests((prev) =>
                prev.includes(item)
                    ? prev.filter((i) => i !== item)
                    : [...prev.filter((i) => i !== allLabel), item]
            );
        }
    };

    return (
        <section className="min-h-screen bg-secondary flex items-center justify-center px-4 pt-32 pb-20">            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Hero Text */}
            <div className="text-white space-y-6">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                    {t("hero.titleLine1")} <br />
                    {t("hero.titleLine2")} <br />
                    <span className="text-primary">{t("hero.titleLine3")}</span>
                </h1>
                <p className="text-white/60 text-lg max-w-sm">
                    {t("hero.subtitle")}
                </p>
                <ul className="space-y-3 pt-2">
                    {[
                        t("hero.features.feature1"),
                        t("hero.features.feature2"),
                        t("hero.features.feature3"),
                    ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                            <span className="w-5 h-5 rounded-full border border-primary flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 12 12">
                                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right: Form Card */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl space-y-6">
                <div>
                    <h2 className="text-gray-900 text-xl font-bold">{t("form.title")}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {t("form.careersPrompt")}{" "}
                        <a href="#" className="underline hover:text-primary transition-colors">
                            {t("form.careersLink")}
                        </a>{" "}
                        {t("form.careersInstead")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder={t("form.fields.fullName")}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition" />
                    <input type="email" placeholder={t("form.fields.email")}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition" />
                    <input type="text" placeholder={t("form.fields.companyName")}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition" />
                    <input type="text" placeholder={t("form.fields.jobTitle")}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 transition" />
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                    <span className="text-gray-500 text-sm shrink-0">🇸🇦 +966</span>
                    <span className="w-px h-5 bg-gray-200 shrink-0" />
                    <input type="tel" placeholder={t("form.fields.phone")}
                        className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none" />
                </div>

                {/* Employee Range */}
                <div className="space-y-2">
                    <label className="text-gray-600 text-sm font-medium">{t("form.employees.label")}</label>
                    <div className="flex gap-2 flex-wrap">
                        {EMPLOYEE_RANGES.map((range) => (
                            <button key={range} onClick={() => setSelectedRange(range)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${selectedRange === range
                                    ? "bg-primary text-secondary border-primary"
                                    : "border-gray-200 text-gray-600 hover:border-primary/50 bg-gray-50"
                                    }`}>
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Interests */}
                <div className="space-y-2">
                    <label className="text-gray-600 text-sm font-medium">{t("form.interests.label")}</label>
                    <div className="flex gap-x-4 gap-y-2 flex-wrap">
                        {INTERESTS.map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer group">
                                <div onClick={() => toggleInterest(item)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedInterests.includes(item)
                                        ? "bg-primary border-primary"
                                        : "border-gray-300 group-hover:border-primary/50"
                                        }`}>
                                    {selectedInterests.includes(item) && (
                                        <svg className="w-2.5 h-2.5 text-secondary" fill="none" viewBox="0 0 10 10">
                                            <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-gray-700 text-sm">{item}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button className="w-full bg-primary hover:bg-primary/90 text-secondary font-black py-3.5 rounded-xl transition-all active:scale-95 tracking-wide uppercase text-sm">
                    {t("form.submit")}
                </button>

                <p className="text-gray-400 text-xs text-center">
                    {t("form.privacyText")}{" "}
                    <a href="#" className="underline hover:text-primary transition-colors">
                        {t("form.termsLink")}
                    </a>
                </p>
            </div>

        </div>
        </section>
    );
}