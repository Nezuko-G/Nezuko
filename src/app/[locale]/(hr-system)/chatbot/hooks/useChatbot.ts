
import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/axios/core/instance";
import { ChatbotConfig, ChatbotMessages, Message } from "../types/chatbot.types";


export default function useChatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [uiMessages, setUiMessages] = useState<ChatbotMessages | null>(null);
    const [config, setConfig] = useState<ChatbotConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const [configRes, messagesRes] = await Promise.all([
                    api.get("/chatbot/config"),
                    api.get("/chatbot/messages"),
                ]);

                const cfg: ChatbotConfig = configRes.data.data;
                const msgs: ChatbotMessages = messagesRes.data.data;

                setConfig(cfg);
                setUiMessages(msgs);

                // Add welcome message
                setMessages([
                    {
                        id: "welcome",
                        role: "assistant",
                        content: cfg.welcomeMessage || msgs.welcome,
                        timestamp: new Date(),
                    },
                ]);
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
                const res = await api.post("/chatbot/message", { message: text.trim() });
                const reply = res.data?.data || res.data?.message || uiMessages?.noResponse;

                const botMsg: Message = {
                    id: `bot-${Date.now()}`,
                    role: "assistant",
                    content: reply,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMsg]);
            } catch (err: unknown) {
                const errMsg =
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                    uiMessages?.errorSending ||
                    "Something went wrong.";
                setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        },
        [isLoading, uiMessages]
    );

    return { messages, uiMessages, config, isLoading, isInitializing, error, sendMessage };
}
