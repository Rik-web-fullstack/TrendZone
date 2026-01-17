// NewArrivals.jsx

"use client";

import React, { useEffect, useState } from "react";
import api from "../api/api"; // ✅ centralized api
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  // 🟢 Fetch ONLY 6 new arrival products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/new-arrivals");
        setProducts((res.data || []).slice(0, 6));
      } catch (err) {
        console.error("❌ Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Add to Cart
  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Please log in to add items to your cart 🧑‍💻");
      return;
    }

    try {
      await api.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      alert("🛒 Product added to cart successfully!");
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      alert("Failed to add to cart.");
    }
  };

  // 💖 Add to Wishlist
  const handleAddToWishlist = async (productId) => {
    if (!userId) {
      alert("Please log in to save items ❤️");
      return;
    }

    try {
      const res = await api.post("/api/wishlist/add", {
        userId,
        productId,
      });
      alert(res.data.message || "❤️ Added to wishlist!");
    } catch (err) {
      console.error("❌ Wishlist error:", err);
      alert("Failed to add to wishlist.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading New Arrivals...
      </div>
    );

  return (
    <section className="py-24 bg-gradient-to-b from-beige/30 via-white to-beige/10">
      {/* Section Heading */}
      <div className="text-center mb-16 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold tracking-[0.15em] uppercase"
        >
          <span className="bg-gradient-to-r from-beige via-black to-beige bg-clip-text text-transparent">
            New
          </span>{" "}
          <span className="italic font-[Playfair_Display] text-black">
            Arrivals
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-4 text-black/70 text-sm md:text-lg font-light"
        >
          Discover our latest pieces — curated for every space.
        </motion.p>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "100px", opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="h-[2px] bg-beige mx-auto mt-4 rounded-full"
        />
      </div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6"
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            whileHover={{ scale: 1.03 }}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
          >
            {/* Image */}
            <img
  src={product.Prod_img?.[0]}
  alt={product.name}
  className="w-full h-64 object-cover rounded-t-2xl"
/>


            {/* Info */}
            <div className="p-4 space-y-2">
              <h4 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
              <p className="text-black font-semibold">
                ₹ {product.price.toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center px-4 pb-4">
              <button
                onClick={() => handleAddToCart(product._id)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-beige hover:bg-beige hover:text-black transition"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>

              <button
                onClick={() => handleAddToWishlist(product._id)}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 hover:bg-pink-100 transition"
              >
                <Heart
                  size={18}
                  className="text-gray-600 hover:text-pink-500"
                />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default NewArrivals;
