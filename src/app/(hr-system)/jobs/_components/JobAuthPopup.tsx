"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useJobsAuth } from "../hooks/useJobs";
import { Loader2, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  onSuccess: () => void;
}

export default function JobAuthPopup({ onSuccess }: Props) {
  const t = useTranslations("jobs.auth");
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useJobsAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["external_jobs"] });
          onSuccess();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-secondary">{t("title")}</h2>
        <p className="text-sm font-medium text-content-muted mt-2 mb-8">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-right">
          <div className="space-y-1">
            <label className="text-sm font-bold text-content-dark">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-content-dark">
              {t("password")}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              required
            />
          </div>

          {loginMutation.isError && (
            <p className="text-xs font-bold text-status-error text-center mt-2">
              {t("error")}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loginMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              t("loginBtn")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
