"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShoppingBag,
  ChevronDown,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const ACCENT = "#5c5346";

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  // ✅ Fetch total dynamically from Cart
  const subtotal = state?.total || 0;
  const tax = useMemo(() => subtotal * 0.18, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const isCartEmpty = subtotal <= 0;

  // 🧠 Function to clear cart after successful payment
  const clearCartAfterPayment = async () => {
    if (!userId) return;
    try {
      await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);
      console.log("🧹 Cart cleared successfully");
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (isCartEmpty) return;
    setLoading(true);

    setTimeout(async () => {
      await clearCartAfterPayment(); // ✅ Clear user cart after success
      setLoading(false);
      alert("✅ Payment Successful! Thank you for your purchase.");
      navigate("/home");
    }, 1500);
  };

  // 🧠 Payment Method Options
  const paymentOptions = {
    upi: [
      { id: "gpay", name: "Google Pay", img: "/images/payment/gpay.jpg" },
      { id: "phonepe", name: "PhonePe", img: "/images/payment/phonpe.png" },
      { id: "paytm", name: "Paytm", img: "/images/payment/paytm.png" },
    ],
    card: [
      { id: "credit", name: "Credit Card" },
      { id: "debit", name: "Debit Card" },
      { id: "amex", name: "American Express" },
    ],
    wallet: [
      { id: "amazon", name: "Amazon Pay" },
      { id: "mobikwik", name: "Mobikwik" },
      { id: "freecharge", name: "Freecharge" },
    ],
    cod: [{ id: "cash", name: "Cash on Delivery" }],
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f9f7f3] via-[#f6f3ed] to-[#f4efe7] px-6 md:px-16 py-24 relative overflow-hidden">
      {/* Subtle radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,83,70,0.07),transparent_70%)]"></div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Left: Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-[#e8e3da]"
        >
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <CreditCard className="text-[#5c5346]" /> Choose Payment Method
          </h2>

          {/* Payment Method Tabs */}
          <div className="space-y-4">
            {["upi", "card", "wallet", "cod"].map((method) => (
              <motion.div
                key={method}
                layout
                className={`rounded-2xl border ${
                  selectedMethod === method
                    ? "border-[#5c5346] bg-[#f9f7f3]"
                    : "border-[#e8e3da] bg-white"
                } transition-all duration-300`}
              >
                {/* Header */}
                <div
                  onClick={() => setSelectedMethod(method)}
                  className="flex justify-between items-center p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {method === "upi" && <Smartphone className="text-[#5c5346]" />}
                    {method === "card" && <CreditCard className="text-[#5c5346]" />}
                    {method === "wallet" && <Wallet className="text-[#5c5346]" />}
                    {method === "cod" && <Truck className="text-[#5c5346]" />}
                    <h3 className="font-semibold capitalize text-[#1a1a1a]">
                      {method === "cod" ? "Cash on Delivery" : method}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`transition-transform ${
                      selectedMethod === method ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                {/* Expandable Options */}
                <AnimatePresence>
                  {selectedMethod === method && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-4 pb-4"
                    >
                      <div className="grid sm:grid-cols-3 gap-4 mt-2">
                        {paymentOptions[method].map((opt) => (
                          <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedOption(opt.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                              selectedOption === opt.id
                                ? "border-[#5c5346] bg-[#f8f5f1]"
                                : "border-[#e8e3da] bg-white"
                            }`}
                          >
                            {opt.img ? (
                              <img
                                src={opt.img}
                                alt={opt.name}
                                className="h-8 mb-2 object-contain"
                              />
                            ) : (
                              <CreditCard className="text-[#5c5346] mb-1" />
                            )}
                            <span className="text-sm text-[#1a1a1a] font-medium">
                              {opt.name}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Card Details */}
                      {method === "card" && selectedOption && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-6 space-y-3"
                        >
                          <input
                            type="text"
                            placeholder="Card Number"
                            className="w-full py-2 px-3 rounded-xl border border-[#e8e3da] bg-[#f9f7f3] focus:ring-1 focus:ring-[#5c5346] outline-none"
                          />
                          <div className="flex gap-3">
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-1/2 py-2 px-3 rounded-xl border border-[#e8e3da] bg-[#f9f7f3] focus:ring-1 focus:ring-[#5c5346] outline-none"
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              className="w-1/2 py-2 px-3 rounded-xl border border-[#e8e3da] bg-[#f9f7f3] focus:ring-1 focus:ring-[#5c5346] outline-none"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* UPI Input */}
                      {method === "upi" && selectedOption && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <input
                            type="text"
                            placeholder="Enter UPI ID (e.g. username@okaxis)"
                            className="w-full py-2 px-3 rounded-xl border border-[#e8e3da] bg-[#f9f7f3] focus:ring-1 focus:ring-[#5c5346] outline-none"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Payment Button */}
          <motion.button
            onClick={handlePayment}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!selectedOption || loading || isCartEmpty}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-white transition-all ${
              !selectedOption || isCartEmpty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5c5346] hover:bg-[#1a1a1a]"
            }`}
          >
            {isCartEmpty
              ? "No Items in Cart"
              : loading
              ? "Processing Payment..."
              : "Complete Payment"}
          </motion.button>

          <div className="flex justify-center mt-4 text-gray-600 text-sm items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            100% Secure Transaction
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-[#e8e3da] h-fit"
        >
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <ShoppingBag className="text-[#5c5346]" /> Order Summary
          </h2>

          <div className="space-y-3 text-[#1a1a1a]">
            <div className="flex justify-between text-sm text-gray-700">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <p>Shipping</p>
              <p className="text-green-700">Free</p>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <p>Tax (18%)</p>
              <p>₹{tax.toFixed(2)}</p>
            </div>

            <div className="border-t border-[#e8e3da] my-3"></div>

            <div className="flex justify-between font-semibold text-lg text-[#5c5346]">
              <p>Total</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <CheckCircle2 size={42} className="mx-auto text-green-600 mb-3" />
            <p className="text-gray-600 text-sm">
              Your order will be processed once the payment is completed.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Payment;
