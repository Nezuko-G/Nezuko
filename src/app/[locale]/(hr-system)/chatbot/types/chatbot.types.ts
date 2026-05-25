export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface ChatbotConfig {
    model: string;
    systemPrompt: string;
}

export interface SendMessageResponse {
    success: boolean;
    data?: {
        sessionId: string;
        reply: string;
    };
    error?: string;
}
