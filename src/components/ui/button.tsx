import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-base font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-14 px-8 py-2 active:scale-95",
          variant === 'default' && "bg-primary text-secondary hover:bg-primary-hover shadow-lg shadow-primary/20",
          variant === 'outline' && "border border-zinc-700 bg-transparent text-secondary hover:border-primary hover:text-primary",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }