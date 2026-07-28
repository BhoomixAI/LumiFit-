"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, Shirt, ArrowRight } from "lucide-react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedTier: "slow" | "medium" | "fast";
  duration: number;
  delay: number;
  opacity: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Refs for accurate responsive orb landing targeting
  const iDotRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [orbTargetOffset, setOrbTargetOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Track mouse movement for 3D parallax depth
  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 18;
      const y = ((e.clientY / innerHeight) - 0.5) * 18;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion]);

  // Generate 50 high-visibility multi-tiered glowing particles
  useEffect(() => {
    const tiers: ("slow" | "medium" | "fast")[] = ["slow", "medium", "fast"];
    const newParticles: Particle[] = Array.from({ length: 50 }).map((_, i) => {
      const speedTier = tiers[i % 3];
      const baseDuration = speedTier === "fast" ? 3.5 : speedTier === "medium" ? 6 : 9;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (speedTier === "fast" ? 6 : 9) + 4,
        speedTier,
        duration: baseDuration + Math.random() * 2,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.3 + 0.7, // High visibility
      };
    });
    setParticles(newParticles);
  }, []);

  // Update target coordinates for orb landing relative to screen container
  const updateOrbTarget = () => {
    if (iDotRef.current && containerRef.current) {
      const dotRect = iDotRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const targetX = dotRect.left + dotRect.width / 2 - containerRect.width / 2;
      const targetY = dotRect.top + dotRect.height / 2 - containerRect.height / 2;
      setOrbTargetOffset({ x: targetX, y: targetY });
    }
  };

  useEffect(() => {
    updateOrbTarget();
    window.addEventListener("resize", updateOrbTarget);
    return () => window.removeEventListener("resize", updateOrbTarget);
  }, []);

  // Master Choreography Timeline
  useEffect(() => {
    if (shouldReduceMotion) {
      const t1 = setTimeout(() => setPhase(1), 300);
      const t2 = setTimeout(() => setPhase(3), 1000);
      const t3 = setTimeout(() => setPhase(4), 1600);
      const t4 = setTimeout(() => setPhase(5), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    // High Impact Timeline
    const t1 = setTimeout(() => setPhase(1), 400);  // Orb & Volumetric Rays appear
    const t2 = setTimeout(() => setPhase(2), 1100); // Brand typography reveals letter-by-letter
    const t3 = setTimeout(() => setPhase(3), 2300); // Orb glides & docks on 'i'
    const t4 = setTimeout(() => setPhase(4), 3000); // Power-on Ripple, Shimmer & Background Glow Flash
    const t5 = setTimeout(() => setPhase(5), 3600); // Taglines reveal & "Get Started" Glass Button

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [shouldReduceMotion]);

  const handleProceed = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  const handleExitComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const letters = ["L", "u", "m", "i", "F", "i", "t"];

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          key="splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 0.96,
            y: 16,
            filter: "blur(16px)",
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 overflow-y-auto min-h-screen flex flex-col items-center justify-between py-6 sm:py-10 px-4 sm:px-8 select-none"
        >
          {/* LAYER 0: VIBRANT ANIMATED CANVAS GRADIENT */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }
            }
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="fixed inset-0 bg-gradient-to-br from-sky-200 via-cyan-150 via-blue-200 to-sky-300 bg-[length:200%_200%] pointer-events-none"
          />

          {/* LAYER 1: HIGH-INTENSITY VOLUMETRIC SPOTLIGHT BEAMS */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                opacity: [0.6, 0.95, 0.6],
                scale: [0.95, 1.2, 0.95],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 left-1/4 w-[50rem] h-[50rem] rounded-full bg-gradient-radial from-white via-sky-300/80 to-transparent blur-3xl"
            />
            <motion.div
              animate={{
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.25, 1],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 right-1/4 w-[52rem] h-[52rem] rounded-full bg-gradient-radial from-cyan-300/85 via-sky-400/70 to-transparent blur-3xl"
            />
          </div>

          {/* LAYER 2: HIGH-FASHION BACKGROUND OVERLAY (20% OPACITY) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.20] mix-blend-multiply">
            <Image
              src="/images/splash-bg.png"
              alt="LumiFit Haute Couture Aesthetics"
              fill
              priority
              className="object-cover object-center scale-105"
            />
          </div>

          {/* LAYER 3: ENLARGED & BRIGHTENED FLOATING GLASS BLOBS */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {/* Blob 1: Top Left Sky Blue */}
            <motion.div
              animate={{
                x: [mousePos.x * 1, 65 + mousePos.x * 1, -50 + mousePos.x * 1, mousePos.x * 1],
                y: [mousePos.y * 1, -65 + mousePos.y * 1, 50 + mousePos.y * 1, mousePos.y * 1],
                scale: [1, 1.2, 0.85, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-sky-400/60 via-cyan-400/50 to-blue-400/60 blur-2xl border-4 border-white shadow-[0_0_50px_rgba(56,189,248,0.6)]"
            />
            {/* Blob 2: Bottom Right Cyan */}
            <motion.div
              animate={{
                x: [-mousePos.x * 1.2, -70 - mousePos.x * 1.2, 60 - mousePos.x * 1.2, -mousePos.x * 1.2],
                y: [-mousePos.y * 1.2, 70 - mousePos.y * 1.2, -60 - mousePos.y * 1.2, -mousePos.y * 1.2],
                scale: [1, 0.8, 1.2, 1],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-[42rem] h-[42rem] rounded-full bg-gradient-to-tr from-blue-400/60 via-sky-400/60 to-cyan-400/70 blur-2xl border-4 border-white shadow-[0_0_50px_rgba(6,182,212,0.6)]"
            />
            {/* Blob 3: Center Radiant Glow */}
            <motion.div
              animate={{
                opacity: [0.6, 0.95, 0.6],
                scale: [0.95, 1.15, 0.95],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[44rem] rounded-full bg-gradient-to-r from-sky-300/80 via-cyan-300/70 to-white/90 blur-3xl border-4 border-white/80"
            />
            {/* Blob 4: Top Right Glass Sphere */}
            <motion.div
              animate={{
                x: [mousePos.x * 0.8, -45 + mousePos.x * 0.8, 35 + mousePos.x * 0.8, mousePos.x * 0.8],
                y: [mousePos.y * 0.8, 45 + mousePos.y * 0.8, -35 + mousePos.y * 0.8, mousePos.y * 0.8],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 right-6 w-96 h-96 rounded-full bg-gradient-to-bl from-white via-cyan-300/70 to-transparent blur-xl border-4 border-white shadow-2xl shadow-sky-300"
            />
            {/* Blob 5: Bottom Left Cyan */}
            <motion.div
              animate={{
                x: [-mousePos.x * 0.9, 50 - mousePos.x * 0.9, -40 - mousePos.x * 0.9, -mousePos.x * 0.9],
                y: [-mousePos.y * 0.9, -50 - mousePos.y * 0.9, 40 - mousePos.y * 0.9, -mousePos.y * 0.9],
              }}
              transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-6 w-[26rem] h-[26rem] rounded-full bg-gradient-to-tr from-cyan-400/70 via-sky-400/75 to-transparent blur-2xl border-4 border-sky-300/80"
            />
          </div>

          {/* LAYER 4: HIGH-VISIBILITY SILK FABRIC WAVE */}
          <div className="fixed inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-95 mix-blend-overlay overflow-hidden">
            <motion.svg
              viewBox="0 0 1440 320"
              className="w-[140%] h-auto -ml-[20%]"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      x: [-70 + mousePos.x * 0.7, 40 + mousePos.x * 0.7, -70 + mousePos.x * 0.7],
                      y: [0 + mousePos.y * 0.7, -26 + mousePos.y * 0.7, 0 + mousePos.y * 0.7],
                    }
              }
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <defs>
                <linearGradient id="silkGradientUltra" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <path
                fill="url(#silkGradientUltra)"
                stroke="#ffffff"
                strokeWidth="4"
                d="M0,160 C320,310 420,30 720,190 C1020,340 1120,50 1440,160 L1440,320 L0,320 Z"
              />
            </motion.svg>
          </div>

          {/* LAYER 5: 50 HIGH-VISIBILITY PARTICLES & BOKEH */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => {
              const parallaxMultiplier = p.speedTier === "fast" ? 1.5 : p.speedTier === "medium" ? 0.9 : 0.5;
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: `${p.x}vw`,
                    y: `${p.y + 10}vh`,
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    x: `calc(${p.x}vw + ${mousePos.x * parallaxMultiplier}px)`,
                    y: [`${p.y}vh`, `${p.y - (p.speedTier === "fast" ? 45 : p.speedTier === "medium" ? 32 : 22)}vh`],
                    opacity: [0, p.opacity, 0],
                    scale: [0.5, p.speedTier === "fast" ? 1.8 : 1.3, 0.5],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                  }}
                  className={`absolute rounded-full shadow-[0_0_20px_#38bdf8] ${
                    p.speedTier === "fast"
                      ? "bg-gradient-to-r from-cyan-100 to-white shadow-[0_0_25px_#06b6d4]"
                      : p.speedTier === "medium"
                      ? "bg-gradient-to-r from-sky-300 to-cyan-200 shadow-[0_0_20px_#38bdf8]"
                      : "bg-white shadow-[0_0_15px_#38bdf8]"
                  }`}
                />
              );
            })}
          </div>

          {/* TOP BAR: BRAND PILL & SKIP BUTTON */}
          <div className="w-full max-w-6xl flex items-center justify-between z-30 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-white shadow-xl text-xs font-black text-slate-950"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-md">
                <Shirt className="w-4 h-4 text-white" />
              </div>
              <span className="tracking-wide">LumiFit AI</span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            </motion.div>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              onClick={handleProceed}
              className="px-4 py-2 rounded-full bg-white hover:bg-sky-50 backdrop-blur-md border-2 border-white shadow-xl text-xs font-black text-slate-900 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
            >
              <span>Skip Intro</span>
              <Sparkles className="w-4 h-4 text-sky-500 group-hover:rotate-12 transition-transform" />
            </motion.button>
          </div>

          {/* MAIN STAGE: CINEMATIC GLASS CARD ARCHITECTURE */}
          <div className="relative my-auto w-full max-w-4xl z-20 flex flex-col items-center justify-center py-8 px-4 sm:px-10">
            {/* ARCHITECTURAL FROSTED GLASS CONTAINER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-[2.5rem] bg-white/85 backdrop-blur-3xl border-4 border-white shadow-[0_30px_90px_rgba(56,189,248,0.5)] p-6 sm:p-12 md:p-16 flex flex-col items-center justify-center overflow-visible"
            >
              {/* HERO FASHION MODEL SILHOUETTE WIREFRAME BACKGROUND ARTWORK (HIGH VISIBILITY) */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.9 }
                    : {
                        opacity: [0.75, 1, 0.75],
                        y: [mousePos.y * 0.35 - 6, mousePos.y * 0.35 + 6, mousePos.y * 0.35 - 6],
                      }
                }
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 w-56 sm:w-84 h-[30rem] pointer-events-none opacity-90 z-0 hidden sm:block"
              >
                <svg
                  viewBox="0 0 200 400"
                  className="w-full h-full drop-shadow-[0_0_40px_rgba(56,189,248,1)]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="heroFashionGradUltra" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="45" r="14" stroke="url(#heroFashionGradUltra)" strokeWidth="3" />
                  <path d="M100 59 V72 M82 82 C90 75 110 75 118 82" stroke="url(#heroFashionGradUltra)" strokeWidth="3" strokeLinecap="round" />
                  <path
                    d="M82 82 C70 120 85 150 90 175 C92 188 80 230 65 310 C55 350 45 375 40 390
                       M118 82 C130 120 115 150 110 175 C108 188 120 230 135 310 C145 350 155 375 160 390"
                    stroke="url(#heroFashionGradUltra)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path d="M88 175 C95 182 105 182 112 175" stroke="#FEF08A" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="70" cy="110" r="4" fill="#38bdf8" className="animate-ping" />
                  <circle cx="130" cy="140" r="4.5" fill="#06b6d4" className="animate-ping" />
                  <circle cx="140" cy="270" r="4" fill="#FEF08A" className="animate-ping" />
                </svg>
              </motion.div>

              {/* RADIAL LIGHT BEAM RAYS BEHIND LOGO */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 0.45 }
                    : {
                        rotate: 360,
                        opacity: [0.35, 0.7, 0.35],
                      }
                }
                transition={{
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }}
                className="absolute w-[44rem] h-[44rem] rounded-full pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(56, 189, 248, 0.45) 30deg, transparent 60deg, rgba(6, 182, 212, 0.45) 120deg, transparent 180deg, rgba(56, 189, 248, 0.45) 240deg, transparent 300deg)",
                }}
              />

              {/* HIGH-INTENSITY 3X POWER-ON RIPPLE EFFECT */}
              {phase >= 4 && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 1 }}
                  animate={{ scale: [0.4, 5.0], opacity: [1, 0] }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-64 h-64 rounded-full border-8 border-sky-400 shadow-[0_0_180px_rgba(56,189,248,1),0_0_260px_rgba(6,182,212,1)] pointer-events-none"
                />
              )}

              {/* DRAMATIC ORB JOURNEY WITH 3X NEON GLOW */}
              <AnimatePresence>
                {phase >= 1 && (
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            x: -160,
                            y: -90,
                            scale: 0.4,
                            opacity: 0,
                          }
                    }
                    animate={
                      shouldReduceMotion || phase < 3
                        ? {
                            x: phase >= 2 ? -70 : -140,
                            y: phase >= 2 ? -40 : -80,
                            scale: [0.8, 1.6, 1],
                            opacity: 1,
                          }
                        : {
                            x: orbTargetOffset.x,
                            y: orbTargetOffset.y,
                            scale: [1.6, 1],
                            opacity: 1,
                          }
                    }
                    transition={
                      phase >= 3
                        ? { type: "spring", stiffness: 140, damping: 18 }
                        : { duration: 1.4, ease: "easeInOut" }
                    }
                    className="absolute z-30 pointer-events-none flex items-center justify-center"
                    style={{
                      width: "44px",
                      height: "44px",
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: phase >= 4 ? [1, 1.7, 1] : [1, 1.4, 1],
                        boxShadow:
                          phase >= 4
                            ? [
                                "0 0 80px #38bdf8, 0 0 150px #06b6d4, 0 0 250px #0284c7",
                                "0 0 120px #38bdf8, 0 0 200px #0284c7, 0 0 300px #06b6d4",
                                "0 0 80px #38bdf8, 0 0 150px #06b6d4",
                              ]
                            : "0 0 80px #38bdf8, 0 0 150px #06b6d4",
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full h-full rounded-full bg-gradient-to-tr from-sky-400 via-cyan-300 to-white flex items-center justify-center shadow-2xl"
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-inner" />
                    </motion.div>

                    {phase >= 1 && phase < 4 && !shouldReduceMotion && (
                      <motion.div
                        animate={{ opacity: [1, 0.6, 1], scale: [1, 2.2, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute -inset-6 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 blur-lg pointer-events-none"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* LUMIFIT BRAND TYPOGRAPHY */}
              <motion.div
                animate={
                  phase >= 5 && !shouldReduceMotion
                    ? { scale: [1, 1.015, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-950 overflow-visible z-20 py-2 drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
              >
                {/* Backlight Glow when Powered On */}
                <motion.div
                  animate={{
                    opacity: phase >= 4 ? [0.9, 1, 0.9] : 0,
                    scale: phase >= 4 ? [0.98, 1.06, 0.98] : 0.9,
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-0 -inset-y-4 rounded-3xl bg-gradient-to-r from-sky-400/80 via-cyan-400/90 to-blue-500/70 blur-3xl pointer-events-none"
                />

                {/* High-Visibility Metallic Shimmer Sweep */}
                {phase >= 4 && !shouldReduceMotion && (
                  <motion.div
                    initial={{ x: "-120%" }}
                    animate={{ x: "220%" }}
                    transition={{ duration: 1.6, delay: 0.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                    className="absolute inset-y-0 w-64 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 pointer-events-none mix-blend-overlay z-40 shadow-[0_0_50px_white]"
                  />
                )}

                {/* Character Loop */}
                {letters.map((char, index) => {
                  const isFirstI = char === "i" && index === 3;

                  return (
                    <motion.span
                      key={`${char}-${index}`}
                      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
                      animate={
                        phase >= 2
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : { opacity: 0, y: 35, filter: "blur(8px)" }
                      }
                      transition={{
                        duration: 0.7,
                        delay: index * 0.08,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                      className="relative inline-block"
                    >
                      {isFirstI ? (
                        <span className="relative inline-flex flex-col items-center">
                          {/* Target placeholder marker for orb landing */}
                          <span
                            ref={iDotRef}
                            className="w-4 h-4 sm:w-6 sm:h-6 rounded-full opacity-0 pointer-events-none mb-1.5"
                          />
                          {/* Dotless 'i' stem */}
                          <span className="inline-block text-slate-950 leading-none">
                            ı
                          </span>
                        </span>
                      ) : (
                        <span
                          className={`inline-block leading-none ${
                            phase >= 4
                              ? "bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 bg-clip-text text-transparent drop-shadow-sm"
                              : "text-slate-950"
                          }`}
                        >
                          {char}
                        </span>
                      )}
                    </motion.span>
                  );
                })}
              </motion.div>

              {/* TAGLINES SECTION (100% VISIBLE NO TRUNCATION) */}
              <div className="mt-6 sm:mt-8 w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-3.5 z-20 overflow-visible px-2">
                {/* Tagline 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={
                    phase >= 5
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 15, filter: "blur(4px)" }
                  }
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <span className="block text-xs sm:text-base md:text-lg font-black tracking-[0.18em] sm:tracking-[0.25em] text-slate-950 uppercase bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 bg-clip-text text-transparent whitespace-normal break-words drop-shadow-sm">
                    Where AI Meets Personal Style
                  </span>
                </motion.div>

                {/* Tagline 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={
                    phase >= 5
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 12, filter: "blur(4px)" }
                  }
                  transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-black text-sky-900 tracking-wider w-full drop-shadow-sm"
                >
                  <span>Discover</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs" />
                  <span>Try On</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs" />
                  <span>Style Better</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* BOTTOM ACTION AREA: PREMIUM GLASSMORPHISM BUTTON */}
          <div className="w-full max-w-xs flex flex-col items-center justify-center min-h-[4.5rem] z-30 mt-4 mb-2">
            <AnimatePresence mode="wait">
              {phase >= 5 ? (
                <motion.button
                  key="get-started-btn"
                  type="button"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 15px 45px -5px rgba(56, 189, 248, 0.8)",
                      "0 25px 65px 0px rgba(56, 189, 248, 1)",
                      "0 15px 45px -5px rgba(56, 189, 248, 0.8)",
                    ],
                  }}
                  transition={{
                    opacity: { duration: 0.6 },
                    y: { duration: 0.6 },
                    scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleProceed}
                  className="px-10 py-4.5 rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-black text-lg shadow-2xl hover:scale-[1.06] active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-3 group backdrop-blur-md border-2 border-white tracking-wide"
                >
                  <Sparkles className="w-6 h-6 text-yellow-200 group-hover:rotate-12 transition-transform" />
                  <span>Get Started</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
              ) : (
                <motion.div
                  key="progress-bar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full flex flex-col items-center gap-3"
                >
                  <div className="w-full h-2.5 rounded-full bg-sky-200/90 overflow-hidden relative shadow-inner border border-white">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${(phase / 5) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 rounded-full"
                    />
                  </div>
                  <p className="text-[11px] text-slate-900 font-black tracking-widest uppercase">
                    Initializing Fit Intelligence
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
