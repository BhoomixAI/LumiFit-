"use client";

import React from "react";
import { Check, Palette, Sparkles } from "lucide-react";

export interface ColorPaletteProfile {
  id: string;
  name: string;
  tagline: string;
  swatches: string[];
  description: string;
  bestFabrics: string[];
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  cardBg: string;
}

export const SEASONAL_PALETTES: ColorPaletteProfile[] = [
  {
    id: "warm-autumn",
    name: "Warm Autumn",
    tagline: "Earthy, Golden & Deep Undertones",
    swatches: ["#8B4513", "#D2691E", "#CC7722", "#E6C280"],
    description: "Rich terracottas, amber gold, warm ochre, and toasted caramel tones.",
    bestFabrics: ["Suede", "Knitwear", "Linen", "Corduroy"],
    glowColor: "rgba(254, 240, 138, 0.4)",
    borderColor: "border-amber-400",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    cardBg: "bg-amber-50/30",
  },
  {
    id: "cool-summer",
    name: "Cool Summer",
    tagline: "Soft, Pastel & Muted Cool Tones",
    swatches: ["#708090", "#AEC6CF", "#B0C4DE", "#E6E6FA"],
    description: "Serene slate grey, powder blue, denim mist, and delicate lavender hues.",
    bestFabrics: ["Chiffon", "Silk Blend", "Cashmere", "Chambray"],
    glowColor: "rgba(144, 205, 244, 0.4)",
    borderColor: "border-sky-300",
    badgeBg: "bg-sky-100 text-sky-950 border-sky-300",
    cardBg: "bg-sky-50/30",
  },
  {
    id: "spring-radiance",
    name: "Spring Radiance",
    tagline: "Fresh, Bright & Lively Pastel Hues",
    swatches: ["#FF7F50", "#FFB6C1", "#FFE4B5", "#98FF98"],
    description: "Coral warmth, blush rose, soft cream vanilla, and mint radiance.",
    bestFabrics: ["Cotton Poplin", "Georgette", "Light Satin", "Organza"],
    glowColor: "rgba(254, 240, 138, 0.4)",
    borderColor: "border-rose-300",
    badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
    cardBg: "bg-rose-50/30",
  },
  {
    id: "winter-contrast",
    name: "Winter Contrast",
    tagline: "Vivid, Cool & High-Contrast Jewels",
    swatches: ["#000080", "#800020", "#E0EEEE", "#4B0082"],
    description: "Midnight navy, deep burgundy wine, icy frost white, and imperial indigo.",
    bestFabrics: ["Velvet", "Structured Wool", "Satin", "Leather"],
    glowColor: "rgba(160, 196, 255, 0.4)",
    borderColor: "border-purple-300",
    badgeBg: "bg-purple-100 text-purple-950 border-purple-300",
    cardBg: "bg-purple-50/30",
  },
];

interface SeasonalPaletteSelectorProps {
  selectedId: string;
  onSelect: (paletteId: string) => void;
}

export const SeasonalPaletteSelector: React.FC<SeasonalPaletteSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#A0C4FF] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm">
              B
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Seasonal Color Palette Selector
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Choose your skin undertone harmony to personalize color pairing algorithms.
          </p>
        </div>

        <div className="text-xs px-3.5 py-1.5 rounded-2xl bg-[#FEF08A]/80 border border-yellow-300 text-yellow-950 font-bold flex items-center gap-1.5 self-start sm:self-auto shadow-2xs">
          <Palette className="w-3.5 h-3.5 text-yellow-700" />
          <span>4 Seasonal Profiles</span>
        </div>
      </div>

      {/* 2x2 Grid of Selectable Palette Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SEASONAL_PALETTES.map((palette) => {
          const isSelected = selectedId === palette.id;

          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => onSelect(palette.id)}
              style={
                isSelected
                  ? {
                      boxShadow: `0 8px 30px ${palette.glowColor}, 0 0 0 3px rgba(144, 205, 244, 0.6)`,
                    }
                  : {}
              }
              className={`group relative text-left p-5 rounded-3xl transition-all duration-300 border bg-white cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `border-2 ${palette.borderColor} ${palette.cardBg} scale-[1.01]`
                  : "border-sky-100/80 hover:border-sky-200 hover:bg-slate-50/80 shadow-sm"
              }`}
            >
              {/* Selected Glow Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#90CDF4] to-[#70B4F8] text-white font-extrabold text-[11px] px-3.5 py-1 rounded-full flex items-center gap-1 shadow-md shadow-sky-200">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Selection
                </div>
              )}

              <div className="space-y-3">
                {/* Title & Tagline */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                      {palette.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{palette.tagline}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${palette.badgeBg}`}>
                    {palette.id.split("-")[0].toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{palette.description}</p>

                {/* 4 Visual Color Swatch Circles */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Palette Swatches
                  </span>
                  <div className="flex items-center gap-3">
                    {palette.swatches.map((hex, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 group/swatch">
                        <div
                          className="w-9 h-9 rounded-full border-2 border-white shadow-md transform group-hover/swatch:scale-115 transition-transform duration-200 relative overflow-hidden"
                          style={{ backgroundColor: hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 group-hover/swatch:text-slate-900 font-medium">
                          {hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended fabrics bar */}
              <div className="mt-4 pt-3 border-t border-sky-100/60 flex items-center gap-1.5 text-[11px] text-slate-600 overflow-x-auto font-medium">
                <Sparkles className="w-3 h-3 text-yellow-600 shrink-0" />
                <span className="font-bold text-slate-700">Favored Fabrics:</span>
                <span className="truncate">{palette.bestFabrics.join(" • ")}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
