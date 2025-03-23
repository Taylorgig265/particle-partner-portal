
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactCta = () => {
  return (
    <section className="py-24 bg-particle-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-particle-accent/10 blur-3xl opacity-20"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-particle-accent/10 blur-3xl opacity-20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-30"></div>
      </div>
      
      <div className="content-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white border border-white/10">
              <span className="text-sm font-medium">Contact Us</span>
            </div>
            
            <h2 className="text-4xl font-bold text-white">
              Let's Discuss Your Medical Equipment Needs
            </h2>
            
            <p className="text-white/80 leading-relaxed">
              Whether you need advice on selecting the right equipment, technical support, or information about our products,
              our team is here to help. Reach out to us today.
            </p>
            
            <div className="space-y-6 pt-4">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-particle-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Call Us</h4>
                  <p className="text-white/70">+265 999 12 14 36</p>
                  <p className="text-white/70">+265 886 57 78 98</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-particle-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Email Us</h4>
                  <p className="text-white/70">particleinvestsment@yahoo.com</p>
                  <p className="text-white/70">earnings2006@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-particle-accent" />
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Business Hours</h4>
                  <p className="text-white/70">Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p className="text-white/70">Saturday: 9:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                className="bg-white text-particle-navy hover:bg-particle-accent hover:text-white btn-animation"
                size="lg"
                asChild
              >
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 -m-4 bg-particle-accent/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-particle-navy mb-6">Quick Inquiry</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                      placeholder="Your email"
                    />
                  </div>
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
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-particle-navy/30 focus:border-particle-navy/30"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-particle-navy hover:bg-particle-secondary text-white"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCta;
