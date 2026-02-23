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
          "inline-flex items-center justify-center rounded-full text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4FF00] disabled:pointer-events-none disabled:opacity-50 h-14 px-8 py-2",
          variant === 'default' && "bg-[#D4FF00] text-black hover:bg-[#b3d900]",
          variant === 'outline' && "border border-zinc-700 bg-transparent text-white hover:border-white",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }