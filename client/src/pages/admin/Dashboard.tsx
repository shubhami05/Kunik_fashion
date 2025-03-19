
import React from "react";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import DashboardStats from "@/components/admin/DashboardStats";
import QuickActions from "@/components/admin/QuickActions";
import RecentProducts from "@/components/admin/RecentProducts";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  
  // Dashboard stats configuration
  const dashboardStats = [
    {
      title: "Total Products",
      value: products.length,
      icon: <Package className="text-mutedTeal" />,
      bgColor: "bg-mutedTeal/10",
      link: "/admin/products"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="heading-lg mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}. Here's what's happening in your store.
            </p>
          </div>
          
          {/* Dashboard Stats Component */}
          <DashboardStats stats={dashboardStats} />
          
          {/* Quick Actions Component */}
          <QuickActions />
          
          {/* Recent Products Component */}
          <RecentProducts products={products.map(product => ({
            ...product
          }))}/>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
