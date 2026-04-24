import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookDemoForm from "./components/BookDemoForm";

export default function BookDemoPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <BookDemoForm />
            <Footer />
        </main>
    );
}