
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";

// Define the form schema with Zod
const productFormSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0." }),
  category: z.string().min(1, { message: "Category is required." }),
  image_url: z.string().optional(),
  in_stock: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

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
  onSubmit: (data: ProductFormValues) => void, 
  onCancel: () => void 
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  // Initialize the form with default values or product values if editing
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      fullDescription: product?.fullDescription || "",
      price: product?.price || 0,
      category: product?.category || "",
      image_url: product?.image_url || "",
      in_stock: product?.in_stock !== undefined ? product.in_stock : true
    },
  });

  // Handle form submission
  const handleSubmit = (values: ProductFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="description">Descriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Product name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Category" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="0.00" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="in_stock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In Stock</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="description" className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description for product listings"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    A short summary displayed on product listings (max 150 characters recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2 pt-4 border-t">
              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Full Description (Rich Text)
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor 
                        value={field.value || ""} 
                        onChange={field.onChange} 
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed product description with formatting, displayed on the product details page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
    </Form>
  );
};

const AdminProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const handleAddProduct = async (formData: ProductFormValues) => {
    await addProduct(formData);
    setIsAddDialogOpen(false);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateProduct = async (formData: ProductFormValues) => {
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
