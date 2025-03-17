
import React, { useState } from "react";
import { motion } from "framer-motion";
import { categories } from "@/lib/data";
import { useProducts } from "@/context/ProductContext";
import { Search } from "lucide-react";

const ProductFilter: React.FC = () => {
  const { setCategory, currentCategory, searchProducts, sortProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "">("");

  const handleCategoryChange = (category: string) => {
    setCategory(category);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchProducts(searchQuery);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "price-asc" | "price-desc" | "name-asc" | "name-desc" | "";
    setSortType(value);
    if (value) {
      sortProducts(value as "price-asc" | "price-desc" | "name-asc" | "name-desc");
    }
  };

  return (
    <div className="bg-ivory py-6">
      <div className="container mx-auto px-4">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex w-full md:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mutedTeal hover:text-mutedTeal/80 transition-colors"
            >
              <Search size={18} />
            </button>
          </form>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={sortType}
              onChange={handleSortChange}
              className="input-field appearance-none"
            >
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start pt-2">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => handleCategoryChange(category)}
              className={`filter-chip ${currentCategory === category ? "active" : ""}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
