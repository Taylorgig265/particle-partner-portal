
import { useEffect } from 'react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
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
                  Contact Us
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Have questions about our products or services? We're here to help.
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
          
          {/* Contact Details Section */}
          <section className="py-20 bg-white">
            <div className="content-container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-particle-light rounded-xl p-8 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-particle-navy/10 flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-particle-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-particle-navy mb-4">Call Us</h3>
                  <p className="text-gray-600 mb-2">+265 999 12 14 36</p>
                  <p className="text-gray-600 mb-2">+265 886 57 78 98</p>
                  <p className="text-gray-600">+265 882 86 03 22</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-particle-light rounded-xl p-8 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-particle-navy/10 flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-particle-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-particle-navy mb-4">Email Us</h3>
                  <p className="text-gray-600 mb-2">particleinvestsment@yahoo.com</p>
                  <p className="text-gray-600 mb-2">earnings2006@gmail.com</p>
                  <p className="text-gray-600">alexdaud17@gmail.com</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-particle-light rounded-xl p-8 text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-particle-navy/10 flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-particle-navy" />
                  </div>
                  <h3 className="text-xl font-bold text-particle-navy mb-4">Business Hours</h3>
                  <p className="text-gray-600 mb-2">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-gray-600 mb-2">Saturday: 9:00 AM - 1:00 PM</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold text-particle-navy mb-6">Send Us a Message</h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form below, and one of our representatives will get back to you as soon as possible.
                  </p>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                        placeholder="Your email address"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                        placeholder="Your message here..."
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="bg-particle-navy hover:bg-particle-secondary text-white btn-animation"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-particle-navy mb-6">Our Location</h2>
                  <p className="text-gray-600 mb-8">
                    Visit us at our office for in-person consultations and demonstrations of our products.
                  </p>
                  
                  <div className="bg-particle-light p-6 rounded-xl mb-8">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-particle-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-particle-navy mb-2">Address</h4>
                        <p className="text-gray-600">
                          P.O BOX 2933 BLANTYRE, MALAWI,<br /> 
                          FEEMANILLAH BUILDING NO:26,<br />
                          ALONG LIVINGSTONE AVE, OPP LIMBE POLICE, LIMBE
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl overflow-hidden h-80 shadow-lg">
                    {/* Replace with actual map or embed Google Maps */}
                    <div className="w-full h-full bg-particle-light flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-16 w-16 text-particle-navy/30 mx-auto mb-4" />
                        <p className="text-particle-navy font-medium">Interactive Map Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
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
                  Frequently Asked Questions
                </motion.h2>
                
                <motion.p 
                  className="max-w-3xl mx-auto text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Find answers to commonly asked questions about our products and services.
                </motion.p>
              </div>
              
              <div className="max-w-3xl mx-auto">
                {[
                  {
                    question: 'What types of medical equipment do you supply?',
                    answer: 'We supply a wide range of diagnostic, laboratory, healthcare, and industrial equipment. Our product catalog includes ECG machines, ultrasound systems, centrifuges, microscopes, hospital beds, surgical instruments, and more.'
                  },
                  {
                    question: 'Do your products come with a warranty?',
                    answer: 'Yes, all our products come with a 12-month warranty, and we provide comprehensive service and maintenance support throughout the warranty period and beyond.'
                  },
                  {
                    question: 'Do you provide installation and training services?',
                    answer: 'Yes, we offer installation, setup, and training services for all our equipment. Our team of skilled technicians will ensure that your equipment is properly installed and that your staff is trained on its operation.'
                  },
                  {
                    question: 'How can I request a quote for your products?',
                    answer: 'You can request a quote by filling out the contact form on our website, calling us directly, or sending us an email. Our team will get back to you promptly with detailed pricing information.'
                  },
                  {
                    question: 'Do you offer after-sales service and maintenance?',
                    answer: 'Yes, we provide comprehensive after-sales service and maintenance for all our products. Our technical team is available for routine maintenance, repairs, and troubleshooting to ensure that your equipment operates at optimal levels.'
                  }
                ].map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-particle-navy mb-3">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
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

export default Contact;
