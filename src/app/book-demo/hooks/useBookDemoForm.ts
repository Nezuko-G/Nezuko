"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookDemoPayload, EMPLOYEE_RANGE_MAP, INTEREST_MAP, InterestKey } from "../types/book-demo.types";
import { bookDemo } from "@/lib/api/endpoints/book-demo";

export function useBookDemoForm() {
    const t = useTranslations("bookDemo");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedRange, setSelectedRange] = useState<string | null>(null);
    const [selectedInterests, setSelectedInterests] = useState<Set<InterestKey | "all">>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const toggleInterest = (key: InterestKey | "all") => {
        setSelectedInterests((prev) => {
            const next = new Set(prev);
            if (key === "all") {
                next.has("all") ? next.clear() : (next.clear(), next.add("all"));
            } else {
                next.delete("all");
                next.has(key) ? next.delete(key) : next.add(key);
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!fullName.trim() || !email.trim() || !companyName.trim()) {
            setError(t("form.validation.requiredFields"));
            return;
        }

        const interests: string[] = selectedInterests.has("all")
            ? Object.values(INTEREST_MAP)
            : [...selectedInterests]
                .filter((k): k is InterestKey => k !== "all")
                .map((k) => INTEREST_MAP[k]);

        const payload: BookDemoPayload = {
            fullName: fullName.trim(),
            email: email.trim(),
            companyName: companyName.trim(),
            jobTitle: jobTitle.trim(),
            phone: phone.trim(),
            interests,
        };

        if (selectedRange) {
            payload.employeeCount = EMPLOYEE_RANGE_MAP[selectedRange];
        }

        setIsLoading(true);
        try {
            const res = await bookDemo(payload);

            if (res.error) {
                throw new Error(typeof res.error === 'string' ? res.error : t("form.validation.bookingError"));
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : t("form.validation.bookingError"));
        } finally {
            setIsLoading(false);
        }
    };

    return {
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
    };
}
