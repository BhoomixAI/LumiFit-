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
    <div className="min-h-[90vh] flex flex-col items-center justify-center relative px-4 overflow-hidden select-none">
      {/* Background Ambient Glowing Accents */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-[#90CDF4]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#FEF08A]/15 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="text-center relative flex flex-col items-center justify-center space-y-12 max-w-xl w-full">
        
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
            className={`${cormorant.className} text-7xl sm:text-8xl font-medium tracking-wide text-slate-900 flex items-center justify-center`}
          >
            <span>L</span>
            <span>u</span>
            <span>m</span>
            <span className="mr-0.5">i</span>
            <span>F</span>
            {/* The second 'i' is Dotless 'ı' with snap-in dot absolute target */}
            <span className="relative inline-flex items-end justify-center w-[0.45em]">
              ı
              {/* Snap Target Dot */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: showDot ? 1 : 0, scale: showDot ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute w-[0.16em] h-[0.16em] bg-[#90CDF4] rounded-full shadow-[0_0_12px_#90CDF4] -top-[0.25em] left-[50%] -translate-x-[50%]"
              />

              {/* Orbit Flight Particle (Stage 3: At 2.5s, 3D ellipse orbit) */}
              {orbitActive && (
                <motion.span
                  initial={{ x: "0px", y: "30px", scale: 1.2, opacity: 1 }}
                  animate={{
                    x: ["0px", "-160px", "0px", "160px", "0px"],
                    y: ["30px", "0px", "-45px", "0px", "-20px"],
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
        <div className="relative inline-block w-full max-w-sm overflow-visible py-1">
          {/* Masked Tagline Text */}
          <motion.p
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ delay: 1.9, duration: 0.8, ease: "easeInOut" }}
            className="text-slate-500 font-medium text-xs sm:text-sm tracking-widest uppercase text-center whitespace-nowrap"
          >
            Your body, your palette, your virtual fitting room.
          </motion.p>

          {/* Gliding Light Mask Streak */}
          <motion.div
            initial={{ left: "0%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1.9, duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-6 bg-gradient-to-r from-transparent via-[#FEF08A] to-transparent shadow-[0_0_10px_#FEF08A] pointer-events-none -translate-x-[50%]"
          />
        </div>

        {/* Element 3: Primary CTA Button (Stage 4: At 4.0s) */}
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
          className="pt-8"
        >
          <button
            type="button"
            suppressHydrationWarning
            onClick={onStart}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-xs tracking-widest uppercase shadow-lg shadow-sky-200/80 hover:shadow-sky-300 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};
