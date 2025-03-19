
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {

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
      }, 500);
      return;
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  return (
    <footer className="bg-warmSand/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <img src="/logo.jpg" alt="Kunik Fashion" width={100} height={100} className="mb-5" />
            <Link to="/" className="text-2xl font-light text-charcoal mb-4 inline-block">
              <span className="font-extrabold">KUNIK</span>FASHION
            </Link>
            <p className="text-gray-600 mb-6">
              Premium clothing that combines elegance with modern aesthetics. Designed for comfort and style.
            </p>
            {/* <div className="flex space-x-4">
              <a href="#" className="text-charcoal hover:text-mutedTeal transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-charcoal hover:text-mutedTeal transition-colors duration-300">
                <Facebook size={20} />
              </a>

            </div> */}
          </div>

          {/* Quick Links */}
          <div className="col-span-1 flex-col items-end text-right">
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-600 hover:text-mutedTeal transition-colors duration-300"
                >
                  Home
                </button>
              </li>

              <li>
              <button
                  onClick={() => scrollToSection('featured')}
                  className="text-gray-600 hover:text-mutedTeal transition-colors duration-300"
                >
                  Featured
                </button>
              </li>
              <li>
              <button
                  onClick={() => scrollToSection('products')}
                  className="text-gray-600 hover:text-mutedTeal transition-colors duration-300"
                >
                  All products
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}


          {/* Customer Service */}

        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} KUNIK FASHION. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
