"use client";

import React from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Facebook, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const accent = "#5c5346"; // Mocha gray accent tone

  const linkVariants = {
    hover: { color: accent, x: 4, transition: { duration: 0.3 } },
  };

  const shopLinks = [
    { label: "Furniture", path: "/category/furniture" },
    { label: "Lighting", path: "/category/lighting" },
    { label: "Decor", path: "/category/indoors" },
    { label: "Outdoors", path: "/category/outdoors" },
  ];

  return (
    <footer className="bg-[#0d0d0d] text-[#f5f5f5] pt-20 pb-10 border-t border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Brand */}
        <div className="text-center md:text-left mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-[Playfair_Display] tracking-wider mb-3"
          >
            <span className="text-[#f5f5f5]">Furni</span>
            <span style={{ color: accent }}>Flex</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-400 max-w-md"
          >
            Redefining modern luxury through craftsmanship, simplicity, and timeless design.
          </motion.p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16">

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: accent }}>
              Shop
            </h3>
            <ul className="space-y-2 text-gray-400">
              {shopLinks.map((item) => (
                <motion.li
                  key={item.label}
                  variants={linkVariants}
                  whileHover="hover"
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer transition-colors"
                >
                  {item.label}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company */}
<div>
  <h3 className="text-lg font-semibold mb-4" style={{ color: accent }}>
    Company
  </h3>
  <ul className="space-y-2 text-gray-400">
    <motion.li
      variants={linkVariants}
      whileHover="hover"
      onClick={() => navigate("/about")}
      className="cursor-pointer transition-colors"
    >
      About Us
    </motion.li>

    {["Careers", "Press", "Contact"].map((item) => (
      <motion.li
        key={item}
        variants={linkVariants}
        whileHover="hover"
        className="cursor-pointer transition-colors"
      >
        {item}
      </motion.li>
    ))}
  </ul>
</div>


          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: accent }}>
              Support
            </h3>
            <ul className="space-y-2 text-gray-400">
              {["FAQ", "Shipping", "Returns", "Privacy Policy"].map((item) => (
                <motion.li
                  key={item}
                  variants={linkVariants}
                  whileHover="hover"
                  className="cursor-pointer transition-colors"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: accent }}>
              Follow Us
            </h3>
            <div className="flex items-center gap-5">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ scale: 1.2, color: accent }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-gray-400"
                >
                  <Icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px my-8"
          style={{
            background:
              "linear-gradient(to right, transparent, #5c5346, transparent)",
          }}
        />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-gray-500 text-sm"
        >
          © 2025 <span style={{ color: accent }} className="font-semibold">FurniFlex</span>.
          Designed with passion and precision.
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
