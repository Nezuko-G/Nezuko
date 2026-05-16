import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: "h-9 rounded-lg px-4 text-sm font-semibold",
  md: "h-14 rounded-full px-8 text-base font-bold",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          sizeClasses[size],
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