"use client"
import { useTranslations } from "next-intl";
import { Search, Plus, Bell, MessageSquare } from "lucide-react";
<<<<<<< feat/assets-custody-management
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Navbar() {
  const t = useTranslations("dashboard.navbar");
  const { role, setRole } = useAuthStore(); 

  const toggleRole = () => {
    if (role === "HR") setRole("EMPLOYEE");
    else if (role === "EMPLOYEE") setRole("MANAGER");
    else setRole("HR");
  };
=======

export default function Navbar() {
  const t = useTranslations("dashboard.navbar");
>>>>>>> main

  return (
    <header className="h-20 bg-secondary text-white flex items-center justify-between px-6 sticky top-0 z-10 w-full shrink-0 shadow-sm">
      <div className="flex items-center gap-4 w-1/3">
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
<<<<<<< feat/assets-custody-management
        <button 
          onClick={toggleRole}
          className="px-2 py-1 bg-status-warning/20 text-status-warning text-xs font-bold rounded-md"
        >
          {role} (Test)
        </button>
=======
>>>>>>> main
      </div>

      <div className="w-1/3 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full bg-white/5 text-white placeholder-white/40 border border-transparent focus:border-primary/50 focus:bg-white/10 rounded-full px-10 py-2.5 text-sm focus:outline-none transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        </div>
      </div>

      <div className="w-1/3 flex items-center justify-end gap-3 sm:gap-4">
        <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
          <MessageSquare size={18} className="text-primary" />
          <span className="hidden sm:inline-block">{t("aiChat")}</span>
        </button>
        
        <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
          <Plus size={18} className="text-primary" />
          <span className="hidden sm:inline-block">{t("quickAdd")}</span>
        </button>

        <button className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error rounded-full ring-2 ring-secondary"></span>
        </button>

        <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-primary/20 overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-colors">
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" /> {/* temporary  */}
        </div>
      </div>
    </header>
  );
}