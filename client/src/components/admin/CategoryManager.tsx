import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';

// Add this interface after the existing imports
interface CategoryWithCount extends Category {
  productCount: number;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);
  const { toast } = useToast();
  const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch categories
      const catResponse = await fetch(`${BASE_URL}/api/categories`);
      if (!catResponse.ok) throw new Error('Failed to fetch categories');
      const categories = await catResponse.json();

      // Fetch products to count by category
      const prodResponse = await fetch(`${BASE_URL}/api/products`);
      if (!prodResponse.ok) throw new Error('Failed to fetch products');
      const products = await prodResponse.json();

      // Count products for each category
      const categoriesWithCount = categories.map((cat: Category) => ({
        ...cat,
        productCount: products.filter((prod: any) => prod.category === cat.name).length
      }));

      setCategories(categoriesWithCount);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add category');
      }

      setNewCategory('');
      fetchCategories();
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (category: CategoryWithCount) => {
    if (category.productCount > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `This category has ${category.productCount} active ${
          category.productCount === 1 ? 'product' : 'products'
        }. Remove or reassign ${
          category.productCount === 1 ? 'it' : 'them'
        } first.`,
        variant: "destructive",
      });
      return;
    }
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete category');
      }

      await fetchCategories();
      toast({
        title: "Success",
        description: `Category "${categoryToDelete.name}" deleted successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  // In your CategoryManager.tsx, update the toggleCategoryStatus function
  const toggleCategoryStatus = async (category: CategoryWithCount) => {
    setUpdatingCategory(category._id);
    try {
      const response = await fetch(`${BASE_URL}/api/categories/${category._id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update category status');
      }

      await fetchCategories();
      toast({
        title: "Success",
        description: `Category "${category.name}" is now ${!category.isActive ? 'active' : 'inactive'}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdatingCategory(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-mutedTeal" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Add Back to Dashboard button */}
      <div className="mb-6">
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center gap-2 text-sm text-mutedTeal hover:text-mutedTeal/80 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-2">Category Management</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage your product categories here
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-champagne/20 overflow-hidden">
          <div className="p-6 border-b border-champagne/20">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="flex-1 max-w-md"
              />
              <Button type="submit" className="bg-mutedTeal hover:bg-mutedTeal/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </form>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full font-bold ${
                      category.productCount > 0 
                        ? 'bg-yellow-100 text-black' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {category.productCount} 
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategoryStatus(category)}
                      className={`${
                        category.isActive 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                      disabled={updatingCategory === category._id}
                    >
                      {updatingCategory === category._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {category.isActive ? 'Deactivating...' : 'Activating...'}
                        </>
                      ) : (
                        category.isActive ? 'Deactivate' : 'Activate'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CategoryManager;