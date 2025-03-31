
// Ensure updateProduct function in useAdminProducts is getting the correct type
const updateProduct = async (id: string, updates: Partial<Product>) => {
  try {
    // Map the fullDescription field to full_description for database compatibility
    const dbUpdates = {
      ...updates,
      full_description: updates.fullDescription,
    };
    
    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select();
    
    if (error) throw new Error(error.message);
    
    toast({
      title: "Product updated",
      description: `Product has been updated successfully.`,
    });
    
    fetchProducts();
    return data;
  } catch (err: any) {
    toast({
      title: "Error updating product",
      description: err.message,
      variant: "destructive",
    });
    console.error("Error updating product:", err);
    throw err;
  }
};
