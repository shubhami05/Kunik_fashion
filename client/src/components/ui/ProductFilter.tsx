import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@/context/ProductContext";
import { Search, RefreshCw } from "lucide-react";

const ProductFilter: React.FC = () => {
  const { 
    categories, 
    setCategory, 
    currentCategory, 
    searchProducts, 
    sortProducts,
    fetchProducts 
  } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "">("");

  // Load all products by default
  useEffect(() => {
    handleShowAll();
  }, []);

  const handleShowAll = () => {
    setCategory("");
    setSearchQuery("");
    setSortType("");
    requestAnimationFrame(() => {
      fetchProducts(); // Fetch all products without any filters
    });
  };

  const handleCategoryChange = (categoryName: string) => {
    if (currentCategory === categoryName) {
      // If clicking the same category, show all products
      handleShowAll();
    } else {
      setCategory(categoryName);
      // Reset other filters when changing category
      setSearchQuery("");
      setSortType("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery.trim());
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as typeof sortType;
    setSortType(value);
    sortProducts(value || null);
  };

  const clearAllFilters = () => {
    setCategory("");
    setSearchQuery("");
    setSortType("");

    requestAnimationFrame(() => {
      searchProducts("");
      sortProducts(null);
    });

    
  };

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory.trim() !== "") || 
    (searchQuery && searchQuery.trim() !== "") || 
    sortType
  );

  return (
    <div className="bg-ivory py-6">
      <div className="container mx-auto px-4">
        {/* Categories with All Products Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleShowAll}
              className={`filter-chip ${
                !currentCategory && !searchQuery && !sortType 
                  ? "active bg-mutedTeal text-white" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              All Products
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                onClick={() => handleCategoryChange(category.name)}
                className={`filter-chip ${
                  currentCategory === category.name 
                    ? "active bg-mutedTeal text-white" 
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex w-full md:w-72 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="input-field pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mutedTeal hover:text-mutedTeal/80 transition-colors">
                <Search size={18} />
              </button>
            </form>
            
            <select
              value={sortType}
              onChange={handleSortChange}
              className="input-field appearance-none w-full md:w-56"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
