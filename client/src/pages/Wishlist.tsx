
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-28">
          <AnimatedSection>
            <div className="text-center py-16">
              <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-medium text-charcoal mb-2">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything to your wishlist yet.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-5 py-2.5 rounded bg-mutedTeal text-white hover:bg-mutedTeal/90 transition-colors"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </AnimatedSection>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-28">
        <AnimatedSection>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-medium text-charcoal">Your Wishlist</h1>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-sm text-dustyRose hover:text-red-500 transition-colors"
              >
                Clear Wishlist
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-64 w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 text-dustyRose hover:bg-dustyRose hover:text-white transition-colors shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-2 text-xs text-mutedTeal font-medium uppercase tracking-wider">
                    {product.category}
                  </div>
                  
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-medium text-charcoal mb-1 transition-colors duration-200 group-hover:text-mutedTeal">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {product.originalPrice ? (
                          <>
                            <span className="text-dustyRose font-medium">
                              Rs.{product.price.toFixed(2)}
                            </span>
                            <span className="ml-2 text-sm text-gray-400 line-through">
                              Rs.{product.originalPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-charcoal">
                            Rs.{product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* <button
                      onClick={() => addToCart(product, 1)}
                      disabled={product.stock <= 0}
                      className={`w-full py-2 flex items-center justify-center rounded ${
                        product.stock > 0
                          ? "bg-mutedTeal text-white hover:bg-mutedTeal/90"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      } transition-colors`}
                    >
                      <ShoppingCart size={16} className="mr-2" />
                      {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button> */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center px-5 py-2.5 rounded border border-mutedTeal text-mutedTeal hover:bg-mutedTeal hover:text-white transition-colors"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
