'use client'

import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
    const t = useTranslations("auth");
    const locale = useLocale();

    return (
        <div className="flex min-h-screen flex-col md:flex-row">

            {/* Left Section (Hidden on Mobile) */}
            <div className="hidden md:flex md:w-1/2 min-h-[300px] bg-secondary text-white p-12 flex-col justify-between overflow-hidden relative pb-0">

                <div>
                    <h1 className="text-2xl font-bold mb-8">{t("brand")}</h1>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold">{t("features.payroll")}</h2>
                        <h2 className="text-3xl font-bold">{t("features.attendance")}</h2>
                        <h2 className="text-3xl font-bold">{t("features.hr")}</h2>
                        <h2 className="text-3xl font-bold">{t("features.more")}</h2>
                    </div>
                    <p className="mt-4 text-gray-400">{t("tagline")}</p>
                </div>

                <div className="relative flex justify-center items-end h-[420px]">

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full border border-white/10" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-white/10" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full border border-white/10" />

                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-blue-500 opacity-15 blur-3xl" />

                    <div className="absolute top-16 left-12 w-2 h-2 rounded-full bg-white/30" />
                    <div className="absolute top-24 right-10 w-3 h-3 rounded-full bg-primary/50" />
                    <div className="absolute bottom-20 left-8 w-2 h-2 rounded-full bg-white/20" />

                    <Image
                        src="https://i.ibb.co/r2p3NPDQ/image-1776524184625-webp-image-removebg-preview.png"
                        alt="hero"
                        fill
                        className="object-contain object-bottom"
                        style={{
                            filter: "drop-shadow(0px 0px 50px rgba(99, 179, 237, 0.4))"
                        }}
                        priority
                    />
                </div>

            </div>

            {/* Right Section */}
            <div className="w-full md:w-1/2 bg-gray-100 flex flex-col min-h-screen">

                {/* Language Switcher */}
                <div className="flex justify-between p-4">
                    <Link href="/" className="text-sm text-gray-600 hover:text-black">
                        ← Home
                    </Link>
                    <LangSwitcher />
                </div>

                {/* Centered Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 space-y-4">

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 -mt-20 md:-mt-6 tracking-tight mb-12">
                        {t("brand")}
                    </h1>

                    {/* Form Card */}
                    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 min-h-[450px] flex flex-col">

                        <div className="space-y-5">

                            {/* Company Email */}
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">
                                    {t("form.companyEmail")}
                                </label>
                                <input
                                    type="email"
                                    defaultValue="admin@techcorp.com"
                                    placeholder="admin@company.com"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            {/* User Email */}
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">
                                    {t("form.userEmail")}
                                </label>
                                <input
                                    type="email"
                                    defaultValue="hr@techcorp.com"
                                    placeholder="hr@company.com"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm text-gray-600 block mb-1">
                                    {t("form.password")}
                                </label>
                                <input
                                    type="password"
                                    defaultValue="Password123"
                                    placeholder="••••••••"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                                />
                            </div>

                        </div>

                        <button className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mt-10">
                            {t("form.submit")}
                        </button>

                    </div>

                </div>
            </div>

        </div>
    )
}