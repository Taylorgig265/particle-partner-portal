
import { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Award, Users, Check, Clock, Truck } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Quality',
    description: 'We are committed to providing high-quality products that meet international standards and are backed by proper certifications.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in everything we do, from product selection to customer service and technical support.'
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Our customers are at the heart of our business. We listen to their needs and work tirelessly to exceed their expectations.'
  }
];

const features = [
  {
    icon: Check,
    title: 'CE/FDA Approved Products',
    description: 'All our products adhere to manufacturers\' guidelines and come with CE/FDA approvals, ensuring the highest quality and safety standards.'
  },
  {
    icon: Clock,
    title: '12-Month Warranty',
    description: 'We provide a comprehensive 12-month warranty on all our products, giving you peace of mind with your purchase.'
  },
  {
    icon: Truck,
    title: 'Cold Chain Supply',
    description: 'Our cold chain supply capabilities ensure that temperature-sensitive products reach you in optimal condition.'
  }
];

const About = () => {
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
          {/* Hero Section */}
          <section className="pt-32 pb-20 bg-particle-light relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0">
              <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-particle-gold/5 blur-3xl"></div>
              <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-particle-navy/5 blur-3xl"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIgZmlsbD0icmdiYSgxMCwgMzUsIDY2LCAwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
            </div>
            
            <div className="content-container relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h1 
                  className="text-5xl font-bold text-particle-navy mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  About Particle Investment
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  A trusted supplier of diagnostic and medical equipment in Malawi with over a decade of experience.
                </motion.p>
                
                <motion.div 
                  className="w-24 h-1 bg-particle-accent mx-auto rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                ></motion.div>
              </div>
            </div>
          </section>
          
          {/* Our Story Section */}
          <section className="py-20 bg-white">
            <div className="content-container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold text-particle-navy mb-6">Our Story</h2>
                  
                  <p className="text-gray-600 leading-relaxed">
                    Particle Investment was established with a vision to provide high-quality diagnostic and medical equipment to healthcare facilities in Malawi. 
                    Over the past decade, we have grown to become a trusted supplier of medical equipment, serving hospitals, clinics, laboratories, and industrial clients across the country.
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed">
                    Our journey has been marked by a commitment to excellence, customer satisfaction, and continuous improvement. 
                    We have built strong relationships with global manufacturers and suppliers, allowing us to bring the latest and most reliable medical equipment to Malawi.
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed">
                    Today, we are proud to be a leading supplier of diagnostic and medical equipment, known for our quality products, exceptional service, and technical expertise.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 -m-4 rounded-2xl bg-particle-navy/5 blur-md"></div>
                  <div className="absolute inset-0 -m-8 rotate-6 rounded-2xl border border-particle-accent/20"></div>
                  <div className="rounded-2xl overflow-hidden shadow-xl relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-particle-navy/10 to-transparent mix-blend-overlay z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Particle Investment Team" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Our Values Section */}
          <section className="py-20 bg-particle-light">
            <div className="content-container">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl font-bold text-particle-navy mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Values
                </motion.h2>
                
                <motion.p 
                  className="max-w-3xl mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  At Particle Investment, our values guide everything we do, from the products we select to the way we serve our customers.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div 
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="h-14 w-14 rounded-full bg-particle-navy/10 flex items-center justify-center mb-6">
                      <value.icon className="h-7 w-7 text-particle-navy" />
                    </div>
                    <h3 className="text-xl font-bold text-particle-navy mb-4">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Our Features Section */}
          <section className="py-20 bg-white">
            <div className="content-container">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl font-bold text-particle-navy mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Why Choose Us
                </motion.h2>
                
                <motion.p 
                  className="max-w-3xl mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  We are committed to providing high-quality products, exceptional service, and comprehensive support to all our clients.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-particle-light rounded-xl p-8"
                  >
                    <div className="h-14 w-14 rounded-full bg-particle-navy/10 flex items-center justify-center mb-6">
                      <feature.icon className="h-7 w-7 text-particle-navy" />
                    </div>
                    <h3 className="text-xl font-bold text-particle-navy mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Team Section */}
          <section className="py-20 bg-particle-light">
            <div className="content-container">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl font-bold text-particle-navy mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Our Team
                </motion.h2>
                
                <motion.p 
                  className="max-w-3xl mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Our team of skilled consultants and technicians is dedicated to providing expert guidance, service, and support.
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Alex Daud',
                    role: 'Managing Director',
                    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    name: 'Sarah Phiri',
                    role: 'Technical Consultant',
                    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    name: 'John Banda',
                    role: 'Service Engineer',
                    image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  }
                ].map((member, index) => (
                  <motion.div 
                    key={member.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg group"
                  >
                    <div className="h-80 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-particle-navy">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default About;
