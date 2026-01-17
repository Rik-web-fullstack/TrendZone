// ProductPage.jsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { Heart, ShoppingCart } from "lucide-react";
import Navbar from "./Navbar";

const ProductPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const formatForBackend = (str = "") =>
    str.replace(/-/g, " ").toLowerCase().trim();

  const toTitleCase = (str = "") =>
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const formattedCategory = formatForBackend(category);
        const formattedSubCategory = subcategory
          ? formatForBackend(subcategory)
          : "";

        let response;

        if (formattedCategory === "all") {
          response = await api.get("/api/products");
        } else {
          response = await api.get("/api/products", {
            params: {
              category: formattedCategory,
              subcategory: formattedSubCategory,
            },
          });
        }

        // ✅ FIXED HERE
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to cart 🛒");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      alert("🛒 Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart");
    }
  };

  /* ---------------- ADD TO WISHLIST ---------------- */
  const handleAddToWishlist = async (productId) => {
    if (!userId) {
      alert("Please log in to save items ❤️");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/wishlist/add", {
        userId,
        productId,
      });
      alert("❤️ Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist failed:", err);
      alert("Failed to add to wishlist");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3] text-lg font-semibold text-gray-500">
          Loading curated designs...
        </div>
      </>
    );

  /* ---------------- EMPTY ---------------- */
  if (products.length === 0)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3] text-lg font-semibold text-gray-500">
          No designs found in this collection.
        </div>
      </>
    );

  /* ---------------- MAIN ---------------- */
  return (
    <div className="min-h-screen bg-[#f9f7f3]">
      <Navbar />

      <section className="px-6 md:px-16 py-24">
        {/* Header */}
        <div className="text-center mb-16 mt-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-3">
            {toTitleCase(subcategory || category)}
          </h2>
          <div className="w-20 h-1 mx-auto bg-[#5c5346] rounded-full mb-4"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl border overflow-hidden group flex flex-col"
            >
              {/* Image */}
              <div
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
  src={
    product?.Prod_img?.length
      ? typeof product.Prod_img[0] === "string"
        ? product.Prod_img[0]          // old products
        : product.Prod_img[0]?.url     // new products
      : "/placeholder.png"
  }
  alt={product.name}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
/>


              </div>

              {/* Floating Icons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(product._id);
                  }}
                  className="bg-white/90 p-2 rounded-full shadow hover:bg-pink-100"
                >
                  <Heart className="w-5 h-5 text-[#5c5346] hover:text-pink-500" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                  className="bg-white/90 p-2 rounded-full shadow hover:bg-[#e8e3da]/80"
                >
                  <ShoppingCart className="w-5 h-5 text-[#5c5346]" />
                </button>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                  <p className="mt-2 font-semibold text-[#5c5346]">
                    ₹ {product.price}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="mt-4 w-full text-sm font-semibold text-[#5c5346] border border-[#5c5346] py-2 rounded-lg hover:bg-[#5c5346] hover:text-white transition"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
