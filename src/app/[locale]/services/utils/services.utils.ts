import {
    Briefcase,
    FileText,
    Users,
    BarChart2,
    Bell,
    Globe,
    ShieldCheck,
    Clock,
    Zap,
    Star,
    Lock,
    CheckCircle,
    CalendarCheck,
    SlidersHorizontal,
    type LucideIcon,
} from "lucide-react";

export type IconName =
    | "Briefcase"
    | "FileText"
    | "Users"
    | "BarChart2"
    | "Bell"
    | "Globe"
    | "ShieldCheck"
    | "Clock"
    | "Zap"
    | "Star"
    | "Lock"
    | "CheckCircle"
    | "CalendarCheck"
    | "SlidersHorizontal";

export const ICON_MAP: Record<IconName, LucideIcon> = {
    Briefcase,
    FileText,
    Users,
    BarChart2,
    Bell,
    Globe,
    ShieldCheck,
    Clock,
    Zap,
    Star,
    Lock,
    CheckCircle,
    CalendarCheck,
    SlidersHorizontal,
};

export const SERVICES: {
    iconName: IconName;
    titleKey: string;
    descKey: string;
    highlight?: boolean;
}[] = [
        { iconName: "Briefcase", titleKey: "jobsPortal", descKey: "jobsPortalDesc", highlight: true },
        { iconName: "FileText", titleKey: "cvCollection", descKey: "cvCollectionDesc" },
        { iconName: "Users", titleKey: "candidateMgmt", descKey: "candidateMgmtDesc" },
        { iconName: "BarChart2", titleKey: "reports", descKey: "reportsDesc" },
        { iconName: "CalendarCheck", titleKey: "interviews", descKey: "interviewsDesc" },
        { iconName: "SlidersHorizontal", titleKey: "hrSettings", descKey: "hrSettingsDesc" },
    ];

export const PORTAL_FEATURES: { iconName: IconName; labelKey: string }[] = [
    { iconName: "Globe", labelKey: "portalPublish" },
    { iconName: "FileText", labelKey: "portalCV" },
    { iconName: "Users", labelKey: "portalTrack" },
    { iconName: "Bell", labelKey: "portalNotify" },
    { iconName: "BarChart2", labelKey: "portalStats" },
    { iconName: "ShieldCheck", labelKey: "portalSecure" },
];

export const TRUST_BADGES: { iconName: IconName; labelKey: string }[] = [
    { iconName: "ShieldCheck", labelKey: "trustSecurity" },
    { iconName: "Zap", labelKey: "trustSpeed" },
    { iconName: "Clock", labelKey: "trustSupport" },
    { iconName: "Star", labelKey: "trustRating" },
    { iconName: "Lock", labelKey: "trustPrivacy" },
];

export const TESTIMONIALS: {
    name: string;
    role: string;
    company: string;
    quote: string;
    stars: number;
    img: string;
}[] = [
        {
            name: "Ahmed El-Sayed",
            role: "HR Manager",
            company: "Tech Corp Egypt",
            quote: "The portal saved us countless hours in receiving and sorting CVs. Everything became clearer and faster.",
            stars: 5,
            img: "https://i.pravatar.cc/150?img=11",
        },
        {
            name: "Sara Mahmoud",
            role: "Talent Acquisition Lead",
            company: "Nile Ventures",
            quote: "The reports and analytics helped us understand our hiring pipeline really well.",
            stars: 5,
            img: "https://i.pravatar.cc/150?img=47",
        },
        {
            name: "Mohamed Khaled",
            role: "CEO",
            company: "StartupHub",
            quote: "We posted our first job on the same day. Setup was simple and results were clear from the very first week.",
            stars: 5,
            img: "https://i.pravatar.cc/150?img=15",
        },
    ];