import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chatbot.types";
import { BotIcon } from "./icons";
import { markdownComponents } from "./markdown";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const time = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-2 animate-slideIn ${
        isUser
          ? "flex-row-reverse ml-auto "
          : "rtl:flex-row-reverse ltr:flex-row "
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center flex-shrink-0 mb-5 shadow-md">
          <BotIcon size={15} />
        </div>
      )}
      <div
        className={`flex flex-col gap-1 ${isUser ? "ltr:items-end rtl:items-start" : "ltr:items-start rtl:items-end"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-[var(--color-secondary)] text-white ltr:rounded-ee-sm rtl:rounded-es-sm"
              : "bg-white border border-gray-100 text-[var(--color-content)] ltr:rounded-es-sm rtl:rounded-ee-sm"
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <span className="text-[10px] text-[var(--color-content-muted)] px-1">
          {time}
        </span>
      </div>
    </div>
  );
}
