
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const heroElement = document.querySelector('.hero-section') as HTMLElement;
      if (!heroElement) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroElement.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      heroElement.style.setProperty('--mouse-x', `${x}`);
      heroElement.style.setProperty('--mouse-y', `${y}`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section 
      className="hero-section relative min-h-[90vh] flex items-center overflow-hidden bg-particle-light" 
      style={{
        backgroundImage: `radial-gradient(
          circle at calc(var(--mouse-x, 0.5) * 100%) calc(var(--mouse-y, 0.5) * 100%), 
          rgba(212, 175, 55, 0.15), 
          rgba(10, 35, 66, 0.05) 40%
        )`
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-particle-navy/5 to-particle-accent/5 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-particle-navy/5 to-particle-accent/5 blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgxMCwgMzUsIDY2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-10" />
      </div>

      <div className="content-container relative z-10 w-full py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10">
                <span className="h-2 w-2 rounded-full bg-particle-accent animate-pulse mr-2"></span>
                <span className="text-sm font-medium">Trusted Medical Equipment Supplier</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold !leading-tight text-particle-navy animate-fade-in-down">
                Your Partner in <br />
                <span className="text-particle-secondary relative inline-block">
                  Medical Supplies
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-particle-accent rounded-full transform origin-left animate-slide-in-right" style={{ animationDelay: '0.5s' }}></span>
                </span>
              </h1>
              
              <motion.p 
                className="text-lg text-gray-600 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Particle Investment is a trusted supplier of diagnostic and medical equipment in Malawi, 
                with over a decade of experience delivering quality products and exceptional service.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button 
                  className="bg-particle-navy hover:bg-particle-secondary text-white btn-animation" 
                  size="lg"
                  asChild
                >
                  <Link to="/products">
                    Explore Our Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-particle-navy text-particle-navy hover:bg-particle-navy hover:text-white"
                  size="lg"
                  asChild
                >
                  <Link to="/contact">
                    Contact Us
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative mx-auto max-w-lg"
            >
              <div className="absolute inset-0 -m-6 bg-particle-secondary/10 rounded-full blur-xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1583912025059-b0da5eb840fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Medical Equipment" 
                  className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105" 
                />
              </div>
              <div className="absolute -bottom-6 -right-6 p-6 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-100 z-10">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-particle-navy/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-particle-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-particle-navy">Quality Guaranteed</h4>
                    <p className="text-xs text-gray-500">CE/FDA Approved Equipment</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
