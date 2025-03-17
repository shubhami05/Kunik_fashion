

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { categories, getTotalStock, Product } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

// export type ProductVariation = {
//   size: string;
//   color: string;
//   stock: number;
// };

// export type Product = {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   originalPrice?: number;
//   images: string[];
//   category: string;
//   isNew?: boolean;
//   isFeatured?: boolean;
//   stock: number;
//   variations: ProductVariation[];
// };

const AdminProducts: React.FC = () => {

  // const BASE_URL = 'http://localhost:5000'

  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;



  const { products, deleteProduct, sortProducts, searchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "">("");
  const { toast } = useToast();

  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchProducts(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    // Filter using context
  };

  const handleSort = (type: "price-asc" | "price-desc" | "name-asc" | "name-desc") => {
    setSortOrder(type);
    sortProducts(type);
  };

  // const handleDelete = (id: string, name: string) => {
  //   if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
  //     deleteProduct(id);
  //     toast({
  //       title: "Product deleted",
  //       description: `${name} has been removed from your inventory`,
  //     });
  //   }
  // };

  // const handleDelete = async (id: string, name: string) => {
  //   if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

  //   try {
  //     const response = await fetch(`${BASE_URL}/api/products/${id}`, {
  //       method: "DELETE",
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.error || "Failed to delete product");
  //     }

  //     toast({
  //       title: "Product deleted",
  //       description: `${name} has been removed from your inventory`,
  //     });

  //     // Refresh product list or navigate
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to delete product",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    // console.log("Sending DELETE request for ID:", id); // Debugging log

    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      console.log("Deleted product:", data);
      toast({
        title: "Product deleted",
        description: `${name} has been removed from your inventory`,
      });

      // Refresh product list or navigate
    } catch (error) {
      // console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h1 className="heading-lg mb-2">Products</h1>
              <p className="text-gray-600">
                Manage your product inventory
              </p>
            </div>

            <Link
              to="/admin/products/add"
              className="btn-primary flex items-center mt-4 sm:mt-0"
            >
              <Plus size={18} className="mr-1" />
              Add Product
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-champagne/20 p-4 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="relative w-full md:w-80 mb-4 md:mb-0">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input-field pl-10 w-full"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-charcoal hover:text-mutedTeal transition-colors"
              >
                <Filter size={18} className="mr-1" />
                Filters
                {showFilters ? (
                  <ChevronUp size={18} className="ml-1" />
                ) : (
                  <ChevronDown size={18} className="ml-1" />
                )}
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100"
              >
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="input-field w-full"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort("price-asc")}
                      className={`px-3 py-2 text-sm rounded-md border ${sortOrder === "price-asc"
                        ? "bg-mutedTeal/10 border-mutedTeal text-mutedTeal"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => handleSort("price-desc")}
                      className={`px-3 py-2 text-sm rounded-md border ${sortOrder === "price-desc"
                        ? "bg-mutedTeal/10 border-mutedTeal text-mutedTeal"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      Price: High to Low
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort("name-asc")}
                      className={`px-3 py-2 text-sm rounded-md border ${sortOrder === "name-asc"
                        ? "bg-mutedTeal/10 border-mutedTeal text-mutedTeal"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      A-Z
                    </button>
                    <button
                      onClick={() => handleSort("name-desc")}
                      className={`px-3 py-2 text-sm rounded-md border ${sortOrder === "name-desc"
                        ? "bg-mutedTeal/10 border-mutedTeal text-mutedTeal"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      Z-A
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-champagne/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded overflow-hidden mr-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <span 
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${product.stock > 5 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'}`}
                        >
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span> */}

                        {/* <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${getTotalStock(product) > 5 
                              ? 'bg-green-100 text-green-800' 
                              : getTotalStock(product) > 0 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'}`}
                          >
                            {getTotalStock(product) > 0 ? getTotalStock(product) : 'Out of stock'}
                          </span> */}

                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
  ${product.variations.reduce((total, variation) => total + variation.stock, 0) > 5
                              ? 'bg-green-100 text-green-800'
                              : product.variations.reduce((total, variation) => total + variation.stock, 0) > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'}`}
                        >
                          {product.variations.reduce((total, variation) => total + variation.stock, 0) > 0
                            ? product.variations.reduce((total, variation) => total + variation.stock, 0)
                            : 'Out of stock'}
                        </span>

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="text-mutedTeal hover:text-mutedTeal/80 mr-3"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-dustyRose hover:text-dustyRose/80"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminProducts;
