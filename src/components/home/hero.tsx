
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-100 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"></div>
      
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div 
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-cyan-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  Medical Equipment Excellence
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your Trusted Partner in{' '}
                <span className="text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text">Medical Equipment</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Particle Investment provides high-quality diagnostic and medical equipment to healthcare 
                facilities across Malawi. Over a decade of experience serving hospitals, clinics, laboratories, 
                and industrial clients with certified, reliable solutions.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-gray-700">
                <Stethoscope className="h-5 w-5 text-cyan-500" />
                <span className="text-sm font-medium">CE/FDA Approved</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Shield className="h-5 w-5 text-cyan-500" />
                <span className="text-sm font-medium">12-Month Warranty</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Award className="h-5 w-5 text-cyan-500" />
                <span className="text-sm font-medium">Expert Support</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                <Link to="/products">
                  View Our Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <Link to="/contact">
                  Request Quote
                </Link>
              </Button>
            </motion.div>

            {/* Particle Investment branding */}
            <motion.div 
              className="pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center space-x-4">
                {/* Particle Investment Logo */}
                {!imageError ? (
                  <img 
                    src="/lovable-uploads/c13d30e7-eaf2-483c-9dca-5a6aaa115cd1.png" 
                    alt="Particle Investment" 
                    className="h-12 object-contain"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-12 px-6 flex items-center text-blue-800 text-lg font-bold border border-cyan-500 rounded">
                    PI
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-gray-900 font-semibold">Particle Investment</p>
                  <p className="text-sm text-gray-500">Your Partner in Medical Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center"
                alt="Medical laboratory equipment and diagnostic tools"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
