"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new
  const navigate = useNavigate();

  // ✅ Categories
  const categories = {
    furniture: [
      "Sofa & Sectionals",
      "Chairs",
      "Tables",
      "Beds",
      "Wardrobes",
      "Storage Units",
      "TV Stands",
    ],
    lighting: [
      "Ceiling Lights",
      "Table Lamps",
      "Floor Lamps",
      "Wall Lights",
      "Pendant Lights",
    ],
    outdoors: [
      "Garden Furniture",
      "Planters & Pots",
      "Outdoor Decor",
      "Accessories",
      "Garden Tools",
    ],
    indoors: [
      "Home Decor",
      "Wall Art",
      "Mirrors",
      "Clocks",
      "Rugs & Carpets",
      "Curtains",
    ],
  };

  // ✅ Login check
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users/verify", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
      })
      .catch(() => setUser(null));
  }, []);

  // ✅ Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    await axios.post(
      "http://localhost:3000/api/users/logout",
      {},
      { withCredentials: true }
    );
    setUser(null);
    navigate("/");
  };

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  const handleNavigate = (category, subcategory = null) => {
    if (subcategory) {
      navigate(
        `/category/${category}/${subcategory.toLowerCase().replace(/ /g, "-")}`
      );
    } else {
      navigate(`/category/${category}`);
    }
    setDropdown(null);
    setMobileMenu(false);
  };

  // ✅ Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-beige-muted/10"
          : "bg-transparent"
      }`}
    >
      {/* 🔹 Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer tracking-wide select-none"
        >
          <span className="text-beige">Furni</span>
          <span className="text-white">Flex</span>
        </motion.div>

        {/* ✅ Search bar (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white/5 border border-beige-muted/20 px-3 py-2 rounded-full w-1/3 backdrop-blur-sm"
        >
          <Search className="text-beige-muted w-5 h-5 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="bg-transparent outline-none flex-1 text-sm text-beige-muted placeholder-beige-muted/70"
          />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Heart
            onClick={() => navigate("/wishlist")}
            className="w-6 h-6 text-beige-muted cursor-pointer hover:text-beige transition-transform duration-200 hover:scale-110"
          />
          <ShoppingCart
            onClick={() => navigate("/cart")}
            className="w-6 h-6 text-beige-muted cursor-pointer hover:text-beige transition-transform duration-200 hover:scale-110"
          />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-beige">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-beige text-black text-sm px-3 py-1 rounded-full flex items-center gap-1 hover:bg-white transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <User
              onClick={() => navigate("/")}
              className="w-6 h-6 text-beige-muted cursor-pointer hover:text-beige transition-transform duration-200 hover:scale-110"
            />
          )}
          <div
            className="md:hidden cursor-pointer text-beige"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </div>

      {/* 🔹 Desktop Categories */}
      <div className="hidden md:flex justify-center border-t border-beige-muted/10 bg-black/80">
        <ul className="flex items-center gap-10 py-3 text-beige-muted font-medium uppercase text-sm tracking-wide">
          {Object.entries(categories).map(([categoryKey, subcats]) => (
            <li
              key={categoryKey}
              className="relative group cursor-pointer"
              onMouseEnter={() => toggleDropdown(categoryKey)}
              onMouseLeave={() => toggleDropdown(null)}
            >
              <div
                onClick={() => handleNavigate(categoryKey)}
                className="flex items-center gap-1 hover:text-beige transition-colors capitalize"
              >
                {categoryKey} <ChevronDown size={16} />
              </div>

              <AnimatePresence>
                {dropdown === categoryKey && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-52 bg-black border border-beige-muted/20 shadow-soft-beige rounded-md overflow-hidden"
                  >
                    {subcats.map((sub) => (
                      <li
                        key={sub}
                        onClick={() => handleNavigate(categoryKey, sub)}
                        className="px-4 py-2 text-beige-muted hover:text-beige hover:bg-beige/10 cursor-pointer transition-colors"
                      >
                        {sub}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-t border-beige-muted/20 shadow-lg"
          >
            {/* ✅ Search (mobile) */}
            <form onSubmit={handleSearch} className="flex items-center bg-white/10 border border-beige-muted/20 px-3 py-2 rounded-full mt-3 mx-4">
              <Search className="text-beige-muted w-5 h-5 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none flex-1 text-sm text-beige-muted placeholder-beige-muted/70"
              />
            </form>

            <ul className="flex flex-col p-4 gap-4 font-medium text-beige">
              {Object.entries(categories).map(([categoryKey, subcats]) => (
                <li key={categoryKey}>
                  <div
                    onClick={() => handleNavigate(categoryKey)}
                    className="flex justify-between items-center py-2 cursor-pointer hover:text-beige-muted"
                  >
                    <span className="capitalize">{categoryKey}</span>
                  </div>
                  <ul className="pl-4 border-l border-beige-muted/20">
                    {subcats.map((sub) => (
                      <li
                        key={sub}
                        onClick={() => handleNavigate(categoryKey, sub)}
                        className="py-1 text-sm hover:text-beige-muted cursor-pointer"
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
