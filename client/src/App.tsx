import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminAddProduct from "./pages/admin/AddProduct";
import AdminEditProduct from "./pages/admin/EditProduct";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HeroImages from "./pages/admin/HeroImages";
import CategoryManager from "@/components/admin/CategoryManager";// Ensure this file exists and the path is correct

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth/login" element={<Login />} />
                  <Route path="/auth/register" element={<Register />} />
                  {/* <Route path="/auth/admin-login" element={<AdminLogin />} /> */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products/add"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminAddProduct />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/products/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminEditProduct />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/hero-images"
                    element={
                      <ProtectedRoute requireAdmin>
                        <HeroImages />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/categories"
                    element={
                      <ProtectedRoute requireAdmin>
                        <CategoryManager />
                      </ProtectedRoute>
                    }
                  />
                  {/* <Route
                    path="/admin/approvals"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminApprovals />
                      </ProtectedRoute>
                    }
                  /> */}
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
