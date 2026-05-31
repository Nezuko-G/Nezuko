import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/axios/core/instance";
import type { ChatbotConfig, Message } from "../types/chatbot.types";

export default function useChatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [config, setConfig] = useState<ChatbotConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const configRes = await api.get("/chatbot/config");

                const cfg: ChatbotConfig = configRes.data.data;

                setConfig(cfg);
            } catch {
                setError("Failed to initialize chatbot.");
            } finally {
                setIsInitializing(false);
            }
        };
        init();
    }, []);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!text.trim() || isLoading) return;

            const userMsg: Message = {
                id: `user-${Date.now()}`,
                role: "user",
                content: text.trim(),
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMsg]);
            setIsLoading(true);
            setError(null);

            try {
                const res = await api.post("/chatbot/message", {
                    message: text.trim(),
                    ...(sessionIdRef.current ? { sessionId: sessionIdRef.current } : {}),
                });

                const sessionId = res.data?.data?.sessionId;
                const reply = res.data?.data?.reply || "No response received";

                if (sessionId) {
                    sessionIdRef.current = sessionId;
                }

                const botMsg: Message = {
                    id: `bot-${Date.now()}`,
                    role: "assistant",
                    content: reply,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMsg]);
            } catch (err: unknown) {
                const errRes = (err as { response?: { data?: { error?: string } } })?.response?.data;
                const errMsg = errRes?.error || "Something went wrong.";
                setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading],
    );

    return { messages, config, isLoading, isInitializing, error, sendMessage };
}
