"use client";

import React from "react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { Cpu, Shirt, Sparkles, CheckCircle2, SlidersHorizontal } from "lucide-react";

interface StylePreviewCardProps {
  measurements: MeasurementState;
  selectedPaletteId: string;
}

export const StylePreviewCard: React.FC<StylePreviewCardProps> = ({
  measurements,
  selectedPaletteId,
}) => {
  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];

  // Calculate body shape classification
  const bust = measurements.bustIn;
  const waist = measurements.waistIn;
  const hips = measurements.hipsIn;
  const height = measurements.heightCm;

  let bodyShape = "Hourglass";
  let bodyDesc = "Balanced top & bottom proportions with defined waist.";

  if (hips > 0 && waist > 0) {
    const waistToHipRatio = waist / hips;
    const bustToHipDiff = Math.abs(bust - hips);

    if (waistToHipRatio > 0.82) {
      if (bust > hips + 2) {
        bodyShape = "Inverted Triangle";
        bodyDesc = "Broader upper frame with tapered waist & hip line.";
      } else {
        bodyShape = "Rectangle / Athletic";
        bodyDesc = "Clean linear frame with subtle waist definition.";
      }
    } else {
      if (hips > bust + 2) {
        bodyShape = "Pear / Triangle";
        bodyDesc = "Curvy hip silhouette with elegant sloped shoulders.";
      } else if (bustToHipDiff <= 2.5) {
        bodyShape = "Hourglass";
        bodyDesc = "Harmonious bust-to-hip ratio with accentuated waist curve.";
      }
    }
  }

  // Calculate sizing estimate
  const sizeEstimate = bust < 34 ? "XS / S" : bust < 38 ? "M" : bust < 42 ? "L" : "XL / XXL";

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/50 space-y-6 sticky top-6">
      {/* Top AI Status */}
      <div className="flex items-center justify-between border-b border-sky-100/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center shadow-xs">
            <Cpu className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Live AI Style Engine</h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time match scoring</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-yellow-950 bg-[#FEF08A]/80 px-3 py-1 rounded-full border border-yellow-300 flex items-center gap-1.5 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 animate-pulse" /> 98.4% Match
        </span>
      </div>

      {/* Visual Avatar / Silhouette Simulator */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#FDFBF7] via-[#F0F7FF] to-[#FFFDF0] border border-sky-100/80 p-5 overflow-hidden flex flex-col items-center justify-center min-h-[220px] shadow-inner">
        {/* Dynamic Glow background matching active palette color */}
        <div
          className="absolute inset-0 opacity-15 blur-2xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: palette.swatches[0] }}
        />

        {/* Abstract Silhouette Visualizer */}
        <div className="relative z-10 flex flex-col items-center gap-3 w-full">
          <div className="relative flex items-center justify-center">
            {/* Swatch Aura Rings */}
            <div className="flex gap-1.5 mb-2">
              {palette.swatches.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="w-full bg-white/90 backdrop-blur-xs border border-sky-100/80 rounded-2xl p-3 text-center space-y-1 shadow-xs">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Identified Silhouette
            </div>
            <div className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
              <Shirt className="w-4 h-4 text-sky-600" />
              <span>{bodyShape}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight font-medium">{bodyDesc}</p>
          </div>

          {/* Size Tag */}
          <div className="flex items-center gap-3 text-xs w-full justify-around pt-1">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Est. Size</span>
              <span className="font-black text-sky-600 text-sm">{sizeEstimate}</span>
            </div>
            <div className="h-6 w-px bg-sky-200" />
            <div className="text-center">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Harmony</span>
              <span className="font-black text-amber-700 text-sm">{palette.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Garment Highlights */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Curated Recommendations Teaser
        </h4>

        <ul className="space-y-2 text-xs">
          <li className="flex items-start gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-sky-100/80 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900">Draped Trench Coats</strong> in <span style={{ color: palette.swatches[1] }} className="font-extrabold">{palette.swatches[1]}</span>
            </span>
          </li>
          <li className="flex items-start gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-sky-100/80 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900">Tailored High-Waist Trousers</strong> emphasizing waist ratio ({(waist / (hips || 1)).toFixed(2)})
            </span>
          </li>
          <li className="flex items-start gap-2.5 text-slate-700 bg-slate-50/80 p-3 rounded-2xl border border-sky-100/80 font-medium">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-900">Structured Knit Tops</strong> optimized for {height} cm stature frame
            </span>
          </li>
        </ul>
      </div>

      {/* Footer info */}
      <div className="text-[11px] text-slate-400 border-t border-sky-100/80 pt-3 flex items-center justify-between font-medium">
        <span className="flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3 text-slate-500" /> Algorithmic Fit Matrix
        </span>
        <span className="text-slate-600 font-mono font-bold">LUMI-9428</span>
      </div>
    </div>
  );
};
