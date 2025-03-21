import React, { useState, useEffect, Key } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

const AdminProducts: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{
    _id: Key; name: string
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();
  const { deleteImage } = useCloudinaryUpload();

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    let filtered = [...products];

    // Apply category filter if active
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Then apply search filter
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    let filtered = [...products];

    // Apply category filter
    if (category !== "all") {
      filtered = filtered.filter(product => product.category === category);
    }

    // Apply existing search if any
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to refresh products",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      // Find the product to get its images
      const product = products.find(p => p.id === id);
      if (!product) return;

      // Delete all images from Cloudinary first
      const deletePromises = product.images.map(imageUrl => deleteImage(imageUrl));
      await Promise.all(deletePromises);

      // Then delete the product from your backend
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      toast({
        title: "Product deleted",
        description: `${name} has been removed from your inventory`,
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
    };

    init();
    const intervalId = setInterval(fetchProducts, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div>
              <h1 className="heading-lg mb-2">Products</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>

            <Link
              to="/admin/products/add"
              className="btn-primary flex items-center mt-4 sm:mt-0"
            >
              <Plus size={18} className="mr-1" />
              Add Product
            </Link>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-champagne/20 p-4 mb-6">
            <div className="relative w-full md:w-80">
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
          </div>

          {/* Category Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="inline-flex rounded-lg border border-champagne/20 bg-white p-1 min-w-full">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedCategory === "all"
                    ? "bg-mutedTeal text-white"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                All Products
              </button>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedCategory === category.name
                        ? "bg-mutedTeal text-white"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">Loading categories...</div>
              )}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-champagne/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 sm:w-auto">
                      Product
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Price
                      </div>
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-normal">
                        <div className="flex items-start sm:items-center gap-3 max-w-md">
                          <div className="h-16 w-16 sm:h-12 sm:w-12 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </div>

                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Rs.{product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            Rs.{product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.variations.reduce((total, variation) => total + variation.stock, 0)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-mutedTeal hover:text-mutedTeal/80"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-dustyRose hover:text-dustyRose/80"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {searchTerm
                    ? "No products match your search criteria"
                    : selectedCategory !== "all"
                      ? `No products found in ${selectedCategory} category`
                      : "No products found"}
                </p>
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
