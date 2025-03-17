
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Lock, User, Loader2, ArrowLeft } from "lucide-react";

const Login: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState({
    mobile: "",
    password: "",
    general: "",
  });
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      mobile: "",
      password: "",
      general: "",
    };
    
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
      valid = false;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
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
      const success = await login(mobile, password);
      
      if (success) {
        navigate("/");
      } else {
        setErrors({
          ...errors,
          general: "Invalid mobile number or password",
        });
      }
    } catch (error) {
      setErrors({
        ...errors,
        general: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative">
    {/* Back to Home Button in Upper Left */}
    <Link
      to="/"
      className="absolute top-6 left-6 inline-flex items-center text-mutedTeal hover:underline font-medium"
    >
      <ArrowLeft size={18} className="mr-2" />
      Back to Home
    </Link>
      
       {/* <Navbar /> */}

      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-champagne/20 p-8"
            >
              <div className="text-center mb-8">
                <h1 className="heading-md mb-2">Welcome Back</h1>
                <p className="text-gray-600">
                  Sign in to your account to continue
                </p>
              </div>
              
              {errors.general && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {errors.general}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      className={`input-field pl-10 ${errors.mobile ? "border-red-300 focus:ring-red-200" : ""}`}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                  )}
                </div>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/auth/forgot-password" className="text-sm text-mutedTeal hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`input-field pl-10 ${errors.password ? "border-red-300 focus:ring-red-200" : ""}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || authLoading}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting || authLoading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Don't have an account?</span>{" "}
                <Link to="/auth/register" className="text-mutedTeal hover:underline font-medium">
                  Create an account
                </Link>
              </div>
              
              <div className="mt-6 flex items-center justify-center">
                {/* <Link to="/auth/admin-login" className="text-sm text-gray-500 hover:text-mutedTeal">
                  Admin Login
                </Link> */}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
