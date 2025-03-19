
import React from "react";
import { Link } from "react-router-dom";
import { Plus, Package, ShoppingCart, Image, Shield, UserCheck, Folder, FolderEdit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const QuickActions: React.FC = () => {
  const { isAdmin, isPendingApproval } = useAuth();
  
  return (
    <div className="mb-10">
      <h2 className="heading-sm mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/admin/products/add" 
          className="bg-white p-4 rounded-lg shadow-sm border border-champagne/20 hover:shadow-md transition-shadow flex items-center"
        >
          <div className="p-2 rounded-full bg-mutedTeal/10 mr-3">
            <Plus size={18} className="text-mutedTeal" />
          </div>
          <span>Add New Product</span>
        </Link>
        
        <Link 
          to="/admin/products" 
          className="bg-white p-4 rounded-lg shadow-sm border border-champagne/20 hover:shadow-md transition-shadow flex items-center"
        >
          <div className="p-2 rounded-full bg-champagne/10 mr-3">
            <Package size={18} className="text-champagne" />
          </div>
          <span>Manage Products</span>
        </Link>
        
        
        <Link 
          to="/admin/hero-images" 
          className="bg-white p-4 rounded-lg shadow-sm border border-champagne/20 hover:shadow-md transition-shadow flex items-center"
        >
          <div className="p-2 rounded-full bg-deep-plum/10 mr-3">
            <Image size={18} className="text-deep-plum" />
          </div>
          <span>Manage Hero Images</span>
        </Link>
        <Link 
          to="/admin/categories" 
          className="bg-white p-4 rounded-lg shadow-sm border border-champagne/20 hover:shadow-md transition-shadow flex items-center"
        >
          <div className="p-2 rounded-full bg-deep-plum/10 mr-3">
           <FolderEdit size={18} className="text-amber-600" />
          </div>
          <span>Manage Categories</span>
        </Link>
        
        {/* {isAdmin && (
          <Link 
            to="/admin/approvals" 
            className="bg-white p-4 rounded-lg shadow-sm border border-champagne/20 hover:shadow-md transition-shadow flex items-center relative"
          >
            <div className="p-2 rounded-full bg-amber-100 mr-3">
              <UserCheck size={18} className="text-amber-600" />
            </div>
            <span>Manage Admin Approvals</span>
            
            {isPendingApproval && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {isPendingApproval}
              </div>
            )}
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default QuickActions;
