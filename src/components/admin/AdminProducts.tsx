
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAdminProducts, Product } from '@/services/product-service';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatCurrency } from '@/lib/utils';

// Define allowed categories
const ALLOWED_CATEGORIES = [
  'Diagnostic Equipment',
  'Laboratory and Scientific Instruments',
  'Hospital and Healthcare Solutions',
  'Industrial and Safety Equipment'
] as const;

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  full_description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  category: z.enum(ALLOWED_CATEGORIES, { message: 'Please select a valid category.' }),
  image_url: z.string().url({ message: 'Please enter a valid URL.' }).optional(),
  additional_images: z.string().optional(),
  in_stock: z.boolean().default(true),
  is_featured: z.boolean().default(false).optional(),
});

const AdminProducts = () => {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      full_description: '',
      price: 0,
      category: ALLOWED_CATEGORIES[0],
      image_url: '',
      additional_images: '',
      in_stock: true,
      is_featured: false,
    },
  });

  useEffect(() => {
    if (selectedProduct) {
      form.reset({
        name: selectedProduct.name,
        description: selectedProduct.description || '',
        full_description: selectedProduct.full_description || '',
        price: selectedProduct.price,
        category: (selectedProduct.category as typeof ALLOWED_CATEGORIES[number]) || ALLOWED_CATEGORIES[0],
        image_url: selectedProduct.image_url || '',
        additional_images: (selectedProduct.additional_images || []).join(',') || '',
        in_stock: selectedProduct.in_stock !== false,
        is_featured: selectedProduct.is_featured || false,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        full_description: '',
        price: 0,
        category: ALLOWED_CATEGORIES[0],
        image_url: '',
        additional_images: '',
        in_stock: true,
        is_featured: false,
      });
    }
  }, [selectedProduct, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const productData = {
        name: values.name,
        description: values.description,
        full_description: values.full_description,
        price: values.price,
        category: values.category,
        image_url: values.image_url,
        additional_images: values.additional_images ? values.additional_images.split(',') : [],
        in_stock: values.in_stock,
        is_featured: values.is_featured || false,
      };

      if (isEditing && selectedProduct) {
        const updatedProduct = { ...selectedProduct, ...productData };
        const success = await updateProduct(updatedProduct);
        if (success) {
          toast({
            title: "Product Updated",
            description: "Product updated successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to update product.",
            variant: "destructive",
          });
        }
      } else {
        await addProduct(productData as Omit<Product, 'id' | 'created_at'>);
        toast({
          title: "Product Added",
          description: "Product added successfully.",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit product data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const success = await deleteProduct(id);
        if (success) {
          toast({
            title: "Product Deleted",
            description: "Product deleted successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete product.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to delete product.",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenDialog = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsDialogOpen(true);
    form.reset({
      name: '',
      description: '',
      full_description: '', 
      price: 0,
      category: ALLOWED_CATEGORIES[0],
      image_url: '',
      additional_images: '',
      in_stock: true,
      is_featured: false,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <Button onClick={handleOpenDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading products...
        </div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>In Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.in_stock ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{product.is_featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edit the product details below.' : 'Enter the details for the new product.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Product Description" className="h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="full_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description (HTML)</FormLabel>
                      <FormControl>
                        <ReactQuill
                          theme="snow"
                          value={field.value || ''}
                          onChange={field.onChange}
                          className="bg-background min-h-[200px]"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{'list': 'ordered'}, {'list': 'bullet'}],
                              [{ 'indent': '-1'}, { 'indent': '+1' }],
                              ['link'],
                              ['clean']
                            ],
                          }}
                          formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike',
                            'list', 'bullet',
                            'indent',
                            'link',
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (MWK)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ALLOWED_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additional_images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Images (Comma Separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" className="h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="in_stock"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>In Stock</FormLabel>
                        <FormDescription>
                          Whether the product is currently in stock
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>
                          Mark this product as featured to display it on the homepage.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    isEditing ? 'Update Product' : 'Add Product'
                  )}
                </Button>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
