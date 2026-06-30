/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useProfile, useUpdateAvatar } from "./hooks/useProfile";
import { useAuthStore } from "@/hooks/useAuthStore";
import { fetchImageAsBase64, isAvatarStale } from "@/lib/avatar";
import ProfileHeader from "./components/ProfileHeader";
import ProfileSections from "./components/ProfileSections";

function ProfileSkeleton() {
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-6 animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 shrink-0 bg-card rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                    <div className="w-full space-y-2 pt-4 border-t border-gray-100">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-3/4 bg-gray-200 rounded" />
                    </div>
                </div>
                <div className="flex-1">
                    <div className="h-10 w-full bg-gray-200 rounded-lg" />
                    <div className="mt-4 bg-card rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-16 bg-gray-200 rounded-xl" />
                            <div className="h-16 bg-gray-200 rounded-xl" />
                            <div className="h-16 bg-gray-200 rounded-xl" />
                            <div className="h-16 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileError({ onRetry }: { onRetry: () => void }) {
    const t = useTranslations("profile");
    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
            <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-4 text-center max-w-md">
                <div className="w-12 h-12 rounded-full bg-status-error/10 flex items-center justify-center">
                    <AlertCircle size={24} className="text-status-error" />
                </div>
                <p className="text-content-muted text-sm">{t("errorMessage")}</p>
                <button
                    onClick={onRetry}
                    className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow hover:opacity-90 transition"
                >
                    {t("retry")}
                </button>
            </div>
        </div>
    );
}



export default function ProfilePage() {
    const t = useTranslations("profile");
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useProfile();
    const { mutate: uploadAvatar, isPending: isUploading } = useUpdateAvatar();
    const avatarBase64 = useAuthStore((s) => s.avatarBase64);
    const setAvatarBase64 = useAuthStore((s) => s.setAvatarBase64);
    const setUserData = useAuthStore((s) => s.setUserData);

    useEffect(() => {
        if (data?.avatarUrl && (isAvatarStale(useAuthStore.getState().avatarUpdatedAt) || !avatarBase64)) {
            fetchImageAsBase64(data.avatarUrl)
                .then((base64) => setAvatarBase64(base64))
                .catch(() => {});
        }
        if (data?.firstName && data?.lastName) {
            const state = useAuthStore.getState();
            if (state.firstName !== data.firstName || state.lastName !== data.lastName) {
                setUserData({ firstName: data.firstName, lastName: data.lastName });
            }
        }
    }, [data?.avatarUrl, data?.firstName, data?.lastName]);

    if (isLoading) return <ProfileSkeleton />;
    if (isError || !data) return <ProfileError onRetry={() => refetch()} />;

    return (
        <div className="p-4 md:p-5 max-w-6xl mx-auto flex flex-col gap-6">
            <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-content-muted hover:text-secondary text-sm font-semibold transition w-fit"
            >
                <ArrowLeft size={16} /> {t("back")}
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                <ProfileHeader
                    data={data}
                    avatarBase64={avatarBase64}
                    onUpload={uploadAvatar}
                    isUploading={isUploading}
                />
                <div className="flex-1 min-w-0">
                    <ProfileSections data={data} />
                </div>
            </div>
        </div>
    );
}
