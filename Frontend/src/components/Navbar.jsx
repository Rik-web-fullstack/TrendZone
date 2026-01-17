"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // 🔍 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);

  const navIconColor = scrolled ? "text-beige" : "text-black";

  const categories = {
    furniture: [
      "Sofa & Sectionals",
      "Chairs",
      "Tables",
      "Beds",
      "Wardrobes",
    ],
    lighting: [
      "Ceiling Lights",
      "Table Lamps",
      "Floor Lamps",
    ],
    outdoors: [
      "Garden Furniture",
      "Planters & Pots",
      "Outdoor Decor",
    ],
    indoors: [
      "Home Decor",
      "Wall Art",
      "Mirrors",
    ],
  };

  /* ---------------- VERIFY LOGIN ---------------- */
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await api.get("/api/users/verify");
        setUser(res.data?.loggedIn ? res.data.user : null);
      } catch {
        setUser(null);
      }
    };
    verifyUser();
  }, []);

  /* ---------------- SCROLL ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    await api.post("/api/users/logout");
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  /* ---------------- SEARCH (DEBOUNCED) ---------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await api.get("/api/products/search", {
          params: { q: searchQuery },
        });
        setSuggestions(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ---------------- SEARCH SUBMIT ---------------- */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleNavigate = (category, sub = null) => {
    if (sub) {
      navigate(`/category/${category}/${sub.toLowerCase().replace(/ /g, "-")}`);
    } else {
      navigate(`/category/${category}`);
    }
    setDropdown(null);
    setMobileMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-beige/10"
          : "bg-transparent"
      }`}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 md:px-10">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          <span className="text-beige">Trend</span>
          <span className={scrolled ? "text-white" : "text-beige"}>Zone</span>
        </div>

        {/* 🔍 SEARCH */}
        <div className="relative hidden md:block w-1/3" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center px-3 py-2 rounded-full ${
              scrolled
                ? "bg-black/80 border border-beige/20"
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

          {/* 🔥 LIVE SUGGESTIONS */}
          {searchQuery && (
            <div className="absolute top-12 left-0 w-full bg-black rounded-xl shadow-lg z-50">
              {searchLoading ? (
                <p className="p-4 text-sm text-beige/70">Searching...</p>
              ) : suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      navigate(`/product/${item._id}`);
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-beige/10"
                  >
                    <img
                      src={item.Prod_img?.[0]}
                      className="w-10 h-10 object-cover rounded"
                      alt={item.name}
                    />
                    <div>
                      <p className="text-sm text-beige">{item.name}</p>
                      <p className="text-xs text-beige/60">₹{item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-beige/60">
                  No products found
                </p>
              )}
            </div>
          )}
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-5">
          <Heart
            onClick={() => navigate("/wishlist")}
            className={`w-6 h-6 ${navIconColor} cursor-pointer`}
          />
          <ShoppingCart
            onClick={() => navigate("/cart")}
            className={`w-6 h-6 ${navIconColor} cursor-pointer`}
          />

          {/* ACCOUNT */}
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

                      {user.role === "admin" && (
                        <li
                          onClick={() => navigate("/admin")}
                          className="px-4 py-2 text-indigo-400 cursor-pointer hover:bg-beige/10"
                        >
                          ➕ Add Products
                        </li>
                      )}

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

      {/* DESKTOP CATEGORIES */}
      <div className="hidden md:flex justify-center bg-black/80 border-t border-beige/10">
        <ul className="flex gap-10 py-3 text-beige uppercase text-sm">
          {Object.entries(categories).map(([key, subs]) => (
            <li
              key={key}
              onMouseEnter={() => setDropdown(key)}
              onMouseLeave={() => setDropdown(null)}
              className="relative cursor-pointer"
            >
              <div
                onClick={() => handleNavigate(key)}
                className="flex items-center gap-1 hover:text-white capitalize"
              >
                {key} <ChevronDown size={16} />
              </div>

              <AnimatePresence>
                {dropdown === key && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-2 w-56 bg-black rounded-md shadow-lg z-50"
                  >
                    {subs.map((sub) => (
                      <li
                        key={sub}
                        onClick={() => handleNavigate(key, sub)}
                        className="px-4 py-2 text-beige hover:bg-beige/10"
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
