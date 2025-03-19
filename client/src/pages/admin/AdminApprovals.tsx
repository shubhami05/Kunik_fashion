
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, UserX, UserCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdminApprovals = () => {
  const {  isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);


  const handleApprove = async (userId: string) => {
    setLoading(true);
    setActiveRequest(userId);
    // await approveAdminRequest(userId);
    setLoading(false);
    setActiveRequest(null);
  };

  const handleReject = async (userId: string) => {
    setLoading(true);
    setActiveRequest(userId);
    // await rejectAdminRequest(userId);
    setLoading(false);
    setActiveRequest(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              Only the head admin can access this page.
            </p>
            <Link to="/admin/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Approvals</h1>
            <Link to="/admin/dashboard">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft size={18} className="mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Admin Requests</h2>

      
      </div>
    </div>
  );
};

export default AdminApprovals;
