// ProductDetails.jsx

"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api"; // ✅ centralized api
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
} from "lucide-react";
import Navbar from "./Navbar";

const fakeReviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment: "Excellent quality, very sturdy and premium finish.",
  },
  {
    name: "Anjali Verma",
    rating: 4,
    comment: "Comfortable and looks great. Worth the price.",
  },
  {
    name: "Amit Das",
    rating: 4,
    comment: "Good product, delivery was quick and packaging was solid.",
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(res.data?.Prod_img?.[0]);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // 🛒 Add to Cart
  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please log in to add items to cart 🧑‍💻");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });
      alert("🛒 Product added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  // 💖 Add to Wishlist
  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("Please log in to save items ❤️");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/wishlist/add", {
        userId,
        productId: product._id,
      });
      alert("❤️ Added to wishlist!");
    } catch (err) {
      console.error("Add to wishlist failed:", err);
      alert("Failed to add to wishlist");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3] text-lg font-semibold text-gray-500">
          Loading product details...
        </div>
      </>
    );

  /* ---------------- NOT FOUND ---------------- */
  if (!product)
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f9f7f3] text-lg font-semibold text-gray-500">
          Product not found
        </div>
      </>
    );

  const discount = 20;
  const discountedPrice = Math.round(product.price * (1 - discount / 100));
  const rating = 4.3;

  return (
    <div className="min-h-screen bg-[#f9f7f3]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* IMAGE SECTION */}
          <div>
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${selectedImage}`}
              className="w-full h-[420px] object-cover rounded-xl shadow"
              alt={product.name}
            />

            <div className="flex gap-3 mt-4">
              {product.Prod_img?.map((img, index) => (
                <img
                  key={index}
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${img}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    selectedImage === img
                      ? "border-indigo-600"
                      : "border-gray-300"
                  }`}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a]">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.floor(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                  fill={i < Math.floor(rating) ? "#facc15" : "none"}
                />
              ))}
              <span className="text-gray-600 text-sm">
                (1,248 ratings)
              </span>
            </div>

            <div className="mt-4">
              <p className="text-gray-500 line-through">
                ₹{product.price}
              </p>
              <p className="text-3xl font-bold text-indigo-600">
                ₹{discountedPrice}
                <span className="text-green-600 text-lg ml-2">
                  ({discount}% OFF)
                </span>
              </p>
            </div>

            <p className="mt-4 text-gray-700">
              {product.description}
            </p>

            <ul className="mt-4 list-disc list-inside text-gray-700">
              <li>Premium build quality</li>
              <li>Long-lasting durability</li>
              <li>Modern & minimal design</li>
              <li>Easy to maintain</li>
            </ul>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>

              <button
                onClick={handleAddToWishlist}
                className="flex items-center gap-2 border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                <Heart size={20} /> Wishlist
              </button>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Truck size={18} /> Free delivery in 3–5 days
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck size={18} /> 7-day replacement policy
              </p>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold mb-4">
            Customer Reviews
          </h2>

          <div className="space-y-4">
            {fakeReviews.map((review, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <p className="font-semibold">{review.name}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                      fill={i < review.rating ? "#facc15" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mt-2">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
