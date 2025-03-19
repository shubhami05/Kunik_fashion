import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useProducts } from "@/context/ProductContext";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/data";
import { fetchProducts } from "@/lib/api";

interface ProductListProps {
  limit?: number;
  title?: string;
  subtitle?: string;
}

const ProductList: React.FC<ProductListProps> = ({ 
  limit, 
  title = "Our Products", 
  subtitle 
}) => {
  const { filteredProducts, loading } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [currentLimit, setCurrentLimit] = useState(limit || 8);

  // Add effect to handle initial load and refetch
  useEffect(() => {
    fetchProducts();
    
    // Set up polling for product updates
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  // Update visible products when filtered products change
  useEffect(() => {
    const pro = filteredProducts.slice(0, currentLimit);
    setVisibleProducts(pro);
  }, [filteredProducts, currentLimit]);

  const loadMore = () => {
    setCurrentLimit(prev => prev + 4);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-10 w-10 animate-spin text-mutedTeal" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="heading-lg mb-2">No products found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {title && (
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      
      {!limit && visibleProducts.length < filteredProducts.length && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={loadMore} 
            className="btn-outline"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
