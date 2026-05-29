import type { Components } from "react-markdown";

export const markdownComponents: Components = {
    p: ({ children }) => (
        <p className="mb-2 last:mb-0">{children}</p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ps-4 space-y-1 my-2">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="list-decimal ps-4 space-y-1 my-2">{children}</ol>
    ),
    li: ({ children }) => (
        <li className="text-sm leading-relaxed">{children}</li>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-[var(--color-content-dark)]">
            {children}
        </strong>
    ),
    em: ({ children }) => (
        <em className="italic opacity-90">{children}</em>
    ),
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary-hover)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
            {children}
        </a>
    ),
    code: ({ children }) => (
        <code className="bg-gray-100 text-[var(--color-secondary)] px-1.5 py-0.5 rounded text-xs font-mono">
            {children}
        </code>
    ),
    hr: () => (
        <hr className="border-gray-200 my-2" />
    ),
};
