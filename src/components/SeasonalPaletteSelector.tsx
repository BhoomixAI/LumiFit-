"use client";

import React, { useState, useEffect } from "react";
import { Check, Palette, Sparkles, Wand2, X } from "lucide-react";

export interface ColorPaletteProfile {
  id: string;
  name: string;
  category: "spring" | "summer" | "autumn" | "winter";
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
  // SPRING
  {
    id: "light-spring",
    name: "Light Spring",
    category: "spring",
    tagline: "Soft, Warm & Luminous Pastel Tones",
    swatches: ["#FFD6C6", "#FFC5A1", "#98E2C6", "#FFE6A3", "#F2D8FF"],
    description: "Delicate corals, warm peaches, soft mint green, and light buttercream yellow.",
    bestFabrics: ["Linen", "Cotton Poplin", "Light Silk", "Seersucker"],
    glowColor: "rgba(255, 197, 161, 0.4)",
    borderColor: "border-orange-300",
    badgeBg: "bg-orange-50 text-orange-950 border-orange-200",
    cardBg: "bg-orange-50/20",
  },
  {
    id: "warm-spring",
    name: "Warm Spring",
    category: "spring",
    tagline: "Bright, Sunny & Golden Undertones",
    swatches: ["#FF7F50", "#FFB6C1", "#E6C280", "#FFD700", "#FF8C00"],
    description: "Coral pink, golden daffodil, pumpkin spice, and bright pistachio tones.",
    bestFabrics: ["Chambray", "Georgette", "Bamboo Knit", "Light Wool"],
    glowColor: "rgba(255, 215, 0, 0.4)",
    borderColor: "border-yellow-400",
    badgeBg: "bg-yellow-100 text-yellow-950 border-yellow-300",
    cardBg: "bg-yellow-50/30",
  },
  {
    id: "bright-spring",
    name: "Bright Spring",
    category: "spring",
    tagline: "Vivid, Clear & Energetic Colors",
    swatches: ["#FF3B30", "#FF6B6B", "#4CD964", "#FFCC00", "#FF2D55"],
    description: "Flamingo pink, lime zest green, electric orange, and rich lemon drop.",
    bestFabrics: ["Gabardine", "Satin", "Viscose", "Lycra Blend"],
    glowColor: "rgba(255, 45, 85, 0.4)",
    borderColor: "border-rose-400",
    badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
    cardBg: "bg-rose-50/30",
  },
  // SUMMER
  {
    id: "light-summer",
    name: "Light Summer",
    category: "summer",
    tagline: "Soft, Cool & Muted Pastel Tones",
    swatches: ["#B0C4DE", "#AEC6CF", "#F3C5C5", "#E8D8EE", "#D4F0E2"],
    description: "Powder blue, heather lilac, dusty blush, and cool seafoam accents.",
    bestFabrics: ["Chiffon", "Light Linen", "Cotton Voile", "Lace"],
    glowColor: "rgba(176, 196, 222, 0.4)",
    borderColor: "border-blue-300",
    badgeBg: "bg-blue-50 text-blue-950 border-blue-200",
    cardBg: "bg-blue-50/20",
  },
  {
    id: "cool-summer",
    name: "Cool Summer",
    category: "summer",
    tagline: "Serene, Muted & Truly Cool Slate Hues",
    swatches: ["#708090", "#4682B4", "#B0C4DE", "#E6E6FA", "#DDA0DD"],
    description: "Slate grey, periwinkle, sky blue, and delicate lavender tones.",
    bestFabrics: ["Silk Crepe", "Fine Cashmere", "Pima Cotton", "Tencel"],
    glowColor: "rgba(70, 130, 180, 0.4)",
    borderColor: "border-sky-300",
    badgeBg: "bg-sky-100 text-sky-950 border-sky-300",
    cardBg: "bg-sky-50/30",
  },
  {
    id: "soft-summer",
    name: "Soft Summer",
    category: "summer",
    tagline: "Muted, Velvety & Dusty Rose Undertones",
    swatches: ["#8F8FBD", "#A2B5CD", "#BC8F8F", "#D8BFD8", "#B0C4DE"],
    description: "Dusty rose, slate blue, amethyst mist, and cool taupe neutrals.",
    bestFabrics: ["Flannel", "Merino Wool", "Jersey", "Suede"],
    glowColor: "rgba(188, 143, 143, 0.4)",
    borderColor: "border-indigo-300",
    badgeBg: "bg-indigo-100 text-indigo-950 border-indigo-300",
    cardBg: "bg-indigo-50/30",
  },
  // AUTUMN
  {
    id: "soft-autumn",
    name: "Soft Autumn",
    category: "autumn",
    tagline: "Gentle, Warm & Muted Earth Tones",
    swatches: ["#C2A687", "#8FBC8F", "#B8860B", "#D2B48C", "#E9967A"],
    description: "Warm olive, soft mustard, rosewood, and warm beige sands.",
    bestFabrics: ["Corduroy", "Brushed Cotton", "Fleece", "Tweed"],
    glowColor: "rgba(184, 134, 11, 0.4)",
    borderColor: "border-yellow-600/50",
    badgeBg: "bg-yellow-50 text-yellow-950 border-yellow-200",
    cardBg: "bg-yellow-50/20",
  },
  {
    id: "warm-autumn",
    name: "Warm Autumn",
    category: "autumn",
    tagline: "Rich, Earthy & Radiant Copper Vibes",
    swatches: ["#8B4513", "#D2691E", "#CC7722", "#E6C280", "#A0522D"],
    description: "Terracotta clay, amber gold, toasted caramel, and deep cinnamon tones.",
    bestFabrics: ["Suede", "Knitwear", "Heavy Linen", "Chunky Ribbed Wool"],
    glowColor: "rgba(210, 105, 30, 0.4)",
    borderColor: "border-amber-400",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
    cardBg: "bg-amber-50/30",
  },
  {
    id: "deep-autumn",
    name: "Deep Autumn",
    category: "autumn",
    tagline: "Intense, Dark & Forest Golden Shades",
    swatches: ["#4A2C2A", "#6E473B", "#556B2F", "#8B0000", "#B8860B"],
    description: "Dark chocolate, forest green, deep maroon wine, and antique gold.",
    bestFabrics: ["Velvet", "Heavy Canvas", "Gabardine", "Jacquard"],
    glowColor: "rgba(139, 0, 0, 0.4)",
    borderColor: "border-red-800/40",
    badgeBg: "bg-red-950 text-red-50 border-red-800",
    cardBg: "bg-red-950/10",
  },
  // WINTER
  {
    id: "deep-winter",
    name: "Deep Winter",
    category: "winter",
    tagline: "Bold, Cool & Shadowy Jewel Colors",
    swatches: ["#191970", "#4A0E17", "#004B49", "#4B0082", "#2E3A47"],
    description: "Midnight navy, rich plum-wine, pine forest green, and deep charcoal.",
    bestFabrics: ["Structured Wool", "Thick Satin", "Faux Fur", "Heavy Twill"],
    glowColor: "rgba(25, 25, 112, 0.4)",
    borderColor: "border-blue-900/40",
    badgeBg: "bg-blue-950 text-blue-50 border-blue-800",
    cardBg: "bg-blue-950/10",
  },
  {
    id: "cool-winter",
    name: "Cool Winter",
    category: "winter",
    tagline: "Vivid, Cool & High-Contrast Emeralds",
    swatches: ["#000080", "#800020", "#330066", "#008080", "#D3D3D3"],
    description: "Cobalt blue, deep cherry crimson, pure white frost, and intense violet.",
    bestFabrics: ["Velvet", "Leather", "Duchess Satin", "Silk Tafetta"],
    glowColor: "rgba(128, 0, 32, 0.4)",
    borderColor: "border-purple-400",
    badgeBg: "bg-purple-100 text-purple-950 border-purple-300",
    cardBg: "bg-purple-50/30",
  },
  {
    id: "bright-winter",
    name: "Bright Winter",
    category: "winter",
    tagline: "Electric, Contrast & Luminous Jewel Highlights",
    swatches: ["#0000FF", "#FF007F", "#00FF00", "#4B0082", "#F0F8FF"],
    description: "Electric blue, magenta neon pink, acid green, and pure silver-white.",
    bestFabrics: ["Patent Leather", "Taffeta", "Polyester Satin", "Jersey Blend"],
    glowColor: "rgba(0, 0, 255, 0.4)",
    borderColor: "border-rose-500",
    badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
    cardBg: "bg-rose-50/30",
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
  const [activeCategory, setActiveCategory] = useState<"spring" | "summer" | "autumn" | "winter">("spring");
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  // Analyzer questionnaire state
  const [undertone, setUndertone] = useState<"cool" | "warm" | "neutral" | "">("");
  const [sunReaction, setSunReaction] = useState<"burn" | "tan" | "both" | "">("");
  const [contrast, setContrast] = useState<"low" | "medium" | "high" | "">("");
  const [analyzerSuccessMessage, setAnalyzerSuccessMessage] = useState("");

  // Keep category selector synchronized with active selection
  useEffect(() => {
    const matched = SEASONAL_PALETTES.find((p) => p.id === selectedId);
    if (matched) {
      setActiveCategory(matched.category);
    }
  }, [selectedId]);

  const categories = [
    { id: "spring", name: "Spring 🌸", colorClass: "hover:bg-orange-50 hover:text-orange-700" },
    { id: "summer", name: "Summer ☀️", colorClass: "hover:bg-sky-50 hover:text-sky-700" },
    { id: "autumn", name: "Autumn 🍂", colorClass: "hover:bg-amber-50 hover:text-amber-700" },
    { id: "winter", name: "Winter ❄️", colorClass: "hover:bg-purple-50 hover:text-purple-700" },
  ] as const;

  const filteredPalettes = SEASONAL_PALETTES.filter((p) => p.category === activeCategory);

  const handleAutoDetect = () => {
    if (!undertone || !sunReaction || !contrast) return;

    let matchedId = "cool-summer";

    if (undertone === "cool") {
      if (sunReaction === "burn") {
        matchedId = contrast === "high" ? "cool-winter" : "bright-winter";
      } else {
        matchedId = contrast === "low" ? "light-summer" : contrast === "medium" ? "soft-summer" : "cool-summer";
      }
    } else if (undertone === "warm") {
      if (sunReaction === "tan") {
        matchedId = contrast === "high" ? "deep-autumn" : "warm-autumn";
      } else {
        matchedId = contrast === "high" ? "bright-spring" : contrast === "low" ? "light-spring" : "warm-spring";
      }
    } else {
      // Neutral
      if (contrast === "high") {
        matchedId = sunReaction === "tan" ? "deep-autumn" : "deep-winter";
      } else if (contrast === "low") {
        matchedId = sunReaction === "burn" ? "light-summer" : "soft-autumn";
      } else {
        matchedId = sunReaction === "tan" ? "soft-autumn" : "soft-summer";
      }
    }

    const matchedProfile = SEASONAL_PALETTES.find((p) => p.id === matchedId);
    if (matchedProfile) {
      onSelect(matchedId);
      setAnalyzerSuccessMessage(`Suggested Season: ${matchedProfile.name}!`);
      setTimeout(() => {
        setAnalyzerSuccessMessage("");
        setShowAnalyzer(false);
        // Reset selections
        setUndertone("");
        setSunReaction("");
        setContrast("");
      }, 2500);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/50 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100/80">
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
            Choose your skin undertone harmony tab or use the AI detector to personalize fit styling algorithms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAnalyzer(!showAnalyzer)}
          className="text-xs px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#90CDF4] to-[#A0C4FF] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>AI Auto-Detect Palette</span>
        </button>
      </div>

      {/* AI Auto-Detect Questionnaire Drawer/Panel */}
      {showAnalyzer && (
        <div className="p-5 rounded-3xl bg-[#FDFBF7] border border-amber-100 shadow-inner relative space-y-5 animate-in slide-in-from-top duration-300">
          <button
            type="button"
            onClick={() => setShowAnalyzer(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2">
            <Wand2 className="w-4.5 h-4.5 text-sky-600 animate-pulse" />
            <h4 className="text-sm font-black text-slate-800">Skin Undertone Analyzer</h4>
          </div>

          {analyzerSuccessMessage ? (
            <div className="py-4 text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-lg">
                ✓
              </div>
              <p className="text-sm font-black text-slate-800">{analyzerSuccessMessage}</p>
              <p className="text-xs text-slate-500 font-semibold">Active recommendations have been customized!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Question 1 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  1. Vein Color (Undertones)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "cool" as const, label: "Cool (Blue/Purple)" },
                    { id: "warm" as const, label: "Warm (Greenish)" },
                    { id: "neutral" as const, label: "Neutral (Mixed)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setUndertone(opt.id)}
                      className={`text-xs py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        undertone === opt.id
                          ? "bg-sky-50 border-[#90CDF4] text-sky-800 font-extrabold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  2. Sun Exposure Reaction
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "burn" as const, label: "Burns Easily" },
                    { id: "tan" as const, label: "Tans Easily" },
                    { id: "both" as const, label: "Burns, then Tans" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSunReaction(opt.id)}
                      className={`text-xs py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        sunReaction === opt.id
                          ? "bg-sky-50 border-[#90CDF4] text-sky-800 font-extrabold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  3. Contrast Level (Hair/Eye vs. Skin)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "low" as const, label: "Low (Soft Pastel)" },
                    { id: "medium" as const, label: "Medium (Muted)" },
                    { id: "high" as const, label: "High (Deep Jewels)" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setContrast(opt.id)}
                      className={`text-xs py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                        contrast === opt.id
                          ? "bg-sky-50 border-[#90CDF4] text-sky-800 font-extrabold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={!undertone || !sunReaction || !contrast}
                className="w-full py-3.5 rounded-2xl bg-[#90CDF4] hover:bg-[#70B4F8] disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Analyze Undertones & Match 🤖</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4 Main Tabs: Spring, Summer, Autumn, Winter */}
      <div className="flex border-b border-sky-100/50 pb-px gap-1 overflow-x-auto">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-t-2xl font-extrabold text-xs sm:text-sm tracking-wide transition-all border-t border-x cursor-pointer ${
                isActive
                  ? "bg-white border-sky-100 border-b-white text-slate-900 shadow-[0_-2px_10px_rgba(144,205,244,0.08)]"
                  : `bg-transparent border-transparent text-slate-400 ${cat.colorClass}`
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Clickable cards in active season */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPalettes.map((palette) => {
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
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#90CDF4] to-[#70B4F8] text-white font-extrabold text-[10px] px-3.5 py-1 rounded-full flex items-center gap-1 shadow-md shadow-sky-200">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Selection
                </div>
              )}

              <div className="space-y-3 w-full">
                {/* Title & Tagline */}
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors flex items-center gap-1.5">
                    {palette.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold leading-tight">{palette.tagline}</p>
                </div>

                <p className="text-[11px] text-slate-600 leading-normal font-normal min-h-[48px]">{palette.description}</p>

                {/* 5 Visual Color Swatch Circles */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Swatches
                  </span>
                  <div className="flex items-center gap-1.5">
                    {palette.swatches.map((hex, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-0.5 group/swatch">
                        <div
                          className="w-7 h-7 rounded-full border border-white shadow-xs transform group-hover/swatch:scale-110 transition-transform duration-200 relative overflow-hidden"
                          style={{ backgroundColor: hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 group-hover/swatch:text-slate-700 font-bold">
                          {hex}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fabrics */}
              <div className="mt-4 pt-3 border-t border-sky-100/60 flex items-center gap-1 text-[10px] text-slate-500 overflow-x-auto font-medium">
                <Sparkles className="w-2.5 h-2.5 text-yellow-600 shrink-0" />
                <span className="font-bold text-slate-600">Fabrics:</span>
                <span className="truncate">{palette.bestFabrics.slice(0, 3).join(", ")}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
