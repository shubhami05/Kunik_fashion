import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export type ProductVariation = {
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  stock: number;
  variations: ProductVariation[];
};

type ProductContextType = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  currentCategory: string;
  setCategory: (category: string) => void;
  searchProducts: (query: string) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addVariation: (productId: string, variation: ProductVariation) => void;
  updateVariation: (productId: string, variation: ProductVariation) => void;
  removeVariation: (productId: string, size: string, color: string) => void;
  sortProducts: (sortType: "price-asc" | "price-desc" | "name-asc" | "name-desc") => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState("all");
  const { toast } = useToast();

  // const BASE_URL = "http://localhost:5000";

  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products`);
        const data = await response.json();
        const updatedData = data.map((product: Product) => ({
          ...product,
          variations: product.variations ?? [],
        }));
        setProducts(updatedData);
        setFilteredProducts(updatedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const setCategory = (category: string) => {
    setCurrentCategory(category);
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) {
      setCategory(currentCategory);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    setFilteredProducts(products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery)
    ));
  };

  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const newProduct = await response.json();
      
      // Update main products list
      setProducts(prev => [...prev, newProduct]);
      
      // Update filtered products only if category matches or showing all
      if (currentCategory === "all" || newProduct.category === currentCategory) {
        setFilteredProducts(prev => [...prev, newProduct]);
      }
      
      toast({ title: "Product added", description: `${newProduct.name} has been added.` });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({ 
        title: "Error", 
        description: "Failed to add product", 
        variant: "destructive" 
      });
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      setFilteredProducts(prev => prev.map(p => (p.id === id ? updatedProduct : p)));
      toast({ title: "Product updated", description: "Product details have been updated." });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
      
      // Update main products list
      setProducts(prev => prev.filter(p => p.id !== id));
      
      // Update filtered products
      setFilteredProducts(prev => prev.filter(p => p.id !== id));
      
      toast({ title: "Product deleted", description: "The product has been removed." });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete product", 
        variant: "destructive" 
      });
    }
  };

  const addVariation = (productId: string, variation: ProductVariation) => {
    setProducts(prevProducts => prevProducts.map(product => 
      product.id === productId ? { ...product, variations: [...product.variations, variation] } : product
    ));
  };

  const updateVariation = (productId: string, variation: ProductVariation) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === productId ? { 
        ...product, 
        variations: product.variations.map(v => v.size === variation.size && v.color === variation.color ? variation : v)
      } : product
    ));
  };

  const removeVariation = (productId: string, size: string, color: string) => {
    setProducts(prevProducts => prevProducts.map(product => 
      product.id === productId ? { 
        ...product, 
        variations: product.variations.filter(v => !(v.size === size && v.color === color))
      } : product
    ));
  };


  const sortProducts = (sortType: "price-asc" | "price-desc" | "name-asc" | "name-desc") => {
        let sortedProducts = [...filteredProducts];
    
        switch (sortType) {
          case "price-asc":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case "name-asc":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        }
    
        setFilteredProducts(sortedProducts);
      };

  return (
    <ProductContext.Provider value={{
      products,
      filteredProducts,
      loading,
      currentCategory,
      setCategory,
      searchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addVariation,
      updateVariation,
      removeVariation,
      sortProducts,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};