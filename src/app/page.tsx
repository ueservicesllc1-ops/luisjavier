import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Gallery from "@/components/public/Gallery";
import About from "@/components/public/About";
import Services from "@/components/public/Services";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
      <style>{`
        /* Gallery hover states need global access */
        .gallery-item:hover .gallery-img {
          transform: scale(1.06);
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
