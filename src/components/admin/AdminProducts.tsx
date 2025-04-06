import React, { useState } from "react";
import { useAdminProducts, Product } from "@/services/product-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody,
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const AdminProducts = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useAdminProducts();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    price: 0,
    category: "",
    image_url: "",
    additional_images: [] as string[],
    in_stock: true
  });
  
  const [additionalImageUrl, setAdditionalImageUrl] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalImageUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files);
    }
  };

  const addAdditionalImage = () => {
    if (additionalImageUrl) {
      setFormData({
        ...formData,
        additional_images: [...formData.additional_images, additionalImageUrl]
      });
      setAdditionalImageUrl("");
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData({
      ...formData,
      additional_images: formData.additional_images.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      fullDescription: "",
      price: 0,
      category: "",
      image_url: "",
      additional_images: [],
      in_stock: true
    });
    setAdditionalImageUrl("");
    setImageFiles(null);
  };

  const handleAddProduct = async () => {
    if (!formData.name) {
      toast({
        title: "Product name is required",
        description: "Please enter a name for the product.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      let mainImageUrl = formData.image_url;
      let additionalImagesUrls = [...formData.additional_images];

      // If files were selected, upload them to Supabase Storage
      if (imageFiles && imageFiles.length > 0) {
        // Upload main image first
        const mainFile = imageFiles[0];
        const mainFileName = `${Date.now()}-${mainFile.name}`;
        const mainFilePath = `products/${mainFileName}`;
        
        const { data: mainUploadData, error: mainUploadError } = await supabase.storage
          .from('public')
          .upload(mainFilePath, mainFile);
          
        if (mainUploadError) {
          throw new Error(`Failed to upload main image: ${mainUploadError.message}`);
        }
        
        const { data: mainPublicUrlData } = supabase.storage
          .from('public')
          .getPublicUrl(mainFilePath);
          
        mainImageUrl = mainPublicUrlData.publicUrl;
        
        // Upload additional images if there are more files
        if (imageFiles.length > 1) {
          for (let i = 1; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const fileName = `${Date.now()}-${i}-${file.name}`;
            const filePath = `products/${fileName}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('public')
              .upload(filePath, file);
              
            if (uploadError) {
              console.warn(`Failed to upload additional image ${i}:`, uploadError.message);
              continue;
            }
            
            const { data: publicUrlData } = supabase.storage
              .from('public')
              .getPublicUrl(filePath);
              
            additionalImagesUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      if (!mainImageUrl) {
        toast({
          title: "Main image is required",
          description: "Please provide either an image URL or upload an image file.",
          variant: "destructive"
        });
        setIsUploading(false);
        return;
      }

      const productData = {
        ...formData,
        image_url: mainImageUrl,
        additional_images: additionalImagesUrls
      };

      const newProduct = await addProduct(productData);
      if (newProduct) {
        toast({
          title: "Product added",
          description: `${formData.name} has been added successfully.`
        });
      } else {
        toast({
          title: "Failed to add product",
          description: "An error occurred while adding the product.",
          variant: "destructive"
        });
      }
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Failed to add product",
        description: "An error occurred while adding the product.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      fullDescription: product.fullDescription || product.full_description || "",
      price: product.price,
      category: product.category || "",
      image_url: product.image_url || product.imageUrl || "",
      additional_images: product.additional_images || [],
      in_stock: product.in_stock !== undefined ? product.in_stock : true
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;
    
    try {
      // Here's the fix for the TS error - pass only one argument with all the data
      const success = await updateProduct({
        ...currentProduct,
        name: formData.name,
        description: formData.description,
        fullDescription: formData.fullDescription,
        price: formData.price,
        category: formData.category,
        image_url: formData.image_url,
        additional_images: formData.additional_images,
        in_stock: formData.in_stock
      });
      
      if (success) {
        toast({
          title: "Product updated",
          description: `${formData.name} has been updated successfully.`
        });
      } else {
        toast({
          title: "Failed to update product",
          description: "An error occurred while updating the product.",
          variant: "destructive"
        });
      }
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Failed to update product",
        description: "An error occurred while updating the product.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const success = await deleteProduct(id);
        if (success) {
          toast({
            title: "Product deleted",
            description: "The product has been deleted successfully."
          });
        } else {
          toast({
            title: "Failed to delete product",
            description: "An error occurred while deleting the product.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast({
          title: "Failed to delete product",
          description: "An error occurred while deleting the product.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) return <div className="py-8 text-center">Loading products...</div>;
  
  if (error) return <div className="py-8 text-center text-red-500">Error loading products: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product to display in the catalog.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name">Name</label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Product Name" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="category">Category</label>
                  <Input 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange} 
                    placeholder="Product Category" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="price">Price</label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    placeholder="0.00" 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="in_stock">Stock Status</label>
                  <Select 
                    value={formData.in_stock ? "true" : "false"}
                    onValueChange={(value) => setFormData({...formData, in_stock: value === "true"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">In Stock</SelectItem>
                      <SelectItem value="false">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Short Description</label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Brief product description"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="fullDescription">Full Description</label>
                <Textarea 
                  id="fullDescription" 
                  name="fullDescription" 
                  value={formData.fullDescription} 
                  onChange={handleInputChange} 
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label>Product Images</label>
                <div className="p-4 border border-dashed rounded-md bg-gray-50">
                  <p className="text-sm mb-2">Upload multiple images at once (first image will be main)</p>
                  <Input 
                    id="image_files" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    multiple
                  />
                  <p className="text-xs text-gray-500 mt-2 mb-2">Or add image URLs:</p>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Input 
                        id="image_url" 
                        name="image_url" 
                        value={formData.image_url} 
                        onChange={handleInputChange} 
                        placeholder="Main image URL" 
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="text"
                        value={additionalImageUrl}
                        onChange={handleAdditionalImageChange}
                        placeholder="Additional image URL"
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={addAdditionalImage}
                        disabled={!additionalImageUrl}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  {formData.additional_images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Additional Images:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.additional_images.map((url, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-xs truncate flex-1 mr-2">{url}</span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeAdditionalImage(index)}
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Add Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{formatCurrency(parseFloat(product.price.toString()))}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(product)}>
                        <Edit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)}>
                        <Trash size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name">Name</label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-category">Category</label>
                <Input 
                  id="edit-category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="edit-price">Price</label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-in_stock">Stock Status</label>
                <Select 
                  value={formData.in_stock ? "true" : "false"}
                  onValueChange={(value) => setFormData({...formData, in_stock: value === "true"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-description">Short Description</label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-fullDescription">Full Description</label>
              <Textarea 
                id="edit-fullDescription" 
                name="fullDescription" 
                value={formData.fullDescription} 
                onChange={handleInputChange} 
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <label>Product Images</label>
              <div className="p-4 border border-dashed rounded-md bg-gray-50">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Input 
                      id="edit-image_url" 
                      name="image_url" 
                      value={formData.image_url} 
                      onChange={handleInputChange} 
                      placeholder="Main image URL" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="text"
                      value={additionalImageUrl}
                      onChange={handleAdditionalImageChange}
                      placeholder="Additional image URL"
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={addAdditionalImage}
                      disabled={!additionalImageUrl}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {formData.additional_images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Additional Images:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {formData.additional_images.map((url, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span className="text-xs truncate flex-1 mr-2">{url}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeAdditionalImage(index)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
