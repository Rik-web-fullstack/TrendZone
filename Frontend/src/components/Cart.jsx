"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  /* ---------------- FETCH CART ---------------- */
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
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQuantity = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put("http://localhost:3000/api/cart/update", {
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

  /* ---------------- REMOVE ITEM ---------------- */
  const removeFromCart = async (productId) => {
    try {
      await axios.delete("http://localhost:3000/api/cart/remove", {
        data: { userId, productId },
      });

      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  /* ---------------- PRICE CALCULATIONS ---------------- */
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (total > 0) {
      navigate("/payment", { state: { total } });
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3]">
          Loading your cart 🛍️...
        </div>
      </>
    );

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!isLoggedIn)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3]">
          <LogIn size={48} className="text-[#5c5346]" />
        </div>
      </>
    );

  /* ---------------- MAIN ---------------- */
  return (
    <div className="min-h-screen bg-[#f9f7f3]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-24 mt-20">
        {cartItems.length === 0 ? (
          /* EMPTY CART */
          <div className="flex flex-col items-center text-center">
            <ShoppingBag size={72} className="text-[#5c5346] mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-3">YOUR CART IS EMPTY</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven’t added anything yet.
            </p>
            <button
              onClick={() => navigate("/category/all")}
              className="px-10 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-md
                         hover:bg-blue-600 hover:text-white transition"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          /* CART CONTENT */
          <div className="grid lg:grid-cols-3 gap-10">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl p-6 shadow flex items-center gap-6"
                  >
                    {/* PRODUCT IMAGE */}
                    <img
                      src={`http://localhost:3000/uploads/${item.product.Prod_img?.[0]}`}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    {/* PRODUCT INFO */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        ₹{item.product.price} each
                      </p>

                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="font-medium">{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* SUBTOTAL + REMOVE */}
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{item.product.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="mt-3 text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-2xl p-8 shadow h-fit">
              <h3 className="text-2xl font-semibold mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 bg-[#5c5346] text-white rounded-xl hover:bg-black transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
