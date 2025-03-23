
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="content-container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-particle-navy transition-colors">
            Particle<span className="text-particle-accent">Investment</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-particle-accent relative',
                isActive(item.href) 
                  ? 'text-particle-accent' 
                  : 'text-particle-navy'
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-particle-accent rounded-full animate-fade-in-up" />
              )}
            </Link>
          ))}
          <Button 
            className="bg-particle-navy hover:bg-particle-secondary text-white"
            size="sm"
          >
            Get a Quote
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="text-particle-navy"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-40 lg:hidden pt-20 transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col p-8 space-y-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'text-xl font-medium py-2 px-4 rounded-md transition-colors',
                isActive(item.href)
                  ? 'text-particle-accent bg-particle-light'
                  : 'text-particle-navy hover:bg-particle-light hover:text-particle-accent'
              )}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
          <Button 
            className="bg-particle-navy hover:bg-particle-secondary text-white w-full mt-6"
          >
            Get a Quote
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
