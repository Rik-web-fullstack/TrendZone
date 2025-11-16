"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const ACCENT = "#5c5346";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
      fetchWishlist(storedUserId);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/wishlist/${id}`, {
        withCredentials: true,
      });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      alert("Failed to fetch wishlist. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/wishlist/remove`, {
        data: { userId, productId },
        withCredentials: true,
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Remove wishlist item failed:", err);
    }
  };

  const moveToCart = async (productId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/cart/add`,
        { userId, productId, quantity: 1 },
        { withCredentials: true }
      );
      await removeFromWishlist(productId);
      alert("🛒 Moved to cart!");
    } catch (err) {
      console.error("Move to cart failed:", err);
      alert("Failed to move item to cart.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg animate-pulse">
        Loading your wishlist 💖...
      </div>
    );

  if (!isLoggedIn)
    return (
      <section className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#fdfaf5] to-[#f7f4ef]">
        <Heart size={60} className="mx-auto mb-6 text-[#5c5346]" />
        <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">
          Please Log In
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm">
          You need to log in to view your saved favorites.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-8 py-3 rounded-full bg-[#5c5346] text-white font-semibold hover:bg-[#1a1a1a] transition-all shadow-lg hover:shadow-[#5c5346]/30"
        >
          Go to Login
        </button>
      </section>
    );

  return (
    <section className="py-20 bg-gradient-to-b from-[#f9f7f3] via-white to-[#f9f7f3] relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,83,70,0.08),transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Modern title */}
        <motion.h2
          className="text-center font-extrabold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#5c5346] via-[#a58c6f] to-[#5c5346] text-5xl md:text-6xl drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your <span className="font-serif italic">Wishlist</span> 💖
        </motion.h2>

        {wishlist.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <Heart size={50} className="mx-auto mb-4 text-[#5c5346]" />
            <p>Your wishlist is empty. Start adding favorites!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-center">
            <AnimatePresence>
              {wishlist.map((product, index) => (
                <motion.div
                  key={index}
                  className="relative bg-white/80 backdrop-blur-md border border-[#e8e3da] rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 w-[19rem]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Product Image */}
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={`http://localhost:3000/uploads/${product.Prod_img?.[0]}`}
                    alt={product.name}
                    className="h-56 w-full object-cover rounded-2xl shadow-sm"
                  />

                  {/* Product Info */}
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-[#1a1a1a]">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-[#5c5346] font-bold text-base">
                      ₹{product.price}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between items-center mt-5">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#5c5346",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => moveToCart(product._id)}
                      className="px-4 py-2 rounded-full text-xs font-semibold bg-[#e8e3da] text-[#1a1a1a] hover:text-white transition-all"
                    >
                      Move to Cart
                    </motion.button>

                    <motion.button
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-2 rounded-full hover:bg-[#f8ecec] transition"
                    >
                      <Trash2
                        size={18}
                        className="text-[#b85c5c] hover:scale-110 transition-transform"
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
