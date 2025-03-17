
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { categories, getProductById } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import VariationManager from "@/components/admin/VariationManager";







const EditProduct: React.FC = () => {


  // const BASE_URL = 'http://localhost:5000'
  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateProduct, addVariation, updateVariation, removeVariation } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string>("");

  const { uploadImage, uploading, error } = useCloudinaryUpload();


  const [variations, setVariations] = useState<{size: string, color: string, stock: number}[]>([]);

const availableColors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Gray", "Navy", "Beige", "Brown"];
  
  // Form errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    //color: "",
    //stock: "",
    images: "",
    variations: "",
  });
  
  // Size options (for clothing)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40", "42"];

  const getProductById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };


  useEffect(() => {
    if (!id) return;
  
    const fetchProduct = async () => {
      const product = await getProductById(id);
  
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate("/admin/products");
        return;
      }
  
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setOriginalPrice(product.originalPrice?.toString() || "");
      setCategory(product.category);
      setSizes(product.sizes);
      setColor(product.color);
      //setStock(product.stock.toString());
      setIsNew(product.isNew || false);
      setIsFeatured(product.isFeatured || false);
      setImages(product.images);
      setVariations(product.variations);
    };
  
    fetchProduct();
  }, [id, navigate, toast]);
  
  
  
  // Load product data
  // useEffect(() => {
  //   if (!id) return;
    
  //   const product = getProductById(id);
    
  //   if (!product) {
  //     toast({
  //       title: "Error",
  //       description: "Product not found",
  //       variant: "destructive",
  //     });
  //     navigate("/admin/products");
  //     return;
  //   }
    
  //   setName(product.name);
  //   setDescription(product.description);
  //   setPrice(product.price.toString());
  //   setOriginalPrice(product.originalPrice?.toString() || "");
  //   setCategory(product.category);
  //   setSizes(product.sizes);
  //   setColor(product.color);
  //   setStock(product.stock.toString());
  //   setIsNew(product.isNew || false);
  //   setIsFeatured(product.isFeatured || false);
  //   setImages(product.images);
    
  // }, [id, navigate, toast]);
  
  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };
  

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      const url = await uploadImage(file);
      if (url) setImageUrls(url);
    };

  const handleAddImage = () => {
    if (imageUrls.trim()) {
      setImages([...images, imageUrls.trim()]);
      setImageUrls("");
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariation = (variation: {size: string, color: string, stock: number}) => {
    if (!id) return;
    addVariation(id, variation);
    setVariations([...variations, variation]);
  };
  
  const handleUpdateVariation = (variation: {size: string, color: string, stock: number}) => {
    if (!id) return;
    updateVariation(id, variation);
    setVariations(variations.map(v => 
      (v.size === variation.size && v.color === variation.color) ? variation : v
    ));
  };
  
  const handleRemoveVariation = (size: string, color: string) => {
    if (!id) return;
    removeVariation(id, size, color);
    setVariations(variations.filter(v => !(v.size === size && v.color === color)));
  };


  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      description: "",
      price: "",
      category: "",
     // color: "",
      //stock: "",
      images: "",
      variations: "",
    };
    
    if (!name.trim()) {
      newErrors.name = "Product name is required";
      valid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = "Product description is required";
      valid = false;
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
      valid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
      valid = false;
    }
    
    if (originalPrice.trim() && (isNaN(Number(originalPrice)) || Number(originalPrice) <= 0)) {
      newErrors.price = "Original price must be a valid positive number";
      valid = false;
    }
    
    if (!category) {
      newErrors.category = "Category is required";
      valid = false;
    }
    
    // if (!color.trim()) {
    //   newErrors.color = "Color is required";
    //   valid = false;
    // }
    
    // if (!stock.trim()) {
    //   newErrors.stock = "Stock is required";
    //   valid = false;
    // } else if (isNaN(Number(stock)) || Number(stock) < 0) {
    //   newErrors.stock = "Stock must be a valid non-negative number";
    //   valid = false;
    // }
    
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
      valid = false;
    }

    if (variations.length === 0) {
      newErrors.variations = "At least one variation with stock is required";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!validateForm() || !id) return;
    
  //   setIsSubmitting(true);
    
  //   try {
  //     const updatedProduct = {
  //       name,
  //       description,
  //       price: Number(price),
  //       originalPrice: originalPrice ? Number(originalPrice) : undefined,
  //       category,
  //       sizes,
  //       color,
  //       stock: Number(stock),
  //       isNew,
  //       isFeatured,
  //       images,
  //     };
      
  //     updateProduct(id, updatedProduct);
      
  //     toast({
  //       title: "Product updated",
  //       description: `${name} has been updated successfully`,
  //     });
      
  //     navigate("/admin/products");
  //   } catch (error) {
  //     console.error("Error updating product:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to update product. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          category,
          sizes,
          //color,
         // stock: Number(stock),
          isNew,
          isFeatured,
          images,
          variations,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to update product");
      }
  
      toast({
        title: "Product updated",
        description: `${name} has been updated successfully`,
      });
  
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => navigate("/admin/products")} 
              className="flex items-center text-charcoal hover:text-mutedTeal transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back</span>
            </button>
            <h1 className="heading-lg">Edit Product</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-champagne/20 p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name*
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`input-field w-full ${errors.name ? "border-red-300 focus:ring-red-200" : ""}`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className={`input-field w-full ${errors.description ? "border-red-300 focus:ring-red-200" : ""}`}
                    ></textarea>
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          id="price"
                          type="text"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className={`input-field pl-7 w-full ${errors.price ? "border-red-300 focus:ring-red-200" : ""}`}
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                        <input
                          id="originalPrice"
                          type="text"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          className="input-field pl-7 w-full"
                          placeholder="For sale items"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category*
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`input-field w-full ${errors.category ? "border-red-300 focus:ring-red-200" : ""}`}
                      >
                        <option value="">Select Category</option>
                        {categories.filter(cat => cat !== "all").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>
                    
                    {/* <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock*
                      </label>
                      <input
                        id="stock"
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className={`input-field w-full ${errors.stock ? "border-red-300 focus:ring-red-200" : ""}`}
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                      )}
                    </div>*/}
                  </div> 
                  
                  {/* <div className="mb-6">
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                      Color*
                    </label>
                    <input
                      id="color"
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className={`input-field w-full ${errors.color ? "border-red-300 focus:ring-red-200" : ""}`}
                      placeholder="e.g. Navy Blue, Crimson, etc."
                    />
                    {errors.color && (
                      <p className="mt-1 text-sm text-red-600">{errors.color}</p>
                    )}
                  </div> */}

                  <div className="mb-6">
                  
                    <VariationManager 
                      variations={variations}
                      availableColors={availableColors}
                      availableSizes={sizes}
                      onAdd={handleAddVariation}
                      onUpdate={handleUpdateVariation}
                      onRemove={handleRemoveVariation}
                    />
                    {errors.variations && (
                      <p className="mt-1 text-sm text-red-600">{errors.variations}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Total Stock: {variations.reduce((sum, v) => sum + v.stock, 0)} units</p>
                    </div>
                  </div>

                </div>
                
                {/* Right Column */}
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Images*
                    </label>
                    
                    <div className="mb-3">
                      <div className="flex">
                        {/* <input
                          type="text"
                          value={imageUrls}
                          onChange={(e) => setImageUrls(e.target.value)}
                          placeholder="Enter image URL"
                          className="input-field flex-1 rounded-r-none"
                        /> */}

                        <input
                          type="file"
                          accept="image/*" 
                          onChange={handleFileChange}
                          placeholder="Enter image URL"
                          className="input-field flex-1 rounded-r-none"
                        />

                        <button
                          type="button"
                          onClick={handleAddImage}
                          disabled={uploading} 
                          className="bg-mutedTeal text-white px-4 py-2 rounded-r-md hover:bg-mutedTeal/90 transition-colors"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Add URLs to product images. First image will be the main product image.
                      </p>
                    </div>
                    
                    {errors.images && (
                      <p className="mt-1 text-sm text-red-600 mb-2">{errors.images}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden h-24 border border-gray-200">
                          <img 
                            src={image} 
                            alt={`Product ${index + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="text-white p-1 rounded-full bg-red-500/80 hover:bg-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-0 left-0 bg-mutedTeal text-white text-xs px-2 py-1">
                              Main
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {images.length === 0 && (
                        <div className="border border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center bg-gray-50">
                          <div className="text-center text-gray-500">
                            <Upload size={20} className="mx-auto mb-1" />
                            <span className="text-xs">No images added</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${
                            sizes.includes(size)
                              ? "bg-mutedTeal text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {sizes.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Select all available sizes for this product
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <input
                        id="isNew"
                        type="checkbox"
                        checked={isNew}
                        onChange={(e) => setIsNew(e.target.checked)}
                        className="h-4 w-4 text-mutedTeal focus:ring-mutedTeal border-gray-300 rounded"
                      />
                      <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
                        Mark as New Arrival
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="isFeatured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 text-mutedTeal focus:ring-mutedTeal border-gray-300 rounded"
                      />
                      <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                        Feature on Homepage
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="btn-outline mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center justify-center min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditProduct;
