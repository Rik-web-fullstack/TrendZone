// Navbar.jsx

"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
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
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navIconColor = scrolled ? "text-beige" : "text-black";

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

  /* ✅ Verify login (401 is NORMAL when logged out) */
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get("/api/users/verify");
        if (res.data?.loggedIn) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        // ✅ 401 = not logged in → NOT an error
        setUser(null);
      }
    };

    verifyUser();
  }, []);

  /* ✅ Scroll listener */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ✅ Logout */
  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("isGuest");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        {/* Logo */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          <span className="text-beige">Furni</span>
          <span className={scrolled ? "text-white" : "text-beige"}>Flex</span>
        </motion.div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={`hidden md:flex items-center px-3 py-2 rounded-full w-1/3 ${
            scrolled
              ? "bg-black/80 border border-beige-muted/20"
              : "bg-white/80 border border-black/10"
          }`}
        >
          <Search className={`w-5 h-5 mr-2 ${navIconColor}`} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className={`bg-transparent outline-none flex-1 text-sm ${
              scrolled ? "text-beige" : "text-black"
            }`}
          />
        </form>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <Heart
            onClick={() => navigate("/wishlist")}
            className={`w-6 h-6 ${navIconColor} cursor-pointer`}
          />
          <ShoppingCart
            onClick={() => navigate("/cart")}
            className={`w-6 h-6 ${navIconColor} cursor-pointer`}
          />

          {/* Account */}
          <div
            className="relative"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <User className={`w-6 h-6 ${navIconColor} cursor-pointer`} />

            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-black rounded-md"
                >
                  {user ? (
                    <ul>
                      <li className="px-4 py-2 text-beige">
                        Hello, {user.name}
                      </li>
                      <li
                        onClick={handleLogout}
                        className="px-4 py-2 text-red-400 cursor-pointer flex items-center gap-2"
                      >
                        <LogOut size={16} /> Logout
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 text-beige cursor-pointer"
                      >
                        Login
                      </li>
                      <li
                        onClick={() => navigate("/register")}
                        className="px-4 py-2 text-beige cursor-pointer"
                      >
                        Sign Up
                      </li>
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`md:hidden cursor-pointer ${navIconColor}`}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </div>

      {/* Desktop Categories */}
      <div className="hidden md:flex justify-center border-t border-beige-muted/10 bg-black/80">
        <ul className="flex gap-10 py-3 text-beige-muted uppercase text-sm">
          {Object.entries(categories).map(([key, subs]) => (
            <li
              key={key}
              className="relative cursor-pointer"
              onMouseEnter={() => setDropdown(key)}
              onMouseLeave={() => setDropdown(null)}
            >
              <div
                onClick={() => handleNavigate(key)}
                className="flex items-center gap-1 hover:text-beige capitalize"
              >
                {key} <ChevronDown size={16} />
              </div>

              <AnimatePresence>
                {dropdown === key && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-56 bg-black border border-beige-muted/20 rounded-md shadow-lg z-50"
                  >
                    {subs.map((sub) => (
                      <li
                        key={sub}
                        onClick={() => handleNavigate(key, sub)}
                        className="px-4 py-2 text-beige hover:bg-beige/10 cursor-pointer"
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
    </nav>
  );
};

export default Navbar;
