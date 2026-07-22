"use client";

import React from "react";
import { MeasurementState } from "./BodyMeasurements";
import { SEASONAL_PALETTES } from "./SeasonalPaletteSelector";
import { Sparkles, CheckCircle, ArrowRight, X, ShieldCheck, RefreshCw } from "lucide-react";

interface SaveSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurements: MeasurementState;
  selectedPaletteId: string;
}

export const SaveSuccessModal: React.FC<SaveSuccessModalProps> = ({
  isOpen,
  onClose,
  measurements,
  selectedPaletteId,
}) => {
  if (!isOpen) return null;

  const palette = SEASONAL_PALETTES.find((p) => p.id === selectedPaletteId) || SEASONAL_PALETTES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white border border-sky-100/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-200/50 space-y-6 overflow-hidden">
        {/* Glow effect */}
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ backgroundColor: palette.swatches[0] }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-[#FEF08A]/80 border-2 border-yellow-300 text-yellow-950 flex items-center justify-center shadow-md">
            <CheckCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" /> AI Stylist Profile Saved
            </div>
            <h3 className="text-2xl font-black text-slate-900">Your Personal Style Profile is Ready!</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
            Our AI engine has successfully calculated your custom silhouette ratios and mapped your <strong>{palette.name}</strong> color matrix.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-[#FDFBF7] border border-sky-100 rounded-2xl p-4 space-y-3 text-xs shadow-inner">
          <div className="flex items-center justify-between text-slate-900 font-extrabold border-b border-sky-100 pb-2">
            <span>Saved Profile Blueprint</span>
            <span className="text-sky-700 flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-600">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Height</span>
              <strong className="text-slate-900 text-sm font-extrabold">{measurements.heightCm} cm</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Bust / Chest</span>
              <strong className="text-slate-900 text-sm font-extrabold">{measurements.bustIn} in</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Waist</span>
              <strong className="text-slate-900 text-sm font-extrabold">{measurements.waistIn} in</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Hips</span>
              <strong className="text-slate-900 text-sm font-extrabold">{measurements.hipsIn} in</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-sky-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Palette</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sky-800">{palette.name}</span>
              <div className="flex -space-x-1">
                {palette.swatches.map((hex, idx) => (
                  <div
                    key={idx}
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => {
              alert("Entering LumiFit AI Wardrobe Studio...");
              onClose();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-sm shadow-lg shadow-sky-200/60 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Explore Wardrobe Recommendations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Modify Dimensions
          </button>
        </div>
      </div>
    </div>
  );
};
