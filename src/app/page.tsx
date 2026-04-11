import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] selection:bg-[#D4FF00] selection:text-black">
      <Navbar />
      
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,255,0,0.03)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D4FF00] animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              System Online & Secure
            </span>
          </div>
          
          <h1 className="max-w-4xl text-5xl font-black uppercase leading-[1.1] tracking-tighter text-white sm:text-7xl">
            Enterprise Human Resources <span className="text-[#D4FF00]">Intelligence.</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg font-medium text-zinc-400">
            Advanced management and analytics for Nezuko personnel. 
            Authorized access only. All actions are strictly monitored.
          </p>
          
          <div className="mt-10">
            <Link href="/login" tabIndex={-1}>
              <Button className="flex h-14 gap-2 px-8 text-lg">
                ENTER SYSTEM <ArrowUpRight className="h-6 w-6" aria-hidden="true" />
              </Button>
            </Link> 
            /! note here button inside link will make hydration error and cause unlimited lagg in safari browser
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}