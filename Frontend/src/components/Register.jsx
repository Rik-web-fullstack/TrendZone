import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, MapPin, Mail, Lock, Phone } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const ACCENT = "#5c5346";

  // 🧠 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🟢 Submit Registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3000/api/users/register", formData);
      setMessage(res.data.message || "Registration successful!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f9f7f3] via-[#f6f3ed] to-[#f4efe7] px-4">
      <motion.div
        className="bg-white p-10 rounded-2xl shadow-lg border border-[#e8e3da] w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <UserPlus size={42} className="text-[#5c5346] mb-3" />
          <h2 className="text-3xl font-extrabold text-[#1a1a1a]">Create Account</h2>
          <p className="text-gray-600 text-sm mt-1">Join us and start exploring!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">Full Name</label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <UserPlus size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 focus:outline-none text-[#1a1a1a] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">Phone Number</label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <Phone size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                name="phone"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
                className="w-full bg-transparent py-2 focus:outline-none text-[#1a1a1a] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">Email Address</label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 focus:outline-none text-[#1a1a1a] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5c5346] mb-1">Password</label>
            <div className="flex items-center bg-[#f8f6f2] rounded-xl px-3 border border-[#e8e3da]">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent py-2 focus:outline-none text-[#1a1a1a] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="mt-5">
            <h3 className="text-md font-semibold text-[#5c5346] mb-3 flex items-center gap-2">
              <MapPin size={18} /> Address Details
            </h3>

            <div className="space-y-3">
              {["street", "city", "state", "pincode"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={formData.address[field]}
                  onChange={handleChange}
                  className="w-full py-2 px-3 rounded-xl bg-[#f8f6f2] border border-[#e8e3da] focus:ring-1 focus:ring-[#5c5346] outline-none text-[#1a1a1a] placeholder-gray-400"
                />
              ))}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5c5346] hover:bg-[#1a1a1a]"
            } text-white`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-sm font-medium text-green-600">{message}</p>
        )}

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#5c5346] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;
