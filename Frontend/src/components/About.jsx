"use client";

import React, { useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SCENES = [
  {
    id: "scene-1",
    title: "Redefining modern luxury for every home.",
    subtitle:
      "We believe luxury isn’t excess — it’s intention. Every piece we design is built to bring peace, presence, and beauty into daily living. True comfort lies in simplicity, not extravagance.",
    image: "/images/about/scene1.jpg",
    align: "left",
  },
  {
    id: "scene-2",
    title: "Every curve, fabric, and finish designed with intent.",
    subtitle:
      "Craftsmanship is at the heart of everything we create. Our artisans refine details by hand, guided by precision and passion. From the texture of wood to the softness of linen — every element tells a story.",
    image: "/images/about/scene2.jpg",
    align: "right",
  },
  {
    id: "scene-3",
    title: "Sustainable. Timeless. Crafted for the modern world.",
    subtitle:
      "We design for the future — pieces meant to last, made with integrity. Sustainability is not a trend for us; it’s a responsibility. Our promise: create beauty that endures, and comfort that stays.",
    image: "/images/about/scene3.jpg",
    align: "center",
  },
];

const clamp = (n, a = 0, b = 1) => Math.min(Math.max(n, a), b);

export default function StoryScrollCinematic() {

  const navigate = useNavigate();
  // Global scroll progress [0..1]
  const { scrollYProgress } = useScroll();

  // Smooth the global progress to avoid jitter
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 18 });

  // Background color transition: black -> beige -> white
  const bgColor = useTransform(
    smoothProgress,
    [0, 0.48, 1],
    [
      "rgb(0,0,0)",
      "rgb(245,245,220)", // beige (#F5F5DC)
      "rgb(255,255,255)",
    ]
  );

  // Text color transform to keep contrast (black or white depending on bg)
  const textColor = useTransform(
    smoothProgress,
    [0, 0.55, 1],
    ["rgb(255,255,255)", "rgb(34,34,34)", "rgb(34,34,34)"]
  );

  // helper to compute per-scene animation drivers from global progress
  const sceneDrivers = useMemo(() => {
    const step = 1 / SCENES.length;
    return SCENES.map((_, i) => {
      const center = i * step + step / 2; // middle of scene window
      const start = clamp(center - step * 0.6, 0, 1);
      const end = clamp(center + step * 0.6, 0, 1);
      return { start, end, center };
    });
  }, []);

  return (
    <motion.article
      className="relative"
      style={{ background: bgColor }}
      aria-label="About - story"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24">
        {/* loop scenes */}
        {SCENES.map((scene, idx) => {
          // map global progress to a local 0..1 for this scene
          const { start, end } = sceneDrivers[idx];
          const localProgress = useTransform(smoothProgress, [start, end], [0, 1], {
            clamp: true,
          });

          // text opacity & translate
          const textOpacity = useTransform(localProgress, [0, 0.25, 1], [0, 0.6, 1]);
          const textY = useTransform(localProgress, [0, 1], [30, 0]);

          // image parallax: moves opposite to text, more subtle
          const imgX = useTransform(localProgress, [0, 1], scene.align === "left" ? [20, -10] : scene.align === "right" ? [-20, 10] : [0, 0]);
          const imgOpacity = useTransform(localProgress, [0, 0.25, 1], [0.6, 0.9, 1]);

          // image scale subtle zoom
          const imgScale = useTransform(localProgress, [0, 1], [1.04, 1]);

          return (
            <section
              key={scene.id}
              id={scene.id}
              className="relative min-h-[75vh] md:min-h-[90vh] flex items-center"
            >
              <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Text Column */}
                <div
                  className={`col-span-12 md:col-span-6 ${scene.align === "right" ? "md:order-2 md:pl-12" : "md:pr-12"
                    }`}
                >
                  <motion.div
                    style={{ opacity: textOpacity, y: textY, color: textColor }}
                    initial={{ opacity: 0, y: 30 }}
                    // whileInView handled via global progress transforms above
                    transition={{ ease: "easeOut", duration: 0.8 }}
                  >
                    <h2
                      className="text-3xl md:text-4xl lg:text-5xl font-[Playfair_Display] leading-tight"
                      style={{ lineHeight: 1.05 }}
                    >
                      {scene.title}
                    </h2>
                    <p className="mt-6 text-sm md:text-lg font-light max-w-xl" style={{ color: textColor }}>
                      {scene.subtitle}
                    </p>

                    {/* optional micro CTAs or badges for scene 2 */}
                    {idx === 1 && (
                      <motion.div
                        className="mt-6 inline-flex items-center gap-3 text-xs bg-white/90 rounded-full px-4 py-2 shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                      >
                        <span className="font-semibold" style={{ color: "#5c5346" }}>Our Process</span>
                        <span className="text-sm text-gray-700">Hand-finished details</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Image Column */}
                <div className={`col-span-12 md:col-span-6 flex justify-center md:justify-${scene.align === "left" ? "end" : scene.align === "right" ? "start" : "center"} `}>
                  <motion.div
                    style={{ x: imgX, opacity: imgOpacity, scale: imgScale }}
                    className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
                  >
                    <div
                      className="w-full h-[360px] md:h-[520px] bg-center bg-cover"
                      style={{
                        backgroundImage: `url('${scene.image}')`,
                        filter: "brightness(0.96) saturate(0.98)",
                      }}
                      role="img"
                      aria-label={scene.title}
                    />
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}

        {/* concluding CTA block */}
        <section className="mt-12 bg-transparent py-12">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-2xl md:text-3xl font-semibold font-[Playfair_Display] mb-4"
              style={{ color: "rgb(34,34,34)" }}
            >
              Crafted for modern living
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-sm md:text-lg text-gray-700 max-w-2xl mx-auto"
            >
              We design with care — from the grain of the wood to the final stitch. Join us in creating homes that last.
            </motion.p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <a href="/about"className="px-6 py-2 rounded-full border border-[#5c5346] text-[#5c5346] hover:bg-[#5c5346] hover:text-white transition-all">
              Learn More
              </a>
              <button
                onClick={() => navigate("/category/all")}
                className="px-6 py-2 rounded-full bg-beige text-black hover:opacity-90 transition"
              >
                Shop the Collection
              </button>
            </div>
          </div>
        </section>
      </div>
    </motion.article>
  );
}
