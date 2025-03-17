import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProductFeatured: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/featured`);
        if (!response.ok) throw new Error("Failed to fetch featured products");
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Error fetching featured products:",error);
       
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-mutedTeal" />
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="heading-lg mb-2">No featured products found</h2>
        <p className="text-muted-foreground">
          Check back later for our featured collection.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-warmSand/10">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-2">Featured Collection</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our most popular pieces, selected for their exceptional design and quality
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFeatured;