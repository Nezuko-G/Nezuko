import { BotIcon } from "./icons";

export function TypingIndicator() {
    return (
        <div className="flex ltr:flex-row rtl:flex-row-reverse items-end gap-2 ">
            <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0">
                <BotIcon size={14} />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl ltr:rounded-es-sm rtl:rounded-ee-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
