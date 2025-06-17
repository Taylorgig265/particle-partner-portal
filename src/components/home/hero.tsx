
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Leaf, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
      
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
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Sustainable Building Solutions
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Building a{' '}
                <span className="text-green-600">Greener</span> Future
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Transform your construction projects with our eco-friendly materials and sustainable building solutions. 
                Quality, durability, and environmental responsibility in every product.
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
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Certified Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">100% Eco-Friendly</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Award className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Industry Leading</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link to="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Get Quote
                </Link>
              </Button>
            </motion.div>

            {/* Trusted by section */}
            <motion.div 
              className="pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-gray-500 mb-4">Trusted by leading companies</p>
              <div className="flex items-center space-x-8 opacity-60">
                {/* Particle Investment Logo */}
                {!imageError ? (
                  <img 
                    src="/lovable-uploads/c13d30e7-eaf2-483c-9dca-5a6aaa115cd1.png" 
                    alt="Particle Investment" 
                    className="h-8 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-8 px-4 flex items-center text-gray-400 text-sm font-medium border border-gray-200 rounded">
                    Particle Investment
                  </div>
                )}
                
                {/* Placeholder logos */}
                <div className="h-8 px-4 flex items-center text-gray-400 text-sm font-medium border border-gray-200 rounded">
                  GreenTech Corp
                </div>
                <div className="h-8 px-4 flex items-center text-gray-400 text-sm font-medium border border-gray-200 rounded">
                  BuildSmart
                </div>
                <div className="h-8 px-4 flex items-center text-gray-400 text-sm font-medium border border-gray-200 rounded">
                  EcoConstruct
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
                src="/lovable-uploads/154c26f2-62ad-43fd-b3a5-7f07b92f3766.png"
                alt="Sustainable Construction"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
