export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface ChatbotConfig {
    model: string;
    welcomeMessage: string;
    generalHelp: string;
    contactHR: string;
}

export interface ChatbotMessages {
    welcome: string;
    generalHelp: string;
    contactHR: string;
    sessionStarted: string;
    typing: string;
    noResponse: string;
    errorSending: string;
    errorServiceUnavailable: string;
}
