'use client'

import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const t = useTranslations("auth");

    return (
        <div className="flex min-h-screen flex-row">
            <div className="w-1/2 bg-secondary text-white p-12 flex flex-col justify-between overflow-hidden relative pb-0">

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

            <div className="w-1/2 bg-white flex flex-col">

                <div className="flex justify-end p-4">
                    <LangSwitcher />
                </div>

                <div className="flex-1 flex items-center justify-center px-16">
                    <div className="w-full max-w-md space-y-4">

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


                        <button className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                            {t("form.submit")}
                        </button>

                    </div>
                </div>
            </div>

        </div>
    )
}