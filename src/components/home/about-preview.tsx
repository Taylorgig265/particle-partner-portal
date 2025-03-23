
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'All our products adhere to manufacturers' guidelines with CE/FDA approvals and a 12-month warranty.'
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our skilled consultants and technicians provide comprehensive support and maintenance services.'
  },
  {
    icon: Award,
    title: 'Decade of Experience',
    description: 'With over 10 years in the industry, we've built a reputation for reliability and excellence.'
  }
];

const AboutPreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-particle-light to-transparent"></div>
      <div className="absolute -top-[30%] -right-[20%] w-[50%] h-[70%] rounded-full bg-particle-gold/5 blur-3xl"></div>
      <div className="absolute -bottom-[30%] -left-[20%] w-[60%] h-[60%] rounded-full bg-particle-navy/5 blur-3xl"></div>

      <div className="content-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 -m-4 rounded-2xl bg-particle-navy/5 blur-md"></div>
              <div className="absolute inset-0 -m-8 -rotate-6 rounded-2xl border border-particle-accent/20"></div>
              <div className="rounded-2xl overflow-hidden shadow-xl relative z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-particle-navy/10 to-transparent mix-blend-overlay z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Particle Investment Team" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="w-full lg:w-1/2 space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10">
              <span className="text-sm font-medium">About Particle Investment</span>
            </div>
            
            <h2 className="text-4xl font-bold text-particle-navy">
              Dedicated to Healthcare Excellence
            </h2>
            
            <p className="text-gray-600 leading-relaxed">
              Particle Investment is a premier supplier of diagnostic and medical equipment in Malawi. 
              With over a decade of experience, we have established ourselves as a trusted partner for healthcare
              facilities, laboratories, and industrial clients across the country.
            </p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-lg bg-particle-navy/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-particle-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-particle-navy mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <Button 
              className="mt-8 group"
              variant="ghost"
              asChild
            >
              <Link to="/about" className="flex items-center text-particle-navy hover:text-particle-accent">
                Learn more about our company
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
