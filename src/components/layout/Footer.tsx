export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center border-t border-white/5 bg-[#0a0a0a] px-8 py-8 sm:flex-row sm:justify-between">
      <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
        &copy; {new Date().getFullYear()} Nezuko Organization.
      </p>
      <div className="mt-4 flex gap-6 sm:mt-0">
        <span className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
          Internal Use Only
        </span>
        <span className="text-xs font-bold tracking-widest text-zinc-600 uppercase">
          Strictly Confidential
        </span>
      </div>
    </footer>
  )
}