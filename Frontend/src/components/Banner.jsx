import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const slides = [
    {
      id: 1,
      image: "/images/banner/slide1.jpg",
      title: "Modern Furniture for Your Dream Home",
      subtitle: "Elegant. Durable. Timeless design.",
    },
    {
      id: 2,
      image: "/images/banner/slide2.jpg",
      title: "Minimal Living. Maximum Comfort.",
      subtitle: "Curated interiors in muted tones.",
    },
    {
      id: 3,
      image: "/images/banner/slide3.jpg",
      title: "Organized Elegance",
      subtitle: "Luxury closets & storage solutions.",
    },
    {
      id: 4,
      image: "/images/banner/slide4.jpg",
      title: "Lighting that Shapes Atmosphere",
      subtitle: "Signature pendants and ambient fixtures.",
    },
    {
      id: 5,
      image: "/images/banner/slide5.jpg",
      title: "Where Comfort Meets Design",
      subtitle: "Modern living rooms crafted for life.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const timeoutRef = useRef(null);
  const navigate = useNavigate(); // ✅ Add navigate hook

  // Auto-slide every 5s
  useEffect(() => {
    const next = () => setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    timeoutRef.current = setInterval(next, 5000);
    return () => clearInterval(timeoutRef.current);
  }, [length]);

  const nextSlide = () => setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides Wrapper */}
      <motion.div
        className="flex h-full w-full"
        animate={{ x: `-${current * 100}%` }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex items-center justify-start overflow-hidden"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-beige/5" />

            {/* Text content */}
            <motion.div
              key={slide.id}
              className="relative z-10 px-6 md:px-16 lg:px-24 max-w-3xl"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wider leading-tight">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white/80 mt-3">
                {slide.subtitle}
              </p>

              {/* ✅ Shop Now button navigates to /all-products */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/category/all")} // ✅ navigation here
                className="mt-6 px-6 py-2 border border-beige text-beige rounded-full hover:bg-beige hover:text-black transition-all duration-300"
              >
                Shop Now →
              </motion.button>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition z-20"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? "bg-beige scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
