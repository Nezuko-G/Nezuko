import { LoginForm } from "@/features/auth/components/LoginForm"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6 selection:bg-[#D4FF00] selection:text-black">
      <div className="flex w-full max-w-2xl flex-col gap-12 rounded-[2.5rem] bg-zinc-900/40 p-10 sm:p-16 border border-white/5 shadow-2xl">
        
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D4FF00] px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D4FF00]"></span>
            <span className="text-xs font-bold text-[#D4FF00] uppercase tracking-wider">
              System Access
            </span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white uppercase">
            PORTAL LOGIN.
          </h1>
        </div>

        <LoginForm />

      </div>
    </main>
  )
}