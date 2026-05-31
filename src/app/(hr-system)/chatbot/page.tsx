"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { MessageBubble } from "./components/bubble";
import { TypingIndicator } from "./components/typing";
import { QuickActions } from "./components/actions";
import { BotIcon } from "./components/icons";
import useChatbot from "./hooks/useChatbot";

export default function ChatbotPage() {
    const t = useTranslations("chatbot");
    const { messages, config, isLoading, isInitializing, error, sendMessage } =
        useChatbot();
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [isScrolledUp, setIsScrolledUp] = useState(false);
    const messagesRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        const el = messagesRef.current;
        if (!el) return;
        setIsScrolledUp(el.scrollTop < el.scrollHeight - el.clientHeight - 200);
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
        setIsScrolledUp(false);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
        }, 350);
        return () => clearTimeout(timeout);
    }, [messages, isLoading]);

    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

    const handleSend = () => {
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput("");
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
        }
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isInitializing) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)] flex items-center justify-center shadow-lg animate-pulse">
                        <BotIcon size={26} />
                    </div>
                    <p className="text-sm text-[var(--color-content-muted)] font-medium tracking-wide">
                        {t("status.initializing")}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--color-background)]">

            {/* Header */}
            <header className="flex-shrink-0 flex items-center gap-3 px-5 py-4 bg-[var(--color-secondary)] shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary-light)] flex items-center justify-center border border-[var(--color-primary)]/30">
                    <BotIcon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-white font-semibold text-sm tracking-wide">{t("header.title")}</h1>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_6px_var(--color-primary)]" />
                        <span className="text-[11px] text-[var(--color-primary)] font-medium truncate">
                            {config?.model ?? t("header.online")}
                        </span>
                    </div>
                </div>
            </header>

            {/* Messages — scrollable area */}
            <div className="flex-1 min-h-0 relative">
                <div
                    ref={messagesRef}
                    onScroll={handleScroll}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5 sm:py-5 flex flex-col gap-4"
                >
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isLoading && <TypingIndicator />}

                    {error && (
                        <div className="self-center px-4 py-2.5 rounded-xl bg-red-50 border border-[var(--color-status-error)]/30 text-[var(--color-status-error)] text-xs text-center max-w-xs animate-slideIn">
                            {error}
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {isScrolledUp && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-4 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 w-9 h-9 rounded-full
                            bg-[var(--color-secondary)] text-white shadow-lg
                            hover:bg-[var(--color-secondary-hover)] hover:shadow-xl
                            flex items-center justify-center
                            transition-all duration-200 animate-bounce cursor-pointer z-10"
                        aria-label="Scroll to bottom"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Quick Actions — show only when there's just the welcome message */}
            {messages.length <= 1 && (
                <QuickActions
                    generalHelpLabel={t("labels.generalHelp")}
                    contactHRLabel={t("labels.contactHR")}
                    generalHelpMessage={t("quickActions.generalHelp")}
                    hrMessage={t("quickActions.contactHR")}
                    onSelect={sendMessage}
                />
            )}

            {/* Input */}
            <div className="flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 border-t border-gray-100 bg-[var(--color-background)]">
                <div className="flex items-end gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm
                    focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_3px_var(--color-primary-light)]
                    transition-all duration-200">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = "auto";
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={t("input.placeholder")}
                        rows={1}
                        disabled={isLoading}
                        className="flex-1 resize-none bg-transparent text-sm text-[var(--color-content)]
                            placeholder:text-[var(--color-content-muted)] outline-none leading-relaxed
                            overflow-y-auto disabled:opacity-50"
                        style={{ scrollbarWidth: "none", maxHeight: "112px" }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                            bg-[var(--color-secondary)] text-white
                            hover:bg-[var(--color-secondary-hover)] hover:shadow-md
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all duration-200 active:scale-90 cursor-pointer"
                        aria-label={t("input.send")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:scale-x-[-1]">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
                <p className="text-center text-[10px] text-[var(--color-content-muted)] mt-2">
                    <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> {t("input.enterToSend")} ·{" "}
                    <kbd className="font-mono bg-gray-100 px-1 rounded">Shift+Enter</kbd> {t("input.shiftEnterForNewLine")}
                </p>
            </div>
        </div>
    );
}
