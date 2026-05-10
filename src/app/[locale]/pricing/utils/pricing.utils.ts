import {
    Users, CalendarClock, BarChart3, Zap,
    Shield, HeadphonesIcon, Lock, Building2, BadgeCheck,
} from "lucide-react";

export interface FaqItem {
    q: string;
    a: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
    img: string;
    stars: number;
}

export interface FeatureItem {
    iconName: string;
    titleKey: string;
    descKey: string;
}

export interface TrustBadge {
    iconName: string;
    labelKey: string;
}

export const ICON_MAP = {
    Users,
    CalendarClock,
    BarChart3,
    Zap,
    Shield,
    HeadphonesIcon,
    Lock,
    Building2,
    BadgeCheck,
} as const;

export type IconName = keyof typeof ICON_MAP;




export const INCLUDED_KEYS = [
    "included.0",
    "included.1",
    "included.2",
    "included.3",
    "included.4",
    "included.5",
    "included.6",
    "included.7",
    "included.8",
    "included.9",
    "included.10",
    "included.11",
] as const;

export const FEATURES: FeatureItem[] = [
    { iconName: "Users", titleKey: "features.0.title", descKey: "features.0.desc" },
    { iconName: "CalendarClock", titleKey: "features.1.title", descKey: "features.1.desc" },
    { iconName: "BarChart3", titleKey: "features.2.title", descKey: "features.2.desc" },
    { iconName: "Zap", titleKey: "features.3.title", descKey: "features.3.desc" },
    { iconName: "Shield", titleKey: "features.4.title", descKey: "features.4.desc" },
    { iconName: "HeadphonesIcon", titleKey: "features.5.title", descKey: "features.5.desc" },
];

export const TRUST_BADGES: TrustBadge[] = [
    { iconName: "Shield", labelKey: "trust.0" },
    { iconName: "Lock", labelKey: "trust.1" },
    { iconName: "BadgeCheck", labelKey: "trust.2" },
    { iconName: "Building2", labelKey: "trust.3" },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "We cut payroll processing time by 70% in the first month. The system just works — and the demo team made switching completely painless.",
        name: "Layla Hassan",
        role: "HR Director",
        company: "Delta Textiles",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        stars: 5,
    },
    {
        quote: "Managing 3 branches used to be a nightmare. Now attendance, leave, and payroll all live in one place. Best decision we made this year.",
        name: "Karim Nasser",
        role: "Operations Manager",
        company: "Al Salam Logistics",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        stars: 5,
    },
    {
        quote: "The onboarding was incredibly smooth. Within two weeks, our entire HR team was fully operational on the platform with zero disruption.",
        name: "Nour El-Din",
        role: "CEO",
        company: "TechZone Egypt",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
        stars: 5,
    },
];

export const HOW_IT_WORKS = [
    { step: "01", iconName: "CalendarClock", titleKey: "steps.0.title", descKey: "steps.0.desc" },
    { step: "02", iconName: "BarChart3", titleKey: "steps.1.title", descKey: "steps.1.desc" },
    { step: "03", iconName: "Zap", titleKey: "steps.2.title", descKey: "steps.2.desc" },
] as const;

export const PAYMENT_METHODS = ["Visa", "Mastercard", "Meeza", "Fawry", "Instapay"] as const;

export const PAYMENT_FEATURES_KEYS = [
    "payment.methods.0",
    "payment.methods.1",
    "payment.methods.2",
    "payment.methods.3",
    "payment.methods.4",
] as const;

export const FAQ_COUNT = 6;