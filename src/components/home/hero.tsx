
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, DollarSign, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-particle-light to-particle-gray py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-particle-navy/10 to-particle-secondary/10"></div>
      
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
                <span className="bg-particle-gold/20 text-particle-navy text-sm font-medium px-3 py-1 rounded-full">
                  Strategic Investment Solutions
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-particle-navy leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Unlock Your{' '}
                <span className="text-particle-gold">Investment</span> Potential
              </motion.h1>
              
              <motion.p 
                className="text-xl text-particle-secondary leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Partner with Particle Investment to access premium opportunities and strategic insights. 
                We deliver tailored investment solutions designed to maximize your portfolio performance.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 text-particle-navy">
                <TrendingUp className="h-5 w-5 text-particle-gold" />
                <span className="text-sm font-medium">Growth Focused</span>
              </div>
              <div className="flex items-center space-x-2 text-particle-navy">
                <DollarSign className="h-5 w-5 text-particle-gold" />
                <span className="text-sm font-medium">Premium Returns</span>
              </div>
              <div className="flex items-center space-x-2 text-particle-navy">
                <Target className="h-5 w-5 text-particle-gold" />
                <span className="text-sm font-medium">Strategic Insights</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button asChild size="lg" className="bg-particle-gold hover:bg-particle-accent text-particle-navy">
                <Link to="/products">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-particle-navy text-particle-navy hover:bg-particle-navy hover:text-white">
                <Link to="/contact">
                  Schedule Consultation
                </Link>
              </Button>
            </motion.div>

            {/* Particle Investment branding */}
            <motion.div 
              className="pt-8 border-t border-particle-navy/20"
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
                  <div className="h-12 px-6 flex items-center text-particle-navy text-lg font-bold border border-particle-gold rounded">
                    Particle Investment
                  </div>
                )}
                
                <div className="space-y-1">
                  <p className="text-particle-navy font-semibold">Particle Investment</p>
                  <p className="text-sm text-particle-secondary">Building Wealth Through Strategic Partnerships</p>
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
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center"
                alt="Investment Strategy and Financial Growth"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-particle-gold/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-particle-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
