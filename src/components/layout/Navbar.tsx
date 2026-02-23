import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-8 py-5 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter text-white uppercase">
          NEZUKO<span className="text-[#D4FF00]">.</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <Link href="#" className="text-sm font-bold tracking-wide text-zinc-400 transition-colors hover:text-white uppercase">
          Features
        </Link>
        <Link href="#" className="text-sm font-bold tracking-wide text-zinc-400 transition-colors hover:text-white uppercase">
          Security
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" tabIndex={-1}>
          <Button variant="outline" className="h-11 px-6 text-sm">
            PORTAL ACCESS
          </Button>
        </Link>
      </div>
    </nav>
  )
}