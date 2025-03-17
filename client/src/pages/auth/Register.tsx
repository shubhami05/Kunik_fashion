import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Mail, User, Lock, ShieldAlert, ArrowLeft } from "lucide-react";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminNotice, setAdminNotice] = useState(false);

  const { register, authLoading } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    if (!name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      newErrors.password = "Password must include at least one special character";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // if (isAdmin && mobile !== "1234567890") {
      //   setAdminNotice(true);
      // }

      const success = await register(name, mobile, password, isAdmin);

      if (success) {
        if (!isAdmin || mobile === "1234567890") {
          navigate("/");
        } else {
          setAdminNotice(true);
        }
      } else {
        setErrors({
          ...errors,
          general: "Failed to create account. Please try again.",
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
            {adminNotice ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm border border-champagne/20 p-8"
              >
                <div className="text-center mb-8">
                  <ShieldAlert className="w-16 h-16 text-mutedTeal mx-auto mb-4" />
                  <h1 className="heading-md mb-2">Admin Request Submitted</h1>
                  <p className="text-gray-600 mb-4">
                    Your admin account registration has been submitted for approval. The head admin will review your request.
                  </p>
                  <p className="text-gray-600 mb-6">
                    You can sign in once your account has been approved.
                  </p>
                  <Link to="/auth/login" className="btn-primary w-full block">
                    Return to Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-sm border border-champagne/20 p-8"
              >
                <div className="text-center mb-8">
                  <h1 className="heading-md mb-2">Create an Account</h1>
                  <p className="text-gray-600">
                    Join us to enjoy a personalized shopping experience
                  </p>
                </div>

                {errors.general && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className={`input-field pl-10 ${errors.name ? "border-red-300 focus:ring-red-200" : ""}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
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

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className={`input-field pl-10 ${errors.password ? "border-red-300 focus:ring-red-200" : ""}`}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters and include at least one special character.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className={`input-field pl-10 ${errors.confirmPassword ? "border-red-300 focus:ring-red-200" : ""}`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className="rounded border-gray-300 text-mutedTeal focus:ring-mutedTeal"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Register as an admin
                        {isAdmin && mobile !== "1234567890" && (
                          <span className="ml-1 text-amber-600 text-xs">
                            (requires approval by head admin)
                          </span>
                        )}
                      </span>
                    </label>
                  </div> */}

                  <button
                    type="submit"
                    disabled={isSubmitting || authLoading}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting || authLoading ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Already have an account?</span>{" "}
                  <Link to="/auth/login" className="text-mutedTeal hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default Register;
