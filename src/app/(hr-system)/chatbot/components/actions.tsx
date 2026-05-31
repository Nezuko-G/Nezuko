export function QuickActions({
    generalHelpLabel,
    contactHRLabel,
    generalHelpMessage,
    hrMessage,
    onSelect,
}: {
    generalHelpLabel: string;
    contactHRLabel: string;
    generalHelpMessage: string;
    hrMessage: string;
    onSelect: (msg: string) => void;
}) {
    const actions = [
        { label: generalHelpLabel, value: generalHelpMessage, icon: "💡" },
        { label: contactHRLabel, value: hrMessage, icon: "👥" },
    ];

    return (
        <div className="flex-shrink-0 flex gap-2 flex-wrap px-3 py-3 sm:px-4 border-t border-gray-100 bg-[var(--color-background)]">
            {actions.map((a) => (
                <button
                    key={a.label}
                    onClick={() => onSelect(a.value)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold
                        border border-[var(--color-primary)] text-[var(--color-secondary)]
                        bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)]
                        hover:text-[var(--color-secondary)] transition-all duration-200 cursor-pointer shadow-sm"
                >
                    <span>{a.icon}</span>
                    {a.label}
                </button>
            ))}
        </div>
    );
}
