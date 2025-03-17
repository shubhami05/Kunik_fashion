
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, ChevronLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimatedSection from "@/components/ui/AnimatedSection";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-28">
          <AnimatedSection>
            <div className="text-center py-16">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-medium text-charcoal mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything to your cart yet.
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
          <h1 className="text-3xl font-medium mb-8 text-charcoal">Your Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-charcoal">Cart Items ({cart.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-dustyRose hover:text-red-500 flex items-center transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" /> Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size || 'default'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 flex flex-col sm:flex-row items-start gap-6"
                    >
                      <Link to={`/product/${item.product.id}`} className="sm:w-24 w-full">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-32 sm:h-24 object-cover rounded"
                        />
                      </Link>
                      
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-medium text-charcoal hover:text-mutedTeal transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        
                        {item.size && (
                          <p className="text-sm text-gray-500 mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="p-1.5 text-gray-600 hover:text-charcoal transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              className="p-1.5 text-gray-600 hover:text-charcoal transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-sm text-gray-500 hover:text-dustyRose transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right sm:text-left font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </motion.div>
                  ))}
                </div>
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
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-medium text-charcoal mb-6">Order Summary</h2>
                
                <div className="space-y-4 border-b border-gray-100 pb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between py-6">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-lg font-medium">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <button className="w-full py-3 bg-dustyRose text-white rounded-md hover:bg-dustyRose/90 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
