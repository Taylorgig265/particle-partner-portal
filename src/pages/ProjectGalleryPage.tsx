
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGallery } from '@/services/product-service';
import { useProjects, Project } from '@/services/project-service';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Loader2, ArrowLeft, FolderOpen } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ProjectGalleryPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { items, loading: galleryLoading, error: galleryError, fetchGalleryItems } = useGallery();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchGalleryItems(projectId);
    }
  }, [projectId, fetchGalleryItems]);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const currentProject = projects.find(p => p.id === projectId);
      setProject(currentProject || null);
    }
  }, [projectId, projects]);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const loading = galleryLoading || projectsLoading;
  const error = galleryError || projectsError;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 text-particle-navy animate-spin mr-4" />
          <p className="text-lg text-gray-600">Loading project gallery...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center py-16 bg-red-50 rounded-lg px-8">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <p className="text-gray-600">Could not load project details. Please try again later.</p>
            <Button onClick={() => navigate('/gallery')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project && !loading) {
     return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center py-16 bg-yellow-50 rounded-lg px-8">
            <FolderOpen className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <p className="text-lg text-yellow-700 mb-4">Project not found.</p>
            <p className="text-gray-600">The project you are looking for does not exist or could not be loaded.</p>
            <Button onClick={() => navigate('/gallery')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col bg-gray-50"
      >
        <Navbar />
        <main className="flex-1 py-16">
          <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button onClick={() => navigate('/gallery')} variant="outline" className="mb-8 group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Main Gallery
            </Button>

            {project && (
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-particle-navy mb-4">{project.name}</h1>
                {project.description && (
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {project.description}
                  </p>
                )}
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow">
                <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No images in this project yet</h3>
                <p className="mt-2 text-gray-500">Check back soon for updates to this project's gallery.</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="initial"
                animate="animate"
              >
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    variants={itemVariants}
                  >
                    <div className="aspect-video">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-particle-navy mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectGalleryPage;

