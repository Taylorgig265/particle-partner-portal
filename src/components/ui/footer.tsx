
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-particle-navy text-white pt-16 pb-8">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 items-start">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/c13d30e7-eaf2-483c-9dca-5a6aaa115cd1.png" 
                alt="Particle Investment Logo" 
                className="h-16 w-auto bg-white rounded-full p-1"
              />
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              A trusted supplier of diagnostic and medical equipment in Malawi with over a decade of experience 
              in providing high-quality products and exceptional service.
            </p>
            <div className="flex items-center pt-4 space-x-4">
              <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white/10 text-white">
                <Mail size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white/10 text-white">
                <Phone size={18} />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-white/20 hover:bg-white/10 text-white">
                <MapPin size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold mb-6">Quick Links</h5>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Products', href: '/products' },
                { label: 'Services', href: '/services' },
                { label: 'Partners', href: '/partners' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href} className="group">
                  <Link 
                    to={link.href}
                    className="inline-flex items-center text-sm opacity-80 hover:opacity-100 hover:text-particle-accent transition-all duration-300"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold mb-6">Contact Us</h5>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Email</p>
                  <a href="mailto:particleinvestsment@yahoo.com" className="text-sm block hover:text-particle-accent transition-colors">
                    particleinvestsment@yahoo.com
                  </a>
                  <a href="mailto:earnings2006@gmail.com" className="text-sm block hover:text-particle-accent transition-colors">
                    earnings2006@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Phone</p>
                  <a href="tel:+265999121436" className="text-sm block hover:text-particle-accent transition-colors">
                    +265 999 12 14 36
                  </a>
                  <a href="tel:+265886577898" className="text-sm block hover:text-particle-accent transition-colors">
                    +265 886 57 78 98
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Address</p>
                  <p className="text-sm">
                    P.O BOX 2933 BLANTYRE, MALAWI,<br /> 
                    FEEMANILLAH BUILDING NO:26,<br />
                    ALONG LIVINGSTONE AVE, OPP LIMBE POLICE, LIMBE
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold mb-6">Business Hours</h5>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Clock size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Monday - Friday</p>
                  <p className="text-sm">8:00 AM - 5:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Saturday</p>
                  <p className="text-sm">9:00 AM - 1:00 PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={18} className="flex-shrink-0 mt-1 text-particle-accent" />
                <div className="space-y-1">
                  <p className="text-sm opacity-80">Sunday</p>
                  <p className="text-sm">Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-70 text-center md:text-left">
            &copy; {currentYear} Particle Investment. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex items-center space-x-6">
              <li>
                <a href="#" className="text-xs text-white/70 hover:text-white/100 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-xs text-white/70 hover:text-white/100 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
