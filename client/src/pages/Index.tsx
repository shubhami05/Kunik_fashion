
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductList from "@/components/ui/ProductList";
import ProductFilter from "@/components/ui/ProductFilter";
import AnimatedSection from "@/components/ui/AnimatedSection";
import HeroSlider from "@/components/ui/HeroSlider";
// import { getHeroImages } from "@/lib/data";


//  const BASE_URL = 'http://localhost:5000'

const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;

// const MOBILE_NO = import.meta.env.VITE_MOBILE_NO;


import { HeroImage } from "@/lib/data";
import ProductFeatured from "@/components/ui/ProductFeatured";

const Index: React.FC = () => {
  // const heroImages = getHeroImages();
  const location = useLocation();

  // Scroll to top when navigating to the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  // const [heroImages, setHeroImages] = useState<HeroImage[]>([]);


  // useEffect(() => {
  //   const fetchHeroImages = async () => {
  //     try {
  //       const response = await fetch(`${BASE_URL}/api/hero`);
  //       if (!response.ok) throw new Error("Failed to fetch hero images");

  //       const data: HeroImage[] = await response.json();
  //       setHeroImages(data);  // Store objects, not just URLs
  //     } catch (error) {
  //       console.error("Error fetching hero images:", error);
  //     }
  //   };

  //   fetchHeroImages();
  // }, []);


  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/hero`);
        if (!response.ok) throw new Error("Failed to fetch hero images");

        const data = await response.json();
        console.log("Fetched hero images:", data); // 🔍 Debugging

        if (!Array.isArray(data)) throw new Error("Invalid data format");

        // Ensure each image has a `url`
        setHeroImages(data.map(img => ({
          url: img.url || "",
          title: img.title || "No title",
          subtitle: img.subtitle || "No subtitle",
          id: img._id || ""
        })));
      } catch (error) {
        console.error("Error fetching hero images:", error);
      }
    };

    fetchHeroImages();
  }, []);



  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section id="hero">
        <HeroSlider images={heroImages} />
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="bg-warmSand/10 py-20">
        <AnimatedSection>
          <ProductFeatured/>
          {/* <ProductList
            title="Featured Products"
            subtitle="Our most popular pieces, selected for their exceptional design and quality."
            limit={4}
          /> */}
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
