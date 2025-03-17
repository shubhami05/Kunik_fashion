import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollToTop } from '@/hooks/useScrollToTop';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useScrollToTop();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    
    // Check if we're not on the home page
    if (location.pathname !== '/') {
      // Navigate to home page first
      navigate('/');
      // Increase timeout to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); // Increased delay for mobile and scroll to top
      return;
    }
    
    // If we're already on home page, add a small delay for mobile menu to close
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false); // Close mobile menu
    navigate('/'); // Navigate to home page
    toast({
      title: "Logged out successfully",
      variant: "default",
    });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md py-3 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extralight text-charcoal">
            <span className="font-extrabold">KUSHIK</span>FASHION
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('featured')}
              className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
            >
              Featured
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
            >
              Collection
            </button>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/wishlist"
                  className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
                >
                  <Heart size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-charcoal hover:text-dustyRose transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/wishlist"
                  className="text-charcoal hover:text-mutedTeal transition-colors duration-300"
                >
                  <Heart size={20} />
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-charcoal hover:text-mutedTeal transition-colors duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="p-2 text-left text-charcoal hover:text-mutedTeal transition-colors duration-300"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('featured')}
                className="p-2 text-left text-charcoal hover:text-mutedTeal transition-colors duration-300"
              >
                Featured
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="p-2 text-left text-charcoal hover:text-mutedTeal transition-colors duration-300"
              >
                Collection
              </button>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  className="p-2 text-charcoal hover:text-mutedTeal transition-colors duration-300"
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/wishlist"
                    className="p-2 text-charcoal hover:text-mutedTeal transition-colors duration-300"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-left text-charcoal hover:text-dustyRose transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="p-2 text-charcoal hover:text-mutedTeal transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/wishlist"
                    className="p-2 text-charcoal hover:text-mutedTeal transition-colors duration-300"
                  >
                    Wishlist
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
