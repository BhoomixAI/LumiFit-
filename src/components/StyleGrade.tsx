"use client";

import React from "react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { CATALOG_DATA, CatalogItem } from "@/data/catalog";
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
    colorHarmonyScore = 94; // Default baseline score
  }

  // 2. DYNAMIC FIT & PROPORTION SCORE CALCULATION
  let fitScore = 90;
  if (waistToHip <= 0.80) fitScore += 6; // Hourglass bonus
  if (measurements.heightCm >= 165) fitScore += 3;
  if (vtoTrayItems.some((i) => i.name.toLowerCase().includes("high-waisted") || i.name.toLowerCase().includes("wrap"))) {
    fitScore += 2;
  }
  fitScore = Math.min(fitScore, 99);

  // 3. OVERALL SCORE
  const overallScore = Math.round((colorHarmonyScore * 0.5) + (fitScore * 0.5));

  // Specific Item Names text
  const itemNamesText =
    vtoTrayItems.length > 0
      ? vtoTrayItems.map((i) => i.name).join(" + ")
      : "Selected LumiFit Capsule Ensemble";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              4
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Personalized AI Style Grade</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Algorithmic evaluation for your <strong>{palette.name}</strong> palette &amp; {measurements.heightCm} cm stature.
          </p>
        </div>

        {/* Overall Badge */}
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-[#FEF08A]/90 border border-yellow-300 text-yellow-950 font-extrabold shadow-md">
          <Award className="w-6 h-6 text-yellow-700 stroke-[2.5]" />
          <div>
            <span className="text-[10px] text-yellow-800 uppercase tracking-widest block font-bold">Overall Score</span>
            <span className="text-xl font-black text-slate-900">{overallScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Score Breakdown Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Color Harmony Score Card */}
          <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Palette className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Color Harmony Index</h3>
              </div>
              <span className="text-base font-black text-sky-700 bg-sky-50 px-3 py-1 rounded-2xl border border-sky-200">
                {colorHarmonyScore}% Match
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Your chosen palette <strong>{palette.name}</strong> pairs <strong>{colorHarmonyScore}%</strong> accurately with the selected items ({vtoTrayItems.length > 0 ? vtoTrayItems.map((i) => i.color).join(", ") : "Champagne & Warm Gold"}).
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-sky-100 text-xs space-y-1.5">
              <span className="font-extrabold text-slate-800 block">Skin Undertone Matrix:</span>
              <p className="text-slate-500 font-medium">
                {isWarmPalette
                  ? "Rich golden undertones enhance warm terracotta, amber gold, champagne, and 18k polished gold highlights."
                  : "Cool undertones harmonize perfectly with icy silver, powder blue, slate grey, and sapphire jewel accents."}
              </p>
            </div>
          </div>

          {/* Fit Score & Tailoring Advice Card */}
          <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FEF08A] text-yellow-950 flex items-center justify-center font-bold">
                  <Scissors className="w-4 h-4 text-yellow-800" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Fit &amp; Proportion Rating</h3>
              </div>
              <span className="text-base font-black text-yellow-950 bg-[#FEF08A]/80 px-3 py-1 rounded-2xl border border-yellow-300">
                {fitScore}% Precision
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Waist/Hip</span>
                <strong className="text-slate-900 text-sm font-extrabold">{waistToHip} Ratio</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Chest</span>
                <strong className="text-slate-900 text-sm font-extrabold">{measurements.bustIn} in</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Stature</span>
                <strong className="text-slate-900 text-sm font-extrabold">{measurements.heightCm} cm</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs space-y-1">
              <span className="font-extrabold text-sky-900 block">Custom Tailoring Insight:</span>
              <p className="text-sky-800 font-medium">
                Your <strong>{waistToHip}</strong> waist-to-hip proportion creates an elegant silhouette. High-waisted waistlines and structured shoulder hemlines maintain optimal vertical balance for your <strong>{measurements.heightCm} cm</strong> frame.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Stylist Recommendations & Action Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-5">
            <div className="pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" /> Personalized Stylist Critique
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluation of selected outfit items
              </p>
            </div>

            {/* Selected Garments List */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Staged Outfit ({vtoTrayItems.length} items):
              </span>

              {vtoTrayItems.length === 0 ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
                  Default Style Blueprint evaluated.
                </div>
              ) : (
                <div className="space-y-2">
                  {vtoTrayItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FDFBF7] border border-sky-100 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={item.imageUrl} alt={item.name} className="w-9 h-9 rounded-xl object-cover border" />
                        <div>
                          <h4 className="font-extrabold text-slate-900 line-clamp-1">{item.name}</h4>
                          <span className="text-[10px] text-slate-500">${item.price.toFixed(2)} • {item.color}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300">
                        Match
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stylist Tip */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-amber-50 border border-sky-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                <TrendingUp className="w-4 h-4 text-sky-600" /> Pro Styling Recommendation:
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                Combining <strong>{itemNamesText}</strong> creates a 1:1.618 golden aesthetic ratio. Wear with minimal metallic hardware to keep focus on your natural neckline line.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={onGoToVTO}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-xs shadow-lg shadow-sky-200/60 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Adjust Outfit in VTO Studio
              </button>

              <button
                type="button"
                onClick={onGoToCatalog}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FDFBF7] hover:bg-slate-100 text-slate-700 font-bold text-xs border border-sky-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-sky-600" /> Explore More Catalog Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
