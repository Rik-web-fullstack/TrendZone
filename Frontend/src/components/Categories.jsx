import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ for routing

// Scroll + hover animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const Categories = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  const categories = [
    {
      name: "Furniture",
      image: "/images/categories/furniture.jpg",
      path: "furniture",
    },
    {
      name: "Lighting",
      image: "/images/categories/lighting.jpg",
      path: "lighting",
    },
    {
      name: "Decor",
      image: "/images/categories/decor.jpg",
      path: "indoors",
    },
    {
      name: "Outdoors",
      image: "/images/categories/outdoors.jpg",
      path: "outdoors",
    },
    {
      name: "Workspace",
      image: "/images/categories/workspace.jpg",
      path: "furniture/tables",
    },
    {
      name: "Accessories",
      image: "/images/categories/accessories.jpg",
      path: "outdoors/accessories",
    },
  ];

  return (
    <section
      id="categories"
      className="relative bg-black text-white py-24 px-6 md:px-16"
    >
      {/* Section Heading */}
      <div className="text-center mb-20 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold tracking-[0.15em] uppercase"
        >
          <span className="bg-gradient-to-r from-beige via-white to-beige bg-clip-text text-transparent">
            Explore by
          </span>{" "}
          <span className="italic font-[Playfair_Display] text-beige">
            Category
          </span>
        </motion.h2>

        {/* Animated underline */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: "80px", opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
          className="h-[2px] bg-beige mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(245,245,220,0.5)]"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-beige/80 text-sm md:text-lg font-light tracking-wide"
        >
          Discover craftsmanship across our curated collections.
        </motion.p>

        {/* Subtle background glow */}
        <div className="absolute -z-10 left-1/2 -translate-x-1/2 top-0 w-[220px] h-[220px] bg-beige/10 blur-3xl rounded-full" />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.03, rotateY: 2 }}
            transition={{ type: "spring", stiffness: 100, damping: 12 }}
            className="relative group overflow-hidden rounded-2xl cursor-pointer"
            onClick={() => navigate(`/category/${cat.path}`)} // ✅ navigate to specific category
          >
            {/* Image */}
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-[350px] object-cover transform group-hover:scale-105 transition duration-700 ease-out"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-beige/15 transition duration-500 ease-in-out" />

            {/* Text */}
            <div className="absolute bottom-6 left-6">
              <h3 className="text-2xl font-semibold tracking-wider mb-1">
                {cat.name}
              </h3>
              <p className="text-beige text-sm font-light tracking-wide opacity-90 group-hover:underline transition-all">
                View Collection →
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
