"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7 },
};

const About = () => {
  return (
    <div className="bg-[#faf9f7] text-[#2b2b2b]">

      {/* HERO SECTION */}
<section className="relative min-h-[75vh] flex items-center justify-center px-6 overflow-hidden">
  
  {/* subtle background glow */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#d6cfc4] to-transparent rounded-full blur-3xl opacity-40" />
  </div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9, ease: "easeOut" }}
    className="max-w-4xl text-center"
  >
    {/* small intro line */}
    <span className="uppercase tracking-widest text-sm text-gray-500">
      Digital Products • Web • AI • SaaS
    </span>

    <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">
      Where Clean Design Meets <br />
      <span className="relative inline-block">
        Scalable Engineering
        <span className="absolute left-0 -bottom-2 w-full h-[6px] bg-gradient-to-r from-[#b8afa3] to-transparent rounded-full"></span>
      </span>
    </h1>

    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
      I create modern, high-performance web platforms that combine thoughtful
      user experience, solid architecture, and intelligent systems —
      built to scale with real-world needs.
    </p>
  </motion.div>
</section>


      {/* PROJECT STORY */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-semibold mb-6">
              About This Project
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              This e-commerce platform is not a template or a tutorial project.
              It’s designed as a production-style application that demonstrates
              how modern products are architected, scaled, and enhanced using
              intelligent systems.
            </p>

            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              The goal was to build something that feels like a real startup
              product — from clean UI and smooth animations to secure APIs,
              modular backend design, and future-ready integrations.
            </p>
          </motion.div>

          <motion.ul
            {...fadeUp}
            className="space-y-4 text-gray-700 text-lg"
          >
            <li>🛒 Full-fledged e-commerce workflows</li>
            <li>🤖 AI-assisted discovery & recommendations</li>
            <li>📦 Scalable backend & clean REST APIs</li>
            <li>🎨 Thoughtful UI/UX & motion design</li>
            <li>🚀 Built with extensibility in mind</li>
          </motion.ul>
        </div>
      </section>

      {/* WHAT I BUILD */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          What I’ve Built & Continue to Build
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Full-Stack Web Apps",
              desc: "Production-grade MERN applications with authentication, payments, dashboards, and scalable APIs.",
            },
            {
              title: "AI & ML Models",
              desc: "Machine learning models, recommendation systems, intelligent search, and AI-powered features.",
            },
            {
              title: "SaaS Platforms",
              desc: "Subscription-based tools, admin panels, analytics dashboards, and multi-tenant systems.",
            },
            {
              title: "Mobile-First Apps",
              desc: "App-like web experiences designed with responsiveness, performance, and UX in mind.",
            },
            {
              title: "Landing Pages",
              desc: "High-conversion, animated landing pages built for startups, products, and portfolios.",
            },
            {
              title: "System Design Projects",
              desc: "Architectural thinking, database modeling, API design, and scalability planning.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-[#f2f0ec] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">Tech Stack & Tools</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-10 text-lg">
            I use modern, industry-relevant technologies that are widely adopted
            in real-world production systems.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React",
              "Next.js",
              "Tailwind CSS",
              "Framer Motion",
              "Node.js",
              "Express.js",
              "MongoDB",
              "REST APIs",
              "JWT & Auth",
              "AI APIs",
              "Machine Learning",
              "Cloud & Deployment",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-5 py-2 bg-white rounded-full text-sm shadow"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-semibold mb-6">
            My Development Philosophy
          </h2>
          <p className="text-gray-700 text-lg max-w-4xl mx-auto">
            I believe great developers think like product builders. My focus is
            on writing clean, scalable code while understanding the bigger
            picture — users, performance, maintainability, and future growth.
          </p>
        </motion.div>
      </section>

    </div>
  );
};

export default About;
