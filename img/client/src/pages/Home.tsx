import Header from "@/components/Header_new";
import Flashcards from "@/components/Flashcards";
import Attractions from "@/components/Attractions";
import Quiz from "@/components/Quiz";
import CapitalsTest from "@/components/CapitalsTest";
import CapitalsGame from "@/components/CapitalsGame";
import FunFacts from "@/components/FunFacts";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-4">
            {t("Исследуйте мир с GeoOzge", "Explore the World with GeoOzge")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t("Изучайте страны, столицы и увлекательные достопримечательности с помощью интерактивных карточек, викторин и многого другого.", 
               "Learn about countries, capitals, and fascinating landmarks through interactive flashcards, quizzes, and more.")}
          </p>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Flashcards />
          <Attractions />
        </div>

        <Quiz />
        <CapitalsGame />
        <CapitalsTest />
        <FunFacts />
      </main>
      
      <Footer />
    </div>
  );
}
