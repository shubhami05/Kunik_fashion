
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-warmSand/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-light text-charcoal mb-4 inline-block">
              <span className="font-medium">ELEG</span>ANT
            </Link>
            <p className="text-gray-600 mb-6">
              Premium clothing that combines elegance with modern aesthetics. Designed for comfort and style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-charcoal hover:text-mutedTeal transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-charcoal hover:text-mutedTeal transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-charcoal hover:text-mutedTeal transition-colors duration-300">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-mutedTeal transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ELEGANT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
