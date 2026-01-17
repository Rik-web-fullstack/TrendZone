// Payment.jsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import api from "../api/api"; // ✅ centralized api
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

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
  }, []);

  /* ✅ Fetch total from Cart */
  const subtotal = state?.total || 0;
  const tax = useMemo(() => subtotal * 0.18, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const isCartEmpty = subtotal <= 0;

  /* 🧹 Clear cart after successful payment */
  const clearCartAfterPayment = async () => {
    if (!userId) return;
    try {
      await api.delete(`/api/cart/clear/${userId}`);
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
      await clearCartAfterPayment();
      setLoading(false);
      alert("✅ Payment Successful! Thank you for your purchase.");
      navigate("/");
    }, 1500);
  };

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(92,83,70,0.07),transparent_70%)]"></div>

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-[#e8e3da]"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="text-[#5c5346]" /> Choose Payment Method
          </h2>

          <div className="space-y-4">
            {["upi", "card", "wallet", "cod"].map((method) => (
              <motion.div
                key={method}
                layout
                className={`rounded-2xl border ${
                  selectedMethod === method
                    ? "border-[#5c5346] bg-[#f9f7f3]"
                    : "border-[#e8e3da] bg-white"
                }`}
              >
                <div
                  onClick={() => setSelectedMethod(method)}
                  className="flex justify-between items-center p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {method === "upi" && <Smartphone />}
                    {method === "card" && <CreditCard />}
                    {method === "wallet" && <Wallet />}
                    {method === "cod" && <Truck />}
                    <h3 className="font-semibold capitalize">
                      {method === "cod" ? "Cash on Delivery" : method}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`transition-transform ${
                      selectedMethod === method ? "rotate-180" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {selectedMethod === method && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-4"
                    >
                      <div className="grid sm:grid-cols-3 gap-4 mt-2">
                        {paymentOptions[method].map((opt) => (
                          <motion.button
                            key={opt.id}
                            onClick={() => setSelectedOption(opt.id)}
                            className={`p-3 rounded-xl border ${
                              selectedOption === opt.id
                                ? "border-[#5c5346]"
                                : "border-[#e8e3da]"
                            }`}
                          >
                            {opt.img ? (
                              <img
                                src={opt.img}
                                alt={opt.name}
                                className="h-8 mx-auto mb-2"
                              />
                            ) : (
                              <CreditCard />
                            )}
                            <span className="text-sm font-medium">
                              {opt.name}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={handlePayment}
            disabled={!selectedOption || loading || isCartEmpty}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-white ${
              !selectedOption || isCartEmpty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5c5346]"
            }`}
          >
            {isCartEmpty
              ? "No Items in Cart"
              : loading
              ? "Processing Payment..."
              : "Complete Payment"}
          </motion.button>

          <div className="flex justify-center mt-4 text-sm items-center gap-2">
            <ShieldCheck className="text-green-600" />
            100% Secure Transaction
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-[#e8e3da]"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <ShoppingBag className="text-[#5c5346]" /> Order Summary
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p>Tax (18%)</p>
              <p>₹{tax.toFixed(2)}</p>
            </div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-semibold text-lg">
              <p>Total</p>
              <p>₹{total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <CheckCircle2 size={42} className="mx-auto text-green-600 mb-3" />
            <p className="text-sm text-gray-600">
              Your order will be processed once payment is completed.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Payment;
