
import { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 'diagnostics',
    name: 'Diagnostic Equipment',
    description: 'Advanced diagnostic equipment for accurate clinical assessments and patient monitoring.',
    products: [
      {
        id: 'ecg',
        name: 'ECG Machines',
        description: 'High-precision electrocardiogram machines for cardiac monitoring.',
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'ultrasound',
        name: 'Ultrasound Systems',
        description: 'State-of-the-art ultrasound imaging systems for various medical applications.',
        image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'patient-monitor',
        name: 'Patient Monitors',
        description: 'Comprehensive patient monitoring systems for vital signs tracking.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'laboratory',
    name: 'Laboratory Equipment',
    description: 'Precision laboratory equipment for research, testing, and analytical applications.',
    products: [
      {
        id: 'centrifuge',
        name: 'Centrifuges',
        description: 'High-speed centrifuges for sample separation and processing.',
        image: 'https://images.unsplash.com/photo-1614308453127-efb3a5154299?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'microscope',
        name: 'Microscopes',
        description: 'Advanced optical and digital microscopes for detailed sample analysis.',
        image: 'https://images.unsplash.com/photo-1516728778615-2d590ea1855e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'analyzer',
        name: 'Clinical Analyzers',
        description: 'Automated analyzers for biochemistry, hematology, and immunology testing.',
        image: 'https://images.unsplash.com/photo-1581093057401-2c704ce4c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare Equipment',
    description: 'Essential medical supplies and equipment for healthcare facilities and patient care.',
    products: [
      {
        id: 'hospital-beds',
        name: 'Hospital Beds',
        description: 'Ergonomic and adjustable hospital beds for patient comfort and care.',
        image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'surgical-instruments',
        name: 'Surgical Instruments',
        description: 'High-quality surgical instruments and equipment for medical procedures.',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'sterilization',
        name: 'Sterilization Equipment',
        description: 'Medical sterilizers and autoclaves for infection control.',
        image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial Equipment',
    description: 'Reliable industrial equipment for manufacturing, production, and quality control.',
    products: [
      {
        id: 'industrial-analyzers',
        name: 'Industrial Analyzers',
        description: 'Specialized analyzers for industrial applications and quality control.',
        image: 'https://images.unsplash.com/photo-1581093450021-a7860e6e7e9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'measuring-instruments',
        name: 'Measuring Instruments',
        description: 'Precision measuring instruments for industrial processes.',
        image: 'https://images.unsplash.com/photo-1581092921461-7031e8fca723?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'testing-equipment',
        name: 'Testing Equipment',
        description: 'Advanced testing equipment for material and product analysis.',
        image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Scroll to hash if exists
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
          {/* Hero Section */}
          <section className="pt-32 pb-20 bg-particle-light relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-particle-gold/5 blur-3xl"></div>
              <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-particle-navy/5 blur-3xl"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgxMCwgMzUsIDY2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
            </div>
            
            <div className="content-container relative z-10">
              <div className="max-w-3xl mx-auto">
                <motion.h1 
                  className="text-5xl font-bold text-particle-navy mb-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Our Products
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Discover our comprehensive range of high-quality diagnostic and medical equipment.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for products..."
                      className="w-full px-6 py-4 pr-12 bg-white border border-gray-200 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex flex-wrap justify-center gap-3 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {categories.map((category) => (
                    <a 
                      key={category.id}
                      href={`#${category.id}`}
                      className="px-4 py-2 bg-white rounded-full border border-gray-200 text-particle-navy hover:bg-particle-navy hover:text-white transition-colors shadow-sm"
                    >
                      {category.name}
                    </a>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Product Categories */}
          <section className="py-20 bg-white">
            <div className="content-container">
              <div className="space-y-24">
                {categories.map((category, index) => (
                  <div 
                    key={category.id} 
                    id={category.id}
                    className="scroll-mt-32"
                  >
                    <motion.div 
                      className="mb-12"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="text-3xl font-bold text-particle-navy mb-4">{category.name}</h2>
                      <p className="text-gray-600 max-w-3xl">{category.description}</p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.products.map((product, productIndex) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: productIndex * 0.1 }}
                          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100"
                        >
                          <div className="h-64 relative overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button 
                                className="w-full bg-white text-particle-navy hover:bg-particle-accent hover:text-white"
                                size="sm"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-particle-navy mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="flex items-center text-particle-navy font-medium group-hover:text-particle-accent transition-colors">
                              Learn more
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="py-20 bg-particle-navy">
            <div className="content-container">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h2 
                  className="text-3xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Need Help Finding the Right Equipment?
                </motion.h2>
                
                <motion.p 
                  className="text-white/80 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Our team of experts is here to help you find the perfect equipment for your specific needs. 
                  Contact us today for personalized recommendations and quotes.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
                >
                  <Button 
                    className="bg-white text-particle-navy hover:bg-particle-accent hover:text-white btn-animation"
                    size="lg"
                    asChild
                  >
                    <Link to="/contact">
                      Contact Our Team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    size="lg"
                  >
                    Request a Quote
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Products;
