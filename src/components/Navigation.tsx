"use client";

import React from "react";
import { Shirt, Sparkles, MessageSquare, ShoppingBag, Award, Sliders } from "lucide-react";

export type ActiveTab = "profile" | "catalog" | "vto" | "grade";

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  vtoTrayCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  vtoTrayCount,
}) => {
  const tabs = [
    {
      id: "profile" as const,
      label: "1. Profile Setup",
      shortLabel: "Profile",
      icon: Sliders,
    },
    {
      id: "catalog" as const,
      label: "2. Chat & Catalog",
      shortLabel: "Chat & Shop",
      icon: MessageSquare,
    },
    {
      id: "vto" as const,
      label: "3. VTO Studio",
      shortLabel: "Virtual Try-On",
      icon: Shirt,
    },
    {
      id: "grade" as const,
      label: "4. Style Grade",
      shortLabel: "Style Rating",
      icon: Award,
    },
  ];

  return (
    <nav className="w-full mb-8 bg-white/95 backdrop-blur-md border border-sky-100/80 rounded-3xl p-3 shadow-lg shadow-sky-100/50 sticky top-4 z-40">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#90CDF4] via-[#A0C4FF] to-[#FEF08A] p-0.5 shadow-md shadow-sky-200/50 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Shirt className="w-5 h-5 text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900">LumiFit</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FEF08A]/80 text-yellow-950 border border-yellow-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-yellow-700" /> AI Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Virtual Styling Studio</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#FDFBF7] p-1.5 rounded-2xl border border-sky-100/80 w-full md:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                suppressHydrationWarning
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] text-white shadow-md shadow-sky-200/70 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
                {tab.id === "vto" && vtoTrayCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#FEF08A] text-yellow-950 shadow-2xs">
                    {vtoTrayCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Tray Quick Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-900">
          <ShoppingBag className="w-4 h-4 text-sky-600" />
          <span>VTO Tray:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-yellow-950 font-black shadow-2xs">
            {vtoTrayCount} {vtoTrayCount === 1 ? "Item" : "Items"}
          </span>
        </div>
      </div>
    </nav>
  );
};
