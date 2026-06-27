"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InterestKey } from "../types/book-demo.types";
import { CheckCircle } from "lucide-react";
import { useBookDemoForm } from "../hooks/useBookDemoForm";

export default function BookDemoForm() {
    const t = useTranslations("bookDemo");

    const EMPLOYEE_RANGES: { value: string; label: string }[] = [
        { value: "1-25", label: t("form.employees.range1") },
        { value: "26-100", label: t("form.employees.range2") },
        { value: "101-250", label: t("form.employees.range3") },
        { value: "250+", label: t("form.employees.range4") },
    ];

    const INTERESTS: { key: InterestKey | "all"; label: string }[] = [
        { key: "all", label: t("form.interests.all") },
        { key: "coreHR", label: t("form.interests.coreHR") },
        { key: "talent", label: t("form.interests.talent") },
        { key: "spend", label: t("form.interests.spend") },
    ];

    const {
        fullName,
        setFullName,
        email,
        setEmail,
        companyName,
        setCompanyName,
        jobTitle,
        setJobTitle,
        phone,
        setPhone,
        selectedRange,
        setSelectedRange,
        selectedInterests,
        toggleInterest,
        isLoading,
        error,
        success,
        setSuccess,
        handleSubmit,
    } = useBookDemoForm();

    return (
        <>
            {/* Success Popup */}
            {success && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="text-gray-900 text-xl font-bold">
                                {t("success.title")}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {t("success.message")}
                            </p>
                        </div>

                        <Button
                            onClick={() => setSuccess(false)}
                            className="w-full text-secondary font-bold mt-2"
                        >
                            {t("success.cta")}
                        </Button>
                    </div>
                </div>
            )}

            <section className="min-h-screen bg-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Hero — desktop */}
                    <div className="hidden lg:flex flex-col text-white space-y-6">
                        <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-tight">
                            {t("hero.titleLine1")} <br />
                            {t("hero.titleLine2")} <br />
                            <span className="text-primary">{t("hero.titleLine3")}</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-sm">{t("hero.subtitle")}</p>
                        <ul className="space-y-3 pt-2">
                            {(["feature1", "feature2", "feature3"] as const).map((f) => (
                                <li key={f} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                                    <span className="w-5 h-5 rounded-full border border-primary flex items-center justify-center shrink-0">
                                        <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 12 12">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                    {t(`hero.features.${f}`)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hero — mobile */}
                    <div className="lg:hidden text-white text-center space-y-3">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                            {t("hero.titleLine1")} {t("hero.titleLine2")}{" "}
                            <span className="text-primary">{t("hero.titleLine3")}</span>
                        </h1>
                        <p className="text-white/60 text-sm sm:text-base max-w-sm mx-auto">{t("hero.subtitle")}</p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 shadow-2xl space-y-5 sm:space-y-6 w-full"
                    >
                        <div>
                            <h2 className="text-gray-900 text-lg sm:text-xl font-bold">{t("form.title")}</h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                {t("form.careersPrompt")}{" "}
                                <a href="https://nezuko-portal.vercel.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-primary transition-colors">
                                    {t("form.careersLink")}
                                </a>{" "}
                                {t("form.careersInstead")}
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <Input placeholder={t("form.fields.fullName")} value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary/60" />
                            <Input placeholder={t("form.fields.email")} value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary/60" />
                            <Input placeholder={t("form.fields.companyName")} value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary/60" />
                            <Input placeholder={t("form.fields.jobTitle")} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary/60" />
                        </div>

                        <Input
                            type="tel"
                            placeholder={t("form.fields.phone")}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-primary/60"
                        />

                        <div className="space-y-2">
                            <label className="text-gray-600 text-sm font-medium">{t("form.employees.label")}</label>
                            <div className="flex gap-2 flex-wrap">
                                {EMPLOYEE_RANGES.map(({ value, label }) => (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setSelectedRange(value)}
                                        className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all ${selectedRange === value
                                            ? "bg-primary text-secondary border-primary"
                                            : "border-gray-200 text-gray-600 hover:border-primary/50 bg-gray-50"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-600 text-sm font-medium">{t("form.interests.label")}</label>
                            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-2">
                                {INTERESTS.map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                        <div
                                            onClick={() => toggleInterest(key)}
                                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${selectedInterests.has(key)
                                                ? "bg-primary border-primary"
                                                : "border-gray-300 group-hover:border-primary/50"
                                                }`}
                                        >
                                            {selectedInterests.has(key) && (
                                                <svg className="w-2.5 h-2.5 text-secondary" fill="none" viewBox="0 0 10 10">
                                                    <path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-gray-700 text-sm">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-secondary font-black tracking-wide uppercase text-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    {t("form.submitting")}
                                </span>
                            ) : (
                                t("form.submit")
                            )}
                        </Button>

                        <p className="text-gray-400 text-xs text-center">
                            {t("form.privacyText")}{" "}
                            <a href="#" className="underline hover:text-primary transition-colors">
                                {t("form.termsLink")}
                            </a>
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
}