"use client";

import Image from "next/image";
import LangSwitcher from "./LangSwitcher";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = useState({
    companyEmail: "admin@techcorp.com",
    userEmail: "hr@techcorp.com",
    password: "Password123",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.message ?? "Login failed");
        return;
      }

      const userRole = body.data?.user?.role || body.user?.role;

      if (typeof window !== "undefined") {
        localStorage.setItem("role", userRole || "");
        localStorage.setItem("isAuthenticated", "true");

        if (body.data?.accessToken) {
          localStorage.setItem("accessToken", body.data.accessToken);
        }
      }

      useAuthStore.getState().setRole(userRole || "EMPLOYEE");
      router.push("/dashboard");
    } catch {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
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
              filter: "drop-shadow(0px 0px 50px rgba(99, 179, 237, 0.4))",
            }}
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col min-h-screen">
        <div className="flex justify-between p-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            ← Home
          </Link>
          <LangSwitcher />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 -mt-20 md:-mt-6 tracking-tight mb-12">
            {t("brand")}
          </h1>

          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 min-h-[450px] flex flex-col">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {t("form.companyEmail")}
                </label>
                <input
                  type="email"
                  value={form.companyEmail}
                  onChange={(e) =>
                    setForm({ ...form, companyEmail: e.target.value })
                  }
                  placeholder="admin@company.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {t("form.userEmail")}
                </label>
                <input
                  type="email"
                  value={form.userEmail}
                  onChange={(e) =>
                    setForm({ ...form, userEmail: e.target.value })
                  }
                  placeholder="hr@company.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  {t("form.password")}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mt-10 disabled:opacity-50"
            >
              {loading ? "..." : t("form.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
