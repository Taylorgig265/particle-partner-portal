
import React, { useState, useEffect } from "react";
import { useGallery, GalleryItem } from "@/services/product-service";
import { useProjects, Project } from "@/services/project-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Image, Plus, Trash, FolderPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminGallery = () => {
  const { items, loading: galleryLoading, error: galleryError, fetchGalleryItems, addGalleryItem, deleteGalleryItem } = useGallery();
  const { projects, loading: projectsLoading, error: projectsError, addProject, deleteProject } = useProjects();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    project_id: ""
  });
  const [projectFormData, setProjectFormData] = useState({
    name: "",
    description: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (activeProject) {
      fetchGalleryItems(activeProject);
    } else {
      fetchGalleryItems();
    }
  }, [activeProject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectFormData({
      ...projectFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleProjectSelectChange = (value: string) => {
    setFormData({
      ...formData,
      project_id: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      project_id: ""
    });
    setImageFile(null);
  };

  const resetProjectForm = () => {
    setProjectFormData({
      name: "",
      description: ""
    });
  };

  const handleAddProject = async () => {
    if (!projectFormData.name) {
      toast({
        title: "Project name is required",
        description: "Please enter a name for the project.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newProject = await addProject({
        name: projectFormData.name,
        description: projectFormData.description
      });

      if (newProject) {
        toast({
          title: "Project added",
          description: `${projectFormData.name} has been added to projects.`
        });
        setIsAddProjectDialogOpen(false);
        resetProjectForm();
      } else {
        toast({
          title: "Failed to add project",
          description: "An error occurred while adding the project.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Failed to add project:", error);
      toast({
        title: "Failed to add project",
        description: error.message || "An error occurred while adding the project.",
        variant: "destructive"
      });
    }
  };

  const handleAddGalleryItem = async () => {
    if (!formData.title) {
      toast({
        title: "Title is required",
        description: "Please enter a title for the gallery item.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = formData.image_url;

      // If a file was selected, upload it to Supabase Storage
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const filePath = `gallery/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      if (!imageUrl) {
        toast({
          title: "Image is required",
          description: "Please provide either an image URL or upload an image file.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      const itemToAdd: any = {
        title: formData.title,
        description: formData.description,
        image_url: imageUrl
      };

      if (formData.project_id) {
        itemToAdd.project_id = formData.project_id;
      }

      const newItem = await addGalleryItem(itemToAdd);

      if (newItem) {
        toast({
          title: "Gallery item added",
          description: `${formData.title} has been added to the gallery.`
        });
        setIsAddDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Failed to add gallery item",
          description: "An error occurred while adding the gallery item.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Failed to add gallery item:", error);
      toast({
        title: "Failed to add gallery item",
        description: error.message || "An error occurred while adding the gallery item.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        const success = await deleteGalleryItem(id);
        if (success) {
          toast({
            title: "Gallery item deleted",
            description: "The gallery item has been deleted successfully."
          });
        } else {
          toast({
            title: "Failed to delete gallery item",
            description: "An error occurred while deleting the gallery item.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to delete gallery item:", error);
        toast({
          title: "Failed to delete gallery item",
          description: "An error occurred while deleting the gallery item.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project? All gallery items in this project will be affected.")) {
      try {
        const success = await deleteProject(id);
        if (success) {
          setActiveProject(null);
          toast({
            title: "Project deleted",
            description: "The project has been deleted successfully."
          });
          fetchGalleryItems();
        } else {
          toast({
            title: "Failed to delete project",
            description: "An error occurred while deleting the project.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast({
          title: "Failed to delete project",
          description: "An error occurred while deleting the project.",
          variant: "destructive"
        });
      }
    }
  };

  const loading = galleryLoading || projectsLoading;
  const error = galleryError || projectsError;

  if (loading) return <div className="py-8 text-center">Loading gallery items...</div>;
  
  if (error) return <div className="py-8 text-center text-red-500">Error loading gallery: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <div className="flex gap-2">
          <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FolderPlus size={16} />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogDescription>Create a new project to group gallery images.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Project Name</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={projectFormData.name} 
                    onChange={handleProjectInputChange} 
                    placeholder="Project Name" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={projectFormData.description} 
                    onChange={handleProjectInputChange} 
                    placeholder="Describe this project"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddProjectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProject}>
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Gallery Image</DialogTitle>
                <DialogDescription>Share photos of your projects and work.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">Title</label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    placeholder="Image Title" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Describe what's shown in this image"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="project_id">Project (Optional)</label>
                  <Select value={formData.project_id} onValueChange={handleProjectSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="image_file">Upload Image</label>
                  <Input 
                    id="image_file" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <p className="text-xs text-gray-500">Or</p>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="image_url">Image URL</label>
                  <Input 
                    id="image_url" 
                    name="image_url" 
                    value={formData.image_url} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGalleryItem} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Add to Gallery"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="gallery">Gallery Items</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="gallery" className="mt-0">
        {projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Filter by Project:</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activeProject === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setActiveProject(null)}
              >
                All Images
              </Button>
              {projects.map(project => (
                <Button
                  key={project.id}
                  variant={activeProject === project.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveProject(project.id)}
                >
                  {project.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No gallery images</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first image to the gallery.</p>
            <div className="mt-6">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                    onClick={() => handleDeleteGalleryItem(item.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  {item.description && <CardDescription>{item.description}</CardDescription>}
                </CardHeader>
                <CardFooter className="flex flex-col items-start text-xs text-gray-500">
                  <span>Added on {new Date(item.created_at).toLocaleDateString()}</span>
                  {item.project_id && (
                    <span className="mt-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      Project: {projects.find(p => p.id === item.project_id)?.name || 'Unknown'}
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="projects" className="mt-0">
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first project to organize gallery images.</p>
            <div className="mt-6">
              <Button onClick={() => setIsAddProjectDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FolderPlus className="mr-2 h-5 w-5" />
                    {project.name}
                  </CardTitle>
                  {project.description && <CardDescription>{project.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {items.filter(item => item.project_id === project.id).length} images in this project
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setActiveTab("gallery");
                      setActiveProject(project.id);
                    }}
                  >
                    View Images
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    <Trash size={16} className="mr-1" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default AdminGallery;
