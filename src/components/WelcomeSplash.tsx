"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"],
});

interface WelcomeSplashProps {
  onStart: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({ onStart }) => {
  const [showDot, setShowDot] = useState(false);
  const [orbitActive, setOrbitActive] = useState(false);

  useEffect(() => {
    // Stage 3: Orbit starts at 2.5s
    const orbitTimer = setTimeout(() => {
      setOrbitActive(true);
    }, 2500);

    // Snap Dot: Lights up at 3.5s (particle finishes its 1.0s orbit)
    const snapTimer = setTimeout(() => {
      setShowDot(true);
      setOrbitActive(false);
    }, 3500);

    return () => {
      clearTimeout(orbitTimer);
      clearTimeout(snapTimer);
    };
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 overflow-hidden select-none bg-slate-50/30">
      {/* 1. Fullscreen Viewport Background (Fixed inset-0 to cover the whole screen) */}
      <div className="fixed inset-0 w-screen h-screen min-h-screen overflow-hidden z-0 pointer-events-none">
        <img 
          src="/background.png" 
          alt="Studio Background Grid" 
          className="w-full h-full object-cover opacity-25"
        />

        {/* Premium Saturated Ambient Glowing Floating Background Blobs (Frosted Glass Aesthetic) */}
        {/* Blob A: Rich Pastel Turquoise & Vivid Coral-Pink blending behind the central logo */}
        <motion.div
          animate={{
            scale: [1, 1.12, 0.92, 1],
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#06B6D4]/30 via-[#22D3EE]/25 to-[#F43F5E]/30 blur-[110px]"
        />

        {/* Blob B: Saturated Canary Yellow & Rich Amethyst Purple pulsing in the opposite corner */}
        <motion.div
          animate={{
            scale: [1, 0.88, 1.12, 1],
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#FDE047]/35 via-[#FACC15]/30 to-[#A855F7]/30 blur-[130px]"
        />

        {/* Blob C: Secondary accent of deep Lavender & Mint Green to add depth */}
        <motion.div
          animate={{
            scale: [1, 1.15, 0.9, 1],
            x: [0, 25, -25, 0],
            y: [0, 35, -20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-[#C084FC]/25 to-[#6EE7B7]/20 blur-[100px]"
        />
      </div>

      {/* Main Content Wrapper sitting over the background */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center max-w-5xl w-full py-12">
        
        {/* Element 1: "LumiFit" Logo with Headless 'i' in Cursive Font */}
        <div className="relative inline-block">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.44,
              duration: 0.7,
              ease: "easeOut"
            }}
            className={`${cormorant.className} text-8xl sm:text-9xl font-bold tracking-wide text-slate-900 flex items-center justify-center`}
          >
            <span>L</span>
            <span>u</span>
            <span>m</span>
            <span className="mr-0.5">i</span>
            <span>F</span>
            {/* The second 'i' is Dotless 'ı' with snap-in dot absolute target */}
            <span className="relative inline-flex items-end justify-center w-[0.45em]">
              ı
              {/* Snap Target Dot - aligned horizontally with the slanted stem and lowered vertically to match the first 'i' dot */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: showDot ? 1 : 0, scale: showDot ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute w-[0.16em] h-[0.16em] bg-[#90CDF4] rounded-full shadow-[0_0_12px_#90CDF4] top-[0.18em] left-[62%] -translate-x-[50%]"
              />

              {/* Orbit Flight Particle (Stage 3: At 2.5s, 3D ellipse orbit) */}
              {orbitActive && (
                <motion.span
                  initial={{ x: "0px", y: "30px", scale: 1.2, opacity: 1 }}
                  animate={{
                    x: ["0px", "-160px", "0px", "160px", "0px"],
                    y: ["30px", "0px", "-45px", "0px", "14px"],
                    scale: [1.2, 0.7, 0.4, 1.2, 1.0],
                    opacity: [1, 0.7, 0.4, 1, 1],
                  }}
                  transition={{
                    duration: 1.0,
                    ease: "easeInOut"
                  }}
                  className="absolute w-[0.18em] h-[0.18em] bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] rounded-full shadow-[0_0_15px_#90CDF4] z-50 pointer-events-none"
                />
              )}
            </span>
            <span>t</span>
          </motion.h1>
        </div>

        {/* Element 2: Tagline text revealed by glided light streak (Stage 2: At 1.9s) */}
        {/* Distance A (LumiFit to Tagline): mt-4 for a tight, compact gap */}
        <div className="relative w-full max-w-4xl mx-auto px-4 text-center overflow-visible py-1 mt-4">
          {/* Masked Tagline Text */}
          <motion.p
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 1.9, duration: 0.8, ease: "easeInOut" }}
            className="text-slate-500 font-bold text-xs md:text-sm tracking-wider uppercase text-center whitespace-normal md:whitespace-nowrap"
          >
            Your body, your palette, your virtual fitting room.
          </motion.p>

          {/* Gliding Light Mask Streak */}
          <motion.div
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1.9, duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent shadow-[0_0_10px_#FEF08A] pointer-events-none -translate-x-[50%]"
          />
        </div>

        {/* Element 3: Primary CTA Button (Stage 4: At 4.0s) */}
        {/* Distance B (Tagline to Button): mt-20 to make the gap significantly larger than Distance A */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 4.0,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 12
          }}
          className="pt-2 mt-20"
        >
          <button
            type="button"
            suppressHydrationWarning
            onClick={onStart}
            className="px-14 py-5 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-sm sm:text-lg tracking-widest uppercase shadow-lg shadow-sky-200/80 hover:shadow-sky-300 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
