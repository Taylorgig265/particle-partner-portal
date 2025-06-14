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
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center" // Added text-center
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10">
                <span className="h-2 w-2 rounded-full bg-particle-accent animate-pulse mr-2"></span>
                <span className="text-sm font-medium">Trusted Medical Equipment Supplier</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-particle-navy animate-fade-in-down">
                Your Partner in <br />
                <span className="text-particle-secondary relative inline-block">
                  Medical Supplies
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-particle-accent rounded-full transform origin-left animate-slide-in-right" style={{ animationDelay: '0.5s' }}></span>
                </span>
              </h1>
              
              <motion.p 
                className="text-lg text-gray-600 max-w-xl mx-auto" // Added mx-auto
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Particle Investment is a trusted supplier of diagnostic and medical equipment in Malawi, 
                with over a decade of experience delivering quality products and exceptional service.
              </motion.p>
              
              <motion.div 
                className="flex flex-col items-center sm:flex-row sm:justify-center gap-4 pt-4" // Added items-center and sm:justify-center
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
