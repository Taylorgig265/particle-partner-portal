import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGallery } from '@/services/product-service';
import { useProjects, Project } from '@/services/project-service';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Loader2, FolderOpen } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

const Gallery = () => {
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const { items, loading: galleryLoading, error: galleryError, fetchGalleryItems } = useGallery();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Gallery.tsx useEffect, activeProject:', activeProject);
    if (activeProject) {
      fetchGalleryItems(activeProject);
    } else {
      fetchGalleryItems();
    }
  }, [activeProject, fetchGalleryItems]);

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
                Discover our portfolio of completed projects and solutions. 
                Each image tells a story of how we've helped our clients achieve their goals.
              </p>
            </div>

            {loading && activeProject === null ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-particle-navy animate-spin mr-4" />
                <p className="text-lg text-gray-600">Loading gallery...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 rounded-lg">
                <p className="text-lg text-red-500 mb-4">{error}</p>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {projects.length > 0 && (
                  <Tabs 
                    defaultValue="all"
                    className="w-full"
                    onValueChange={(value) => {
                      console.log('Tab changed to:', value);
                      if (value === 'all') {
                        setActiveProject(null);
                      } else {
                        setActiveProject(value);
                        navigate(`/gallery/project/${value}`);
                      }
                    }}
                    value={activeProject || "all"}
                  >
                    <TabsList className="flex-wrap h-auto mb-8">
                      <TabsTrigger value="all" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>All Projects</span>
                      </TabsTrigger>
                      {projects.map((project) => (
                        <TabsTrigger 
                          key={project.id} 
                          value={project.id}
                          className="flex items-center gap-2"
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>{project.name}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    <TabsContent value="all">
                      {items.length === 0 && activeProject === null ? (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                          <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                          <h3 className="mt-4 text-lg font-semibold text-gray-900">No gallery items yet</h3>
                          <p className="mt-2 text-gray-500">Check back soon for updates to our project gallery.</p>
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
                    </TabsContent>
                    {projects.map(p => (
                      <TabsContent key={p.id} value={p.id}>
                        <div className="flex items-center justify-center py-20">
                           <Loader2 className="h-8 w-8 text-particle-navy animate-spin mr-3" />
                           <span>Loading project: {p.name}...</span>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}

                {projects.length === 0 && !loading && !error && (
                   items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                      <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                      <h3 className="mt-4 text-lg font-semibold text-gray-900">No gallery items or projects yet</h3>
                      <p className="mt-2 text-gray-500">Check back soon for updates.</p>
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
                  )
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Gallery;
