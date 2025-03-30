
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAdminProducts, Product } from "@/services/product-service";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Rich text editor component
const RichTextEditor = ({ 
  value, 
  onChange 
}: { 
  value: string, 
  onChange: (value: string) => void 
}) => {
  return (
    <div className="rich-text-editor">
      <div className="flex gap-2 mb-2">
        <Button
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onChange(value + '<h2>Heading</h2>')}
        >
          H2
        </Button>
        <Button
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onChange(value + '<p>Paragraph</p>')}
        >
          P
        </Button>
        <Button
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onChange(value + '<strong>Bold text</strong>')}
        >
          B
        </Button>
        <Button
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onChange(value + '<em>Italic text</em>')}
        >
          I
        </Button>
        <Button
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => onChange(value + '<ul><li>List item</li></ul>')}
        >
          List
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] font-mono text-sm"
        placeholder="Enter HTML content here..."
      />
      <div className="mt-4">
        <Label>Preview:</Label>
        <div 
          className="border rounded-md p-4 mt-2 prose max-w-full"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      </div>
    </div>
  );
};

const ProductForm = ({ 
  product, 
  onSubmit, 
  onCancel 
}: { 
  product?: Product, 
  onSubmit: (data: any) => void, 
  onCancel: () => void 
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    fullDescription: product?.fullDescription || "",
    price: product?.price || "",
    category: product?.category || "",
    image_url: product?.image_url || "",
    in_stock: product?.in_stock !== undefined ? product.in_stock : true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFullDescriptionChange = (value: string) => {
    setFormData({
      ...formData,
      fullDescription: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Descriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              id="in_stock"
              name="in_stock"
              type="checkbox"
              className="w-4 h-4"
              checked={formData.in_stock as boolean}
              onChange={handleChange}
            />
            <Label htmlFor="in_stock">In Stock</Label>
          </div>
        </TabsContent>
        
        <TabsContent value="description" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description for product listings"
            />
            <FormDescription>
              A short summary displayed on product listings (max 150 characters recommended)
            </FormDescription>
          </div>
          
          <div className="space-y-2 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Full Description (Rich Text)
            </Label>
            <RichTextEditor 
              value={formData.fullDescription} 
              onChange={handleFullDescriptionChange} 
            />
            <FormDescription>
              Detailed product description with formatting, displayed on the product details page
            </FormDescription>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const AdminProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const handleAddProduct = async (formData: any) => {
    await addProduct(formData);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProduct = async (formData: any) => {
    if (selectedProduct) {
      await updateProduct(selectedProduct.id, formData);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Products</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Products ({products.length})</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[750px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details to add a new product to your catalog.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              onSubmit={handleAddProduct} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded" 
                      />
                    )}
                    <div>
                      <div>{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-gray-500 max-w-[250px] truncate">
                          {product.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.category || "Uncategorized"}</TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.in_stock 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of this product.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleUpdateProduct} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedProduct(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
