import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/ui/ProductList";
import ProductFilter from "@/components/ui/ProductFilter";
import AnimatedSection from "@/components/ui/AnimatedSection";
import HeroSlider from "@/components/ui/HeroSlider";

const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

import { HeroImage } from "@/lib/data";
import ProductFeatured from "@/components/ui/ProductFeatured";
import {  LucideLoaderPinwheel } from "lucide-react";

const Index: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [isLoading,setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/hero`);
        if (!response.ok) throw new Error("Failed to fetch hero images");

        const data = await response.json();
        console.log("Fetched hero images:", data);

        if (!Array.isArray(data)) throw new Error("Invalid data format");

        setHeroImages(data.map(img => ({
          url: img.url || "",
          title: img.title || "No title",
          subtitle: img.subtitle || "No subtitle",
          id: img._id || ""
        })));
      }
      catch (error) {
        console.error("Error fetching hero images:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen min-w-screen flex items-center justify-center">
      <LucideLoaderPinwheel className="h-10 w-10 animate-spin text-cyan-800" />
      
    </div>;
  }
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section id="hero">
        <HeroSlider images={heroImages} />
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="bg-warmSand/10">
        <AnimatedSection>
          <ProductFeatured />
        </AnimatedSection>
      </section>

      {/* All Products Section */}
      <section id="products" className="py-16">
        <AnimatedSection className="container mx-auto px-4 mb-8">
          <h2 className="heading-lg text-center mb-8">Our Collection</h2>
        </AnimatedSection>
        <ProductFilter />
        <ProductList title="" />
      </section>

      <Footer />
    </div>
  );
};

export default Index;
