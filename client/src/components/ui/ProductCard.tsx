
import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10" />

        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {product.isNew && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-champagne/90 backdrop-blur-sm text-charcoal text-xs font-medium px-2.5 py-1 rounded-full">
              New Arrival
            </span>
          </div>
        )}

        {product.originalPrice && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-dustyRose/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Sale
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2 text-xs text-mutedTeal font-medium uppercase tracking-wider">
          {product.category}
        </div>

        <h3 className="text-lg font-medium text-charcoal mb-1 transition-colors duration-200 group-hover:text-mutedTeal">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            {product.originalPrice ? (
              <>
                <span className="text-dustyRose font-medium">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-medium text-charcoal">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {/* {product.stock > 0 ? (
              product.stock < 5 ? (
                <span className="text-dustyRose">Only {product.stock} left</span>
              ) : (
                <span>In stock</span>
              )
            ) : (
              <span className="text-red-500">Out of stock</span>
            )} */}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
  ${product.variations.reduce((total, variation) => total + variation.stock, 0) > 5
                  ? 'bg-green-100 text-green-800'
                  : product.variations.reduce((total, variation) => total + variation.stock, 0) > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'}`}
            >
              {product.variations.reduce((total, variation) => total + variation.stock, 0) > 0
                ? "In Stock"
                : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-mutedTeal to-dustyRose transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
    </motion.div>
  );
};

export default ProductCard;
