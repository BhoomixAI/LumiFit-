"use client";

import React from "react";
import { Sparkles, Shirt, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full mb-8 space-y-6">
      {/* Top Brand & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-100/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#90CDF4] via-[#A0C4FF] to-[#FEF08A] p-0.5 shadow-md shadow-sky-200/50 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shirt className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-800">LumiFit</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF08A]/80 text-yellow-950 border border-yellow-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-yellow-700" /> AI Stylist v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Personalized Wardrobe & Fit Intelligence</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs bg-white/80 backdrop-blur-md border border-sky-100 px-4 py-2 rounded-full text-slate-700 shadow-sm shadow-sky-100/50 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-[#90CDF4] animate-pulse" />
          <span>Step 2 of 3</span>
          <span className="text-slate-300">•</span>
          <span className="text-sky-900 font-bold bg-[#FEF08A]/80 px-2 py-0.5 rounded-full border border-yellow-200">
            Body & Color DNA
          </span>
        </div>
      </div>

      {/* Main Requirement Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Personal Style Profile
          </h1>
          <div className="w-8 h-8 rounded-full bg-sky-100/80 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-sky-600" />
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed font-normal">
          Enter your body dimensions and color seasonal palette so our AI stylist can curate perfect recommendations.
        </p>
      </div>
    </header>
  );
};
