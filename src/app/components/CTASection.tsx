import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button"; 

export default function CTASection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="w-full py-24 bg-background px-4">
      <div className="max-w-5xl mx-auto bg-secondary rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl">
        
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t("title")}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10">
            {t("subtitle")}
          </p>
          <Button variant="default" className="text-lg px-10 py-7">
            {t("button")}
          </Button>
        </div>
      </div>
    </section>
  );
}