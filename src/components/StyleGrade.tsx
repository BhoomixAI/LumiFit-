"use client";

import React, { useState } from "react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { CatalogItem } from "@/data/catalog";
import {
  Award,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Shirt,
  Palette,
  Scissors,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Heart,
  Share2,
  RotateCcw,
  Sparkle,
} from "lucide-react";

interface StyleGradeProps {
  measurements: MeasurementState;
  selectedPaletteId: string;
  vtoTrayItems: CatalogItem[];
  onGoToCatalog: () => void;
  onGoToVTO: () => void;
}

export const StyleGrade: React.FC<StyleGradeProps> = ({
  measurements,
  selectedPaletteId,
  vtoTrayItems,
  onGoToCatalog,
  onGoToVTO,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];
  const waistToHip = parseFloat((measurements.waistIn / (measurements.hipsIn || 1)).toFixed(2));

  // 1. DYNAMIC COLOR HARMONY SCORE CALCULATION
  let colorHarmonyScore = 88;
  const isWarmPalette = selectedPaletteId === "warm-autumn" || selectedPaletteId === "spring-radiance";

  if (vtoTrayItems.length > 0) {
    let warmMatchCount = 0;
    let totalCount = vtoTrayItems.length;

    vtoTrayItems.forEach((item) => {
      const isWarmItem =
        item.style.includes("warm-toned") ||
        ["gold", "amber", "terracotta", "coral", "beige", "champagne", "ivory", "tan", "brown"].some((c) =>
          item.color.toLowerCase().includes(c) || item.name.toLowerCase().includes(c)
        );
      if ((isWarmPalette && isWarmItem) || (!isWarmPalette && !isWarmItem)) {
        warmMatchCount++;
      }
    });

    const matchRatio = warmMatchCount / totalCount;
    colorHarmonyScore = Math.round(84 + matchRatio * 14); // 84 to 98
  } else {
    colorHarmonyScore = 92; // Default baseline score
  }

  // 2. DYNAMIC FIT & PROPORTION SCORE CALCULATION
  let fitScore = 90;
  if (waistToHip <= 0.80) fitScore += 6; // Hourglass bonus
  if (measurements.heightCm >= 165) fitScore += 3;
  if (vtoTrayItems.some((i) => i.name.toLowerCase().includes("high-waisted") || i.name.toLowerCase().includes("wrap"))) {
    fitScore += 2;
  }
  fitScore = Math.min(fitScore, 99);

  // 3. DYNAMIC OCCASION & VERSATILITY SCORE CALCULATION
  let versatilityScore = 85;
  const categoriesPresent = new Set(vtoTrayItems.map((i) => i.category));
  if (categoriesPresent.has("top") && categoriesPresent.has("bottom")) versatilityScore += 8;
  if (categoriesPresent.has("dress")) versatilityScore += 6;
  if (categoriesPresent.has("jewelry")) versatilityScore += 4;

  const styleTags = vtoTrayItems.map((i) => i.style);
  const isUniformStyle = styleTags.every((t) => t.includes("formal")) || styleTags.every((t) => t.includes("casual"));
  if (isUniformStyle && vtoTrayItems.length > 1) versatilityScore += 2;

  versatilityScore = Math.min(versatilityScore, 98);

  // 4. OVERALL SCORE & DYNAMIC STATUS BADGE
  const overallScore = Math.round((colorHarmonyScore * 0.4) + (fitScore * 0.4) + (versatilityScore * 0.2));

  let statusBadge = "Flattering Fit ✨";
  if (overallScore >= 93) {
    statusBadge = "Exceptional Harmony ✨";
  } else if (overallScore >= 88) {
    statusBadge = "Flattering Fit ✨";
  } else {
    statusBadge = "Custom Balanced Styling 💫";
  }

  // Dynamic Stylist Bullet Points
  const getPersonalizedInsights = () => {
    const insights: string[] = [];

    const tops = vtoTrayItems.filter((i) => i.category === "top");
    const bottoms = vtoTrayItems.filter((i) => i.category === "bottom");
    const dresses = vtoTrayItems.filter((i) => i.category === "dress");
    const jewelry = vtoTrayItems.filter((i) => i.category === "jewelry");

    if (dresses.length > 0) {
      insights.push(
        `The single-piece drape of the **${dresses[0].name}** streamlines your **${measurements.heightCm}cm** stature, creating an elegant uninterrupted line.`
      );
    } else if (tops.length > 0 && bottoms.length > 0) {
      insights.push(
        `Pairing the **${tops[0].name}** tucked into the **${bottoms[0].name}** emphasizes your natural **${waistToHip}** waist-to-hip contour beautifully.`
      );
    }

    if (jewelry.length > 0) {
      insights.push(
        `The subtle shimmer of the **${jewelry[0].name}** accentuates your collarbone, bringing focus upward to harmonize with your **${palette.name}** palette.`
      );
    }

    // Default general insights if tray is empty or missing layers
    if (insights.length < 2) {
      insights.push(
        `Your **${palette.name}** undertones pair optimally with structural necklines and soft organic fabrics.`
      );
      insights.push(
        `Try matching neutral tones with high-contrast hardware accents to bring out your color profile's natural vibrance.`
      );
    }

    return insights;
  };

  const itemNamesText =
    vtoTrayItems.length > 0
      ? vtoTrayItems.map((i) => i.name).join(" + ")
      : "Selected LumiFit Capsule Ensemble";

  return (
    <div className="space-y-8 relative">
      {/* Top Header Banner with Dynamic Scoring Gauge */}
      <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center md:justify-start">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              4
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Style Grade &amp; Feedback</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Personalized style diagnosis for your <strong>{palette.name}</strong> skin tones.
          </p>
        </div>

        {/* Dynamic Scoring Header Gauge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#FDFBF7] p-4 rounded-3xl border border-sky-200 shadow-inner w-full sm:w-auto">
          {/* Radial progress circle */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-sky-100"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                className="stroke-[#90CDF4] transition-all duration-1000"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={213}
                strokeDashoffset={213 - (213 * overallScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black text-slate-900 leading-none">{overallScore}</span>
              <span className="text-[9px] font-bold text-slate-400">SCORE</span>
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Style Rating</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300 shadow-2xs inline-block">
              {statusBadge}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Detailed Breakdown Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Color Harmony Card */}
            <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Color Harmony</h3>
                </div>
                <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                  {colorHarmonyScore}% Match
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Your **{palette.name}** palette pairs smoothly with your selected items.
              </p>

              <div className="flex gap-2.5">
                {palette.swatches.map((swatch, idx) => (
                  <div
                    key={idx}
                    className="w-7 h-7 rounded-full border border-white shadow-md relative group"
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
            </div>

            {/* Fit & Silhouette Card */}
            <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-sm font-extrabold text-slate-900">Fit &amp; Silhouette</h3>
                </div>
                <span className="text-xs font-black text-yellow-950 bg-[#FEF08A]/80 px-2.5 py-1 rounded-xl border border-yellow-300">
                  {fitScore}% Precision
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sizing is optimized for your **{measurements.heightCm}cm** stature and **{waistToHip}** waist-to-hip ratio.
              </p>

              <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between">
                <span>Height: {measurements.heightCm}cm</span>
                <span>Waist/Hips: {waistToHip}</span>
              </div>
            </div>
          </div>

          {/* Occasion & Versatility Card */}
          <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Shirt className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">Occasion &amp; Versatility</h3>
              </div>
              <span className="text-xs font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                {versatilityScore}% Versatile
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Evaluates how well your top, bottom, and jewelry pieces layer together for styled occasions.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-sky-100 text-xs space-y-1.5">
              <span className="font-extrabold text-slate-800 block">Occasion Match Status:</span>
              <p className="text-slate-500 font-medium">
                {styleTags.length > 0
                  ? `These items showcase a high proportion of ${styleTags.map((t) => t.split(",")[0]).join(" & ")} styling, making it highly adaptable.`
                  : "Staged outfit coordinates are balanced for daily styling versatility."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stylist Insights & Action Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-6">
            <div className="pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" /> Stylist Insights
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Personalized comments based on your active tray items
              </p>
            </div>

            {/* Dynamic Insight Bullets */}
            <ul className="space-y-3.5 text-xs text-slate-600">
              {getPersonalizedInsights().map((insight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-[#FDFBF7] border border-sky-100/80 p-3.5 rounded-2xl shadow-xs"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-sky-600 shrink-0 mt-0.5" />
                  <p
                    className="leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-sky-100">
              <button
                type="button"
                suppressHydrationWarning
                onClick={onGoToVTO}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-xs shadow-lg shadow-sky-200/60 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Style Look 🔄
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setIsSaved(!isSaved)}
                  className={`py-3.5 px-4 rounded-2xl font-extrabold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? "bg-[#FEF08A] border-yellow-300 text-yellow-950"
                      : "bg-[#FDFBF7] border-sky-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-yellow-800 text-yellow-800" : ""}`} />
                  <span>{isSaved ? "Saved! ❤️" : "Save Outfit ❤️"}</span>
                </button>

                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowShareModal(true)}
                  className="py-3.5 px-4 rounded-2xl bg-[#FDFBF7] hover:bg-slate-100 text-slate-700 font-extrabold text-xs border border-sky-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share 📸</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SHARE CARD DIALOG MODAL ================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center mx-auto shadow-xs">
              <Sparkle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Share Your Style Card</h3>
              <p className="text-xs text-slate-500 font-medium">LumiFit AI Outfit Diagnosis Card</p>
            </div>

            {/* Visual Card Preview Mock */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>LUMIFIT STYLE CARD</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-black text-slate-800">{itemNamesText}</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300">
                    {overallScore}/100 Rating
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {palette.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert("Link copied to clipboard! Share with friends to show your style score.");
                  setShowShareModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#90CDF4] text-white text-xs font-bold cursor-pointer"
              >
                Copy Link 🔗
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
