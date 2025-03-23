
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    description: 'Advanced diagnostic equipment for accurate clinical assessments.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    description: 'Precision lab equipment for research and analytical applications.',
    image: 'https://images.unsplash.com/photo-1579165466949-3180a3d056d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'from-green-500/20 to-green-600/20'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Essential medical supplies and equipment for healthcare facilities.',
    image: 'https://images.unsplash.com/photo-1576671114140-525049b9291b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'from-red-500/20 to-red-600/20'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Reliable industrial equipment for manufacturing and production.',
    image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: 'from-yellow-500/20 to-yellow-600/20'
  }
];

const ProductsPreview = () => {
  return (
    <section className="py-24 bg-particle-light/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMCwgMzUsIDY2LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-70" />
      
      <div className="content-container relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10 mb-4"
          >
            <span className="text-sm font-medium">Our Product Range</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-particle-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive Medical Equipment Solutions
          </motion.h2>
          
          <motion.p 
            className="max-w-3xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our extensive range of high-quality diagnostic, laboratory, healthcare, and industrial equipment.
            All our products come with certification, warranty, and expert support.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                to={`/products#${category.id}`}
                className="block h-full"
              >
                <div className="h-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 card-hover group">
                  <div className="h-48 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-30 group-hover:opacity-20 transition-opacity`}></div>
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">{category.name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-particle-navy font-medium group-hover:text-particle-accent transition-colors">
                      Explore {category.name}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="text-center mt-16">
          <Button 
            className="bg-particle-navy hover:bg-particle-secondary text-white btn-animation"
            size="lg"
            asChild
          >
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
