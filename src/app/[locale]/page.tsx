import { routing } from '@/i18n/routing'
import Navbar from "@/components/layout/Navbar";
import Footer from '@/components/layout/Footer';
import HomeView from "@/features/landing/views/HomeView";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function HomePage() {

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="grow">
        <HomeView />
      </div>
      <Footer />
    </main>
  )
}

