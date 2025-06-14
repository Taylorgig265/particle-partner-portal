
import React from 'react'; // Removed useState, useEffect as activeProject is removed
import { Link } from 'react-router-dom'; // useNavigate removed as navigation is direct via Link
import { useGallery } from '@/services/product-service';
import { useProjects, Project } from '@/services/project-service';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Loader2, FolderOpen, ChevronRight } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription // Added CardDescription
} from "@/components/ui/card";
import { Button } from '@/components/ui/button'; // For "View Project" button on cards

const Gallery = () => {
  const { items: galleryItems, loading: galleryLoading, error: galleryError } = useGallery();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();

  // Removed useEffect that was dependent on activeProject,
  // as useGallery hook fetches all items initially.

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1 py-16">
          <div className="content-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-particle-navy mb-4">Project Gallery</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our portfolio of projects or browse all images from our collective work.
              </p>
            </div>

            {/* Projects Section */}
            <section className="mb-16">
              <h2 className="text-3xl font-semibold text-particle-navy mb-8 text-center md:text-left">Our Projects</h2>
              {projectsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 text-particle-navy animate-spin mr-3" />
                  <p className="text-gray-600">Loading projects...</p>
                </div>
              ) : projectsError ? (
                <div className="text-center py-10 bg-red-50 rounded-lg">
                  <p className="text-lg text-red-500 mb-2">Error loading projects: {projectsError}</p>
                  <p className="text-gray-600">Please try refreshing the page.</p>
                </div>
              ) : projects.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                >
                  {projects.map((project: Project) => (
                    <motion.div key={project.id} variants={itemVariants}>
                      <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <FolderOpen className="h-8 w-8 text-particle-blue" />
                            <CardTitle className="text-2xl text-particle-navy">{project.name}</CardTitle>
                          </div>
                          {project.description && (
                            <CardDescription className="text-gray-600 line-clamp-3">
                              {project.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="flex-grow" /> {/* Pushes footer down */}
                        <div className="p-6 pt-0">
                           <Link to={`/gallery/project/${project.id}`} className="w-full">
                            <Button variant="outline" className="w-full group">
                              View Project
                              <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No Projects Yet</h3>
                  <p className="mt-1 text-gray-500">We're working on new projects. Check back soon!</p>
                </div>
              )}
            </section>

            {/* All Gallery Items Section */}
            <section>
              <h2 className="text-3xl font-semibold text-particle-navy mb-8 text-center md:text-left">All Gallery Images</h2>
              {galleryLoading && projects.length === 0 && !projectsLoading ? ( // Show general gallery loader if projects also not loaded yet
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 text-particle-navy animate-spin mr-4" />
                  <p className="text-lg text-gray-600">Loading gallery...</p>
                </div>
              ) : galleryLoading ? (
                 <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 text-particle-navy animate-spin mr-3" />
                  <p className="text-gray-600">Loading images...</p>
                </div>
              ) : galleryError ? (
                <div className="text-center py-10 bg-red-50 rounded-lg">
                  <p className="text-lg text-red-500 mb-2">Error loading gallery items: {galleryError}</p>
                  <p className="text-gray-600">Please try refreshing the page.</p>
                </div>
              ) : galleryItems.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                >
                  {galleryItems.map((item) => (
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
                            target.src = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Fallback image
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-particle-navy mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">No Gallery Items Yet</h3>
                  <p className="mt-2 text-gray-500">Check back soon for updates to our project gallery.</p>
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Gallery;
