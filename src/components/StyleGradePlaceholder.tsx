"use client";

import React from "react";
import { Award, Sparkles, CheckCircle2, Star, ShieldCheck, TrendingUp } from "lucide-react";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";

interface StyleGradePlaceholderProps {
  selectedPaletteId: string;
}

export const StyleGradePlaceholder: React.FC<StyleGradePlaceholderProps> = ({
  selectedPaletteId,
}) => {
  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              4
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Style Grade & Fit Rating</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Algorithmic evaluation of your outfit balance, color harmony, and body ratio compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FEF08A]/80 border border-yellow-300 text-yellow-950 font-extrabold text-sm shadow-2xs">
          <Award className="w-5 h-5 text-yellow-700" />
          <span>Overall Score: 98.4 / 100</span>
        </div>
      </div>

      {/* Grade Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-base">
            99%
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Color Palette Harmony</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Your selection matches your <strong>{palette.name}</strong> seasonal undertones with zero warm/cool undertone clashing.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FEF08A] text-yellow-950 flex items-center justify-center font-bold text-base">
            97%
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Proportion & Fit Index</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            High waistlines and wide-leg hem proportions complement your height and waist-to-hip geometry.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-base">
            98%
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Versatility Score</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Curated pieces pair across 12+ day-to-night outfit combinations.
          </p>
        </div>
      </div>
    </div>
  );
};
