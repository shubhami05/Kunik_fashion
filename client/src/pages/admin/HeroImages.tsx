


import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload"; // Import Cloudinary hook
import { Pencil, Trash, Plus, ArrowLeft, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";



const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

interface HeroImage {
  _id: string;
  url: string;
  title: string;
  subtitle: string;
}

const HeroImages = () => {
  const { toast } = useToast();
  const { uploadImage, uploading } = useCloudinaryUpload(); // Cloudinary upload hook
  const [images, setImages] = useState<HeroImage[]>([]);
  const [newImage, setNewImage] = useState({ url: "", title: "", subtitle: "" });
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch images from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/hero`)
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Error fetching hero images:", err));
  }, []);

  // Handle file upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file); // Upload image to Cloudinary
    if (url) {
      if (editingImage) {
        setEditingImage({ ...editingImage, url });
      } else {
        setNewImage({ ...newImage, url });
      }
    }
  };



  const handleAdd = async () => {
    if (!newImage.url || !newImage.title || !newImage.subtitle) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }
  
    try {
      const res = await axios.post(`${BASE_URL}/api/hero`, newImage);
  
      // Immediately update the state with the new image
      setImages((prevImages) => [...prevImages, res.data]);
  
      setNewImage({ url: "", title: "", subtitle: "" });
      setIsAddingNew(false);
  
      toast({ title: "Success", description: "Hero image added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add hero image", variant: "destructive" });
    }
  };
  

  // Handle deleting an image
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/hero/${id}`);
      setImages(images.filter((img) => img._id !== id));

      toast({
        title: "Success",
        description: "Hero image deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hero image",
        variant: "destructive",
      });
    }
  };

  // Handle updating an image
  const handleSaveEdit = async () => {
    if (!editingImage) return;

    try {
      await axios.put(`${BASE_URL}/api/hero/${editingImage._id}`, editingImage);
      setImages(images.map((img) => (img._id === editingImage._id ? editingImage : img)));
      setEditingImage(null);

      toast({
        title: "Success",
        description: "Hero image updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-semibold">Hero Images Manager</h1>
            </div>
            <Button
              onClick={() => {
                setIsAddingNew(true);
                setEditingImage(null);
              }}
              className="bg-mutedTeal hover:bg-mutedTeal/90"
              disabled={isAddingNew || editingImage !== null}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Image
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {(isAddingNew || editingImage) && (
          <Card className="p-6 mb-8 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-field flex-1 rounded-r-none"
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <Input
                    placeholder="Enter image URL"
                    value={editingImage ? editingImage.url : newImage.url}
                    onChange={(e) => {
                      editingImage
                        ? setEditingImage({ ...editingImage, url: e.target.value })
                        : setNewImage({ ...newImage, url: e.target.value });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <Input
                    placeholder="Enter title"
                    value={editingImage ? editingImage.title : newImage.title}
                    onChange={(e) => {
                      editingImage
                        ? setEditingImage({ ...editingImage, title: e.target.value })
                        : setNewImage({ ...newImage, title: e.target.value });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <Input
                    placeholder="Enter subtitle"
                    value={editingImage ? editingImage.subtitle : newImage.subtitle}
                    onChange={(e) => {
                      editingImage
                        ? setEditingImage({ ...editingImage, subtitle: e.target.value })
                        : setNewImage({ ...newImage, subtitle: e.target.value });
                    }}
                  />
                </div>

                <div className="flex justify-end mt-4">
                  {editingImage ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditingImage(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} disabled={uploading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleAdd} disabled={uploading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image._id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{image.title}</h3>
                <p className="text-gray-600">{image.subtitle}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingImage(image)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(image._id)}>
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImages;
