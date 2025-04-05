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
    in_stock: true
  });

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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      fullDescription: "",
      price: 0,
      category: "",
      image_url: "",
      in_stock: true
    });
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = await addProduct(formData);
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
    }
  };

  const handleEditClick = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      fullDescription: product.fullDescription || product.full_description || "",
      price: product.price,
      category: product.category,
      image_url: product.image_url || product.imageUrl || "",
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
          <DialogContent className="sm:max-w-[600px]">
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
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
        <DialogContent className="sm:max-w-[600px]">
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
                <label htmlFor="edit-image_url">Image URL</label>
                <Input 
                  id="edit-image_url" 
                  name="image_url" 
                  value={formData.image_url} 
                  onChange={handleInputChange} 
                />
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
