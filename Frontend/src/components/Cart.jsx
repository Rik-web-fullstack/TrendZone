"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const ACCENT = "#5c5346";

  // ✅ Check login + fetch cart items
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
      fetchCart(storedUserId);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, []);

  const fetchCart = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cart/${id}`);
      const validItems = (res.data.cart || []).filter(
        (item) => item && item.product
      );
      setCartItems(validItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to fetch cart.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(`http://localhost:3000/api/cart/update`, {
        userId,
        productId,
        quantity: newQty,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQty }
            : item
        )
      );
    } catch (err) {
      console.error("Update quantity failed:", err);
    }
  };

  // ✅ Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/remove`, {
        data: { userId, productId },
      });
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  // ✅ Calculate total price
  const total =
    cartItems
      ?.filter((item) => item?.product?.price)
      ?.reduce(
        (acc, item) => acc + Number(item.product.price) * item.quantity,
        0
      ) || 0;

  // ✅ Navigate to payment page with subtotal
  const handleCheckout = () => {
    if (total > 0) {
      navigate("/payment", { state: { total } });
    }
  };

  // 🌀 Loading state
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg animate-pulse">
        Loading your cart 🛍️...
      </div>
    );

  // 🔒 If not logged in
  if (!isLoggedIn)
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#fdfaf5] to-[#f7f4ef] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="p-10 bg-white rounded-2xl shadow-2xl border border-[#e4dfd6] max-w-md backdrop-blur-md"
        >
          <LogIn size={50} className="mx-auto mb-4 text-[#5c5346]" />
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view or manage your cart items.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 rounded-full bg-[#5c5346] text-white font-semibold hover:bg-[#1a1a1a] transition-all"
          >
            Go to Login
          </button>
        </motion.div>
      </section>
    );

  // 🛒 Main Cart UI
  return (
    <section className="py-20 bg-gradient-to-b from-[#f8f6f3] via-[#fdfcfb] to-[#f7f5f2] relative overflow-hidden">
      {/* Subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,83,70,0.07),transparent_70%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.h2
          className="text-center font-extrabold mb-12 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#5c5346] via-[#a58c6f] to-[#5c5346] text-5xl md:text-6xl drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your <span className="font-serif italic">Cart</span>
        </motion.h2>

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <ShoppingBag size={40} className="mx-auto mb-4 text-[#5c5346]" />
            <p>Your cart is empty. Start shopping!</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between backdrop-blur-md bg-white/70 border border-[#eae6df] p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <motion.img
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      src={`http://localhost:3000/uploads/${item.product.Prod_img?.[0]}`}
                      alt={item.product.name}
                      className="h-24 w-24 rounded-xl object-cover shadow-md"
                    />

                    <div className="flex-1 ml-6">
                      <h3 className="font-semibold text-[#1a1a1a] text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        ₹{item.product.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        className="p-2 rounded-full bg-[#f3f0ea] hover:bg-[#e8e3da] transition"
                      >
                        <Minus size={14} />
                      </motion.button>
                      <span className="px-3 font-medium text-[#1a1a1a]">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="p-2 rounded-full bg-[#f3f0ea] hover:bg-[#e8e3da] transition"
                      >
                        <Plus size={14} />
                      </motion.button>
                    </div>

                    {/* Remove Item */}
                    <motion.button
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      onClick={() => removeFromCart(item.product._id)}
                      className="ml-4 p-2 rounded-full hover:bg-[#f8ecec] transition"
                    >
                      <Trash2
                        size={18}
                        className="text-[#b85c5c] hover:scale-110 transition-transform"
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-[#e8e3da] shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-[#5c5346]/10 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-semibold text-[#1a1a1a] mb-6">
                Order Summary
              </h3>
              <div className="flex justify-between text-gray-600 mb-3">
                <p>Subtotal</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-gray-600 mb-3">
                <p>Shipping</p>
                <p className="text-green-700">Free</p>
              </div>
              <div className="border-t border-[#e0dbd1] my-4"></div>
              <div className="flex justify-between text-lg font-semibold text-[#1a1a1a]">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                whileHover={total > 0 ? { scale: 1.03 } : {}}
                whileTap={total > 0 ? { scale: 0.97 } : {}}
                disabled={total <= 0}
                className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition-all ${
                  total <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5c5346] hover:bg-[#1a1a1a]"
                }`}
              >
                {total <= 0 ? "Cart is Empty" : "Proceed to Checkout"}
              </motion.button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
