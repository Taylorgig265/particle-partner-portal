
import { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import Hero from '@/components/home/hero';
import AboutPreview from '@/components/home/about-preview';
import ProductsPreview from '@/components/home/products-preview';
import Partners from '@/components/home/partners';
import Clients from '@/components/home/clients';
import ContactCta from '@/components/home/contact-cta';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        <main>
          <Hero />
          <AboutPreview />
          <ProductsPreview />
          <Partners />
          <Clients />
          <ContactCta />
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
