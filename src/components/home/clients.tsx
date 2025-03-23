
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { QuoteIcon } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Dr. John Banda',
    role: 'Medical Director, Koche Community Hospital',
    text: 'Particle Investment has been our trusted supplier for over 5 years. Their diagnostic equipment is reliable, and their technical support is exceptional.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 2,
    name: 'Sarah Mwanza',
    role: 'Lab Manager, Partners In Hope',
    text: 'The laboratory equipment we purchased from Particle Investment has significantly improved our testing capabilities. Their after-sales service is outstanding.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 3,
    name: 'Dr. Michael Phiri',
    role: 'CEO, ABC Clinic',
    text: 'What sets Particle Investment apart is their commitment to quality and customer satisfaction. They go above and beyond to ensure we have the right equipment for our needs.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

const clients = [
  'Koche Community Hospital',
  'Partners In Hope',
  'ABC Clinic',
  'Ministry of Health',
  'Queen Elizabeth Central Hospital',
  'Kamuzu Central Hospital',
  'Mzuzu Central Hospital',
  'College of Medicine',
  'MASM Medi Clinics'
];

const Clients = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-particle-light to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-particle-gold/5 blur-3xl opacity-70"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[40%] h-[40%] rounded-full bg-particle-navy/5 blur-3xl opacity-70"></div>
      </div>
      
      <div className="content-container relative z-10">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10 mb-4">
              <span className="text-sm font-medium">Trusted by Leading Institutions</span>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-particle-navy mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            What Our Clients Say
          </motion.h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Autoplay, Pagination]}
            breakpoints={{
              640: {
                slidesPerView: 1
              },
              768: {
                slidesPerView: 2
              },
              1024: {
                slidesPerView: 3
              }
            }}
            className="testimonial-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="p-1 h-full">
                  <div className="bg-white rounded-xl p-6 shadow-lg h-full flex flex-col">
                    <div className="mb-4 text-particle-accent">
                      <QuoteIcon size={24} />
                    </div>
                    <p className="text-gray-600 mb-6 flex-grow">{testimonial.text}</p>
                    <div className="flex items-center mt-auto">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold text-particle-navy">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <div>
          <motion.h3 
            className="text-2xl font-bold text-particle-navy mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Key Clients
          </motion.h3>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {clients.map((client, index) => (
              <motion.div
                key={client}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-particle-navy font-medium">{client}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
