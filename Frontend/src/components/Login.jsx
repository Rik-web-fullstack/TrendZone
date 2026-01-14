// Login.jsx

import React, { useState } from "react";
import api from "../api/api"; // ✅ centralized api
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ACCENT = "#5c5346";

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/api/users/login", formData);

      if (res.data.user?._id) {
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("isGuest", "false");
      }

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMessage(res.data.message || "Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Guest login
  const handleGuestLogin = () => {
    localStorage.setItem("isGuest", "true");
    localStorage.removeItem("userId");
    navigate("/home");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f7f3] via-[#f6f3ed] to-[#f4efe7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-lg border border-[#e8e3da] w-full max-w-md text-center"
      >
        <div className="flex flex-col items-center mb-6">
          <LogIn size={42} className="text-[#5c5346] mb-3" />
          <h2 className="text-3xl font-extrabold text-[#1a1a1a]">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Log in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">
              Email
            </label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">
              Password
            </label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5c5346] hover:bg-[#1a1a1a]"
            } text-white`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <motion.button
            type="button"
            onClick={handleGuestLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl border bg-[#f9f7f3] hover:bg-[#efeae2] flex justify-center gap-2 text-[#5c5346]"
          >
            <User size={18} />
            Continue as Guest
          </motion.button>
        </form>

        {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        {message && <p className="text-green-600 mt-4 text-sm">{message}</p>}

        <p className="text-gray-600 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-[#5c5346] font-semibold cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
