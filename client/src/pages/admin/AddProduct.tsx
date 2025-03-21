import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, X, Plus, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useProducts } from "@/context/ProductContext";
import { Category, getCategories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";

import VariationManager from "@/components/admin/VariationManager";
import { ProductVariation } from "@/lib/data";


const AddProduct: React.FC = () => {

  // const BASE_URL = 'http://localhost:5000'

  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

  const { uploadImage, uploading, error } = useCloudinaryUpload();

  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string>("");

  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const [colors, setColors] = useState<string[]>([]);
  const [mainColor, setMainColor] = useState("");
  
  // Form errors
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    //color: "",
   // stock: "",
    images: "",
    
  });

  // Add state for categories
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // Add useEffect to fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        // Only show active categories
        const activeCategories = data.filter((cat: Category) => cat.isActive);
        setAvailableCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      }
    };

    fetchCategories();
  }, []);
  
  // Size options (for clothing)
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40", "42"];
  
  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleAddColor = () => {
    if (mainColor && !colors.includes(mainColor)) {
      setColors([...colors, mainColor]);
    }
  };


  const handleRemoveColor = (color: string) => {
    setColors(colors.filter(c => c !== color));
    // Also remove variations with this color
    setVariations(variations.filter(v => v.color !== color));
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
  

  const handleAddVariation = (variation: ProductVariation) => {
    // Check if this combination already exists
    const exists = variations.some(
      v => v.size === variation.size && v.color === variation.color
    );
    
    if (!exists) {
      setVariations([...variations, variation]);
    } else {
      toast({
        title: "Variation exists",
        description: `A variation with size ${variation.size} and color ${variation.color} already exists`,
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateVariation = (variation: ProductVariation) => {
    setVariations(variations.map(v => 
      (v.size === variation.size && v.color === variation.color) ? variation : v
    ));
  };
  
  const handleRemoveVariation = (size: string, color: string) => {
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
     color: mainColor,
     variations,
     // stock: "",
      images: "",
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
    
   
    
    if (images.length === 0) {
      newErrors.images = "At least one image is required";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Format the product data to match server expectations
      const newProduct = {
        name: name.trim(),
        description: description.trim(),
        price: Number(parseFloat(price).toFixed(2)),
        originalPrice: originalPrice ? Number(parseFloat(originalPrice).toFixed(2)) : undefined,
        category: category[0], // Send single category string instead of array
        images: images,
        isNew,
        isFeatured,
        variations: variations.map(v => ({
          size: v.size,
          color: v.color,
          stock: Number(v.stock)
        }))
      };

      console.log('Sending product data:', newProduct); // Debug log

      const response = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      toast({ 
        title: "Success!", 
        description: `${name} has been added successfully.` 
      });
      navigate("/admin/products");
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to add product. Please try again.", 
        variant: "destructive" 
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
            <h1 className="heading-lg">Add New Product</h1>
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
                          <span className="text-gray-500">Rs.</span>
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
                          <span className="text-gray-500">Rs.</span>
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
                        onChange={(e) => setCategory([e.target.value])}
                        className={`input-field w-full ${errors.category ? "border-red-300 focus:ring-red-200" : ""}`}
                      >
                        <option value="">Select Category</option>
                        {availableCategories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
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
                        <div className="relative flex-1">
                          <input
                            type="file"
                            accept="image/*" 
                            onChange={handleFileChange}
                            placeholder="Enter image URL"
                            className="input-field rounded-r-none"
                            disabled={uploading}
                          />
                          {uploading && (
                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                              <Loader2 size={20} className="animate-spin text-mutedTeal" />
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleAddImage}
                          disabled={uploading || !imageUrls} 
                          className={`bg-mutedTeal text-white px-4 py-2 rounded-r-md transition-colors flex items-center justify-center w-12
                            ${uploading || !imageUrls ? 'opacity-50 cursor-not-allowed' : 'hover:bg-mutedTeal/90'}`}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {uploading ? 'Uploading image...' : 'Select an image to upload. First image will be the main product image.'}
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

                    {/* color add */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Colors
                    </label>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        value={mainColor}
                        onChange={(e) => setMainColor(e.target.value)}
                        placeholder="Add a color"
                        className="input-field flex-1 rounded-r-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="bg-mutedTeal text-white px-4 py-2 rounded-r-md hover:bg-mutedTeal/90 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {colors.map(color => (
                        <div key={color} className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                          <span className="text-sm">{color}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(color)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>    
                  {/* color add */}
                  
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


               {/* Stock Variations */}
               <div className="mt-6 mb-6">
                <VariationManager
                  variations={variations}
                  availableColors={colors.length > 0 ? colors : [mainColor].filter(c => c)}
                  availableSizes={sizes}
                  onAdd={handleAddVariation}
                  onUpdate={handleUpdateVariation}
                  onRemove={handleRemoveVariation}
                />
                
                {/* {errors.variations && (
                  <p className="mt-1 text-sm text-red-600">{errors.variations}</p>
                )} */}
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
                    "Add Product"
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

export default AddProduct;
