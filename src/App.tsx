
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Gallery from '@/pages/Gallery';
import ProjectGalleryPage from '@/pages/ProjectGalleryPage';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import AdminRegistration from '@/components/AdminRegistration';
import Auth from '@/pages/Auth';
import CustomerDashboard from '@/pages/CustomerDashboard';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { recordPageVisit } from '@/services/visitor-service';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import CustomerAuthGuard from '@/components/CustomerAuthGuard';
import './App.css';

// Component to track page views
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log(`Page changed to: ${location.pathname}`);
    
    // Skip recording visits to admin pages
    if (location.pathname.startsWith('/admin')) {
      console.log('Admin page visit - not recording in statistics');
      return;
    }
    
    // Record the page visit when the location changes (for non-admin pages only)
    recordPageVisit(location.pathname)
      .then(result => {
        if (result.success) {
          console.log(`Successfully recorded visit to page: ${location.pathname}`);
        } else {
          console.error('Failed to record page visit:', result.error);
        }
      })
      .catch(error => console.error('Error in recordPageVisit:', error));
  }, [location.pathname]);
  
  return null;
};

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <PageTracker />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/project/:projectId" element={<ProjectGalleryPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <CustomerAuthGuard>
                  <CustomerDashboard />
                </CustomerAuthGuard>
              } />
              <Route path="/admin" element={
                <AdminAuthGuard>
                  <Admin />
                </AdminAuthGuard>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegistration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Toaster />
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
