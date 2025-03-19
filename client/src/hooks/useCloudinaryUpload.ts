import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CloudinaryResponse {
  secure_url: string;
  error?: {
    message: string;
  };
}

interface CloudinaryDeleteResponse {
  result: 'ok' | 'error';
  error?: {
    message: string;
  };
}

const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) {
      setError("No file selected");
      toast({
        title: "Upload Error",
        description: "No file selected",
        variant: "destructive",
      });
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Invalid file type. Please upload an image");
      toast({
        title: "Upload Error",
        description: "Invalid file type. Please upload an image",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setError("File size too large. Maximum size is 5MB");
      toast({
        title: "Upload Error",
        description: "File size too large. Maximum size is 5MB",
        variant: "destructive",
      });
      return null;
    }

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError("Missing Cloudinary configuration");
      toast({
        title: "Configuration Error",
        description: "Missing Cloudinary configuration",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data: CloudinaryResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Image upload failed");
      }

      if (!data.secure_url) {
        throw new Error("No URL received from Cloudinary");
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      return data.secure_url;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload image";
      setError(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getPublicIdFromUrl = (url: string): string | null => {
    try {
      // Extract the path between 'upload/' and last '/'
      const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
      if (!matches || !matches[1]) return null;
      return matches[1];
    } catch {
      return null;
    }
  };

  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      console.error("Missing Cloudinary configuration");
      setError("Missing Cloudinary configuration");
      toast({
        title: "Configuration Error",
        description: "Missing Cloudinary configuration",
        variant: "destructive",
      });
      return false;
    }

    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) {
      console.error("Could not extract public ID from URL:", imageUrl);
      setError("Invalid image URL");
      toast({
        title: "Delete Error",
        description: "Invalid image URL format",
        variant: "destructive",
      });
      return false;
    }

    try {
      const timestamp = Math.round((new Date()).getTime() / 1000);
      const signature = await generateSignature(publicId, timestamp, API_SECRET);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('signature', signature);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp.toString());

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
        method: 'POST',
        body: formData,
      });

      const data: CloudinaryDeleteResponse = await response.json();

      if (!response.ok || data.result !== 'ok') {
        console.error("Cloudinary delete response:", data);
        throw new Error(data.error?.message || 'Failed to delete image');
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      return true;
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMessage = err.message || "Failed to delete image";
      setError(errorMessage);
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  const generateSignature = async (publicId: string, timestamp: number, apiSecret: string): Promise<string> => {
    const str = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    // Generate SHA-1 hash
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  };

  const resetError = () => setError(null);

  return { uploadImage, deleteImage, uploading, error, resetError };
};

export default useCloudinaryUpload;
