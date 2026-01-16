// Wishlist.jsx

"use client";

import React, { useEffect, useState } from "react";
import api from "../api/api"; // ✅ centralized api
import { Trash2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
      const res = await api.get(`/api/wishlist/${id}`);
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete("/api/wishlist/remove", {
        data: { userId, productId },
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Remove wishlist item failed:", err);
    }
  };

  const moveToCart = async (productId) => {
    try {
      await api.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      await removeFromWishlist(productId);
      alert("🛒 Moved to cart!");
    } catch (err) {
      alert("Failed to move item to cart.");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3] text-gray-600 animate-pulse">
          Loading your wishlist 💖...
        </div>
      </>
    );

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!isLoggedIn)
    return (
      <>
        <Navbar />
        <section className="min-h-screen flex flex-col justify-center items-center text-center bg-[#f9f7f3]">
          <Heart size={60} className="mb-6 text-[#5c5346]" />
          <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-6">
            You need to log in to view your wishlist.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-full bg-[#5c5346] text-white font-semibold hover:bg-black transition"
          >
            Go to Login
          </button>
        </section>
      </>
    );

  /* ---------------- MAIN ---------------- */
  return (
    <div className="bg-[#f9f7f3] min-h-screen">
      <Navbar />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {wishlist.length === 0 ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-3">
                YOUR WISHLIST IS EMPTY
              </h2>

              <p className="text-gray-500 max-w-md mb-8">
                Add items that you like to your wishlist. Review them anytime and
                easily move them to the bag.
              </p>

              <Heart
                size={70}
                className="text-[#5c5346] mb-8 opacity-80"
              />

              <button
                onClick={() => navigate("/category/all")}
                className="px-10 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-md
                           hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-center mt-20">
              <AnimatePresence>
                {wishlist.map((product) => (
                  <motion.div
                    key={product._id}
                    className="bg-[#fdfbf7] border border-[#e8e3da] rounded-3xl p-5 shadow-md hover:shadow-xl transition w-[19rem]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.03 }}
                    exit={{ opacity: 0 }}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${product.Prod_img?.[0]}`}
                      alt={product.name}
                      className="h-56 w-full object-cover rounded-2xl"
                    />

                    <div className="mt-4 space-y-2">
                      <h3 className="text-lg font-semibold">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="font-bold text-[#5c5346]">
                        ₹{product.price}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                      <button
                        onClick={() => moveToCart(product._id)}
                        className="px-4 py-2 rounded-full text-xs bg-[#e8e3da] hover:bg-[#5c5346] hover:text-white transition"
                      >
                        Move to Cart
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
