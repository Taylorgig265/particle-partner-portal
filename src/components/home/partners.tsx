
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const partners = [
  {
    name: 'BIOBASE',
    logo: '/lovable-uploads/68e3138f-6e95-48cb-8d65-f23224949632.png',
    description: 'Leading manufacturer of laboratory and medical equipment.'
  },
  {
    name: 'EDAN',
    logo: '/lovable-uploads/2842e31b-b235-445a-a4ba-1f20b01c236c.png',
    description: 'Innovative healthcare monitoring and diagnostic solutions.'
  },
  {
    name: 'MINITUBE',
    logo: '/lovable-uploads/030f3826-7cec-4294-9a23-b53269844d99.png',
    description: 'Specialized technology for reproductive medicine and research.'
  },
  {
    name: 'ASCO-MED',
    logo: '/lovable-uploads/05fa59ac-cc96-4663-9455-a6ff85a0cb54.png',
    description: 'High-quality medical devices and equipment supplier.'
  },
  {
    name: 'GLADAN HEALTH',
    logo: '/lovable-uploads/154c26f2-62ad-43fd-b3a5-7f07b92f3766.png',
    description: 'Comprehensive healthcare equipment and solutions.'
  },
  {
    name: 'MICRO-PROFIT',
    logo: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Specialized laboratory and research equipment manufacturer.'
  }
];

const Partners = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-particle-gold/5 blur-3xl"></div>
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[40%] rounded-full bg-particle-navy/5 blur-3xl"></div>
      
      <div className="content-container relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10 mb-4"
          >
            <span className="text-sm font-medium">Our Partners</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-particle-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We Partner with Global Industry Leaders
          </motion.h2>
          
          <motion.p 
            className="max-w-3xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We collaborate with reputable global manufacturers and suppliers to bring you certified, 
            high-quality medical and diagnostic equipment that meets international standards.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-1 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-lg overflow-hidden bg-particle-light/50 p-6 h-full flex flex-col">
                <div className="h-16 mb-6 flex items-center justify-center">
                  {partner.name === 'MICRO-PROFIT' ? (
                    <>
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-white shadow-sm">
                        <img 
                          src={partner.logo} 
                          alt={partner.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="ml-3 text-xl font-bold text-particle-navy">{partner.name}</h3>
                    </>
                  ) : (
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`}
                      className="max-h-12 w-auto object-contain"
                    />
                  )}
                </div>
                <p className="text-gray-600 flex-grow text-center">{partner.description}</p>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <Link 
                    to="/partners" 
                    className="inline-flex items-center text-particle-navy hover:text-particle-accent font-medium text-sm transition-colors"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
