import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";

const ProductPage = () => {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ACCENT = "#5c5346";

  const formatForBackend = (str = "") => str.replace(/-/g, " ").toLowerCase().trim();
  const toTitleCase = (str = "") =>
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const formattedCategory = formatForBackend(category);
        const formattedSubCategory = subcategory ? formatForBackend(subcategory) : "";

        let response;
        if (formattedCategory === "all") {
        // ✅ Fetch all products when /products/all is visited
            response = await axios.get("http://localhost:3000/api/products");
            } else {
            response = await axios.get("http://localhost:3000/api/products", {
            params: { category: formattedCategory, subcategory: formattedSubCategory },
          });
        }
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-semibold text-gray-500 animate-pulse">
        Loading curated designs...
      </div>
    );

  if (products.length === 0)
    return (
      <div className="flex justify-center items-center h-[70vh] text-lg font-semibold text-gray-500">
        No designs found in this collection.
      </div>
    );

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f9f7f3] via-[#f6f3ed] to-[#f4efe7] px-6 md:px-16 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] mb-3">
          {toTitleCase(subcategory || category)}
        </h2>
        <div className="w-20 h-1 mx-auto bg-[#5c5346] rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of {toTitleCase(subcategory || category)} —
          crafted to complement your living space with elegance and comfort.
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
      >
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl border border-[#e8e3da]/70 overflow-hidden transition-all duration-500 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Product Image */}
            <div
              className="relative h-64 overflow-hidden"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <motion.img
                src={`http://localhost:3000/uploads/${product.Prod_img?.[0]}`}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                whileHover={{ scale: 1.05 }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"
              />
            </div>

            {/* Floating icons */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition"
            >
              <button
                className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:bg-pink-100 transition"
                title="Add to Wishlist"
              >
                <Heart className="w-5 h-5 text-[#5c5346] hover:text-pink-500" />
              </button>
              <button
                className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:bg-[#e8e3da]/80 transition"
                title="Add to Cart"
              >
                <ShoppingCart className="w-5 h-5 text-[#5c5346] hover:text-[#1a1a1a]" />
              </button>
            </motion.div>

            {/* Product Info */}
            <div className="p-5 space-y-2">
              <h3 className="font-semibold text-[#1a1a1a] text-lg line-clamp-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold text-[#5c5346]">
                  ₹{product.price}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="text-sm font-semibold text-[#5c5346] hover:text-[#1a1a1a] transition"
                >
                  View Details →
                </motion.button>
              </div>
            </div>

            {/* Decorative bottom border accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#d9cfc1] via-[#5c5346] to-[#d9cfc1] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProductPage;
