"use client";

import React from "react";
import { CatalogItem } from "@/data/catalog";
import { Shirt, Sparkles, Wand2, Layers, ShoppingBag, Trash2 } from "lucide-react";

interface VTOStudioPlaceholderProps {
  vtoTrayItems: CatalogItem[];
  onRemoveFromTray: (itemId: string) => void;
  onGoToCatalog: () => void;
}

export const VTOStudioPlaceholder: React.FC<VTOStudioPlaceholderProps> = ({
  vtoTrayItems,
  onRemoveFromTray,
  onGoToCatalog,
}) => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              3
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Virtual Try-On (VTO) Studio</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Simulate photorealistic 3D fit overlays on your body avatar in real time.
          </p>
        </div>

        <button
          onClick={onGoToCatalog}
          className="px-5 py-2.5 rounded-2xl bg-[#FDFBF7] hover:bg-sky-50 border border-sky-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-sky-600" />
          <span>Add More Items from Catalog</span>
        </button>
      </div>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left VTO Tray Items (5 cols) */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-sky-600" /> Loaded VTO Tray Items
            </h3>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300">
              {vtoTrayItems.length} Loaded
            </span>
          </div>

          {vtoTrayItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Shirt className="w-12 h-12 text-sky-200 mx-auto" />
              <p className="text-xs font-bold text-slate-600">Your VTO Tray is currently empty.</p>
              <button
                onClick={onGoToCatalog}
                className="text-xs font-extrabold px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#90CDF4] to-[#70B4F8] text-white shadow-md shadow-sky-200 cursor-pointer"
              >
                Browse Catalog & Add Items ✨
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {vtoTrayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-sky-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-xl object-cover border" />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">${item.price.toFixed(2)} • {item.color}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromTray(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 3D Avatar Rendering Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-8 shadow-xl shadow-sky-100/60 flex flex-col items-center justify-center text-center min-h-[460px] relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#90CDF4] via-[#A0C4FF] to-[#FEF08A] p-0.5 shadow-xl shadow-sky-200/50 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center">
              <Wand2 className="w-9 h-9 text-sky-600 animate-pulse" />
            </div>
          </div>

          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF08A]/80 text-yellow-950 border border-yellow-300 mb-2">
            3D Avatar Neural Engine
          </span>

          <h3 className="text-2xl font-black text-slate-900 mb-2">Interactive VTO Renderer</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 font-medium">
            Load garments from your tray onto your calibrated body measurements for real-time crease, drape, and tension analysis.
          </p>

          <button
            onClick={() => alert("Simulating neural 3D mesh drape on body avatar...")}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-sm shadow-xl shadow-sky-200/80 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Generate 3D Fitting Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
