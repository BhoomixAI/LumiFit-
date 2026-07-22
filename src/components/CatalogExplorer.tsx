"use client";

import React, { useMemo } from "react";
import { CATALOG_DATA, CatalogItem } from "@/data/catalog";
import { Search, Sparkles, Check, ShoppingBag, Filter, Tag, X } from "lucide-react";

interface CatalogExplorerProps {
  vtoTrayItems: CatalogItem[];
  onAddToVtoTray: (item: CatalogItem) => void;
  onRemoveFromVtoTray: (itemId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  maxPriceFilter: number | null;
  onMaxPriceFilterChange: (maxPrice: number | null) => void;
  recommendedItemIds: string[];
  onClearAIFilters: () => void;
}

const CATEGORIES: { id: string; label: string; count: number }[] = [
  { id: "all", label: "All Items", count: 48 },
  { id: "top", label: "Tops", count: 12 },
  { id: "bottom", label: "Bottoms", count: 12 },
  { id: "dress", label: "Dresses", count: 12 },
  { id: "jewelry", label: "Jewelry", count: 12 },
];

export const CatalogExplorer: React.FC<CatalogExplorerProps> = ({
  vtoTrayItems,
  onAddToVtoTray,
  onRemoveFromVtoTray,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchQueryChange,
  maxPriceFilter,
  onMaxPriceFilterChange,
  recommendedItemIds,
  onClearAIFilters,
}) => {
  const filteredCatalog = useMemo(() => {
    return CATALOG_DATA.filter((item) => {
      // 1. Category filter
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      // 2. Search query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.color.toLowerCase().includes(query) ||
        item.style.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      // 3. Max Price filter
      const matchesPrice = maxPriceFilter === null || item.price <= maxPriceFilter;

      // 4. Hard AI Recommendation Filter (Hide non-matching items!)
      const matchesAIRecommendation =
        recommendedItemIds.length === 0 || recommendedItemIds.includes(item.id);

      return matchesCategory && matchesSearch && matchesPrice && matchesAIRecommendation;
    });
  }, [selectedCategory, searchQuery, maxPriceFilter, recommendedItemIds]);

  const isAIFilterActive = maxPriceFilter !== null || recommendedItemIds.length > 0 || searchQuery !== "";

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    if (recommendedItemIds.length > 0 && catId !== "all") {
      const hasItemsInCategory = CATALOG_DATA.some(
        (i) => i.category === catId && recommendedItemIds.includes(i.id)
      );
      if (!hasItemsInCategory) {
        onClearAIFilters();
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-5 sm:p-6 shadow-xl shadow-sky-100/50 flex flex-col h-[680px]">
      {/* Header & Search Bar */}
      <div className="space-y-3 pb-4 border-b border-sky-100/80 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
                ✨
              </span>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Interactive Catalog Grid</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              48 Curated garments &amp; accessories synced with AI Chatbot
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 self-start sm:self-auto">
            <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
            <span>Tray: {vtoTrayItems.length} items</span>
          </div>
        </div>

        {/* Active AI Recommendation Filter Status Bar */}
        {isAIFilterActive && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FDFBF7] p-2.5 rounded-2xl border border-sky-200 text-xs shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-yellow-700" /> AI Filter Active ({filteredCatalog.length} Results)
              </span>

              {maxPriceFilter !== null && (
                <span className="font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-xl border border-sky-100 flex items-center gap-1">
                  Max Price: <strong className="text-sky-700">${maxPriceFilter}</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={onClearAIFilters}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-xl border border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear Filter
            </button>
          </div>
        )}

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            suppressHydrationWarning
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search 48 items by name, color, style, or price..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FDFBF7] border border-sky-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#90CDF4] focus:ring-2 focus:ring-sky-200/50 font-medium transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => onSearchQueryChange("")}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 bg-slate-200/60 hover:bg-slate-200 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                suppressHydrationWarning
                onClick={() => handleCategoryClick(cat.id)}
                className={`text-xs font-extrabold px-3.5 py-2 rounded-2xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] text-white shadow-md shadow-sky-200/60 scale-[1.02]"
                    : "bg-[#FDFBF7] hover:bg-sky-50 border border-sky-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? "bg-white/30 text-white" : "bg-slate-200/80 text-slate-600"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Grid Area */}
      <div className="flex-1 overflow-y-auto pt-4 pr-1 custom-scrollbar">
        {filteredCatalog.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
            <Filter className="w-10 h-10 text-sky-300" />
            <p className="text-sm font-bold text-slate-700">No catalog items match your criteria.</p>
            <p className="text-xs text-slate-500">Try adjusting your budget or clearing AI chat filters.</p>
            <button
              type="button"
              suppressHydrationWarning
              onClick={onClearAIFilters}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-sky-100 text-sky-900 hover:bg-sky-200 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
            {filteredCatalog.map((item) => {
              const isInTray = vtoTrayItems.some((t) => t.id === item.id);
              const isAIRecommended = recommendedItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group bg-white rounded-3xl p-3.5 transition-all duration-300 flex flex-col justify-between relative ${
                    isAIRecommended
                      ? "border-2 border-[#90CDF4] shadow-xl shadow-sky-200/80 scale-[1.01]"
                      : "border border-sky-100/80 shadow-sm hover:shadow-xl hover:shadow-sky-100/60 hover:border-sky-200"
                  }`}
                >
                  {/* AI Recommended Badge */}
                  {isAIRecommended && (
                    <div className="absolute -top-3 left-4 z-20 bg-[#FEF08A] text-yellow-950 border border-yellow-300 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-700" /> AI Recommended
                    </div>
                  )}

                  {/* Item Image with full object-contain preview */}
                  <div className="relative w-full h-56 rounded-2xl bg-[#F8FAFC] overflow-hidden mb-3 border border-slate-100 flex items-center justify-center p-2">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Category Badge overlay */}
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 shadow-xs">
                      {item.category}
                    </span>

                    {/* Price Tag Overlay */}
                    <span className="absolute bottom-2.5 right-2.5 text-xs font-black px-2.5 py-1 rounded-full bg-slate-900/90 text-white shadow-md">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Item Info */}
                  <div className="space-y-1.5 mb-3 px-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      {/* Color dot */}
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#90CDF4] border border-white shadow-xs" />
                        <span>{item.color}</span>
                      </span>

                      <span className="text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full font-bold border border-sky-100">
                        {item.style.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Add to VTO Tray Primary Button */}
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => {
                      if (isInTray) {
                        onRemoveFromVtoTray(item.id);
                      } else {
                        onAddToVtoTray(item);
                      }
                    }}
                    className={`w-full py-2.5 px-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                      isInTray
                        ? "bg-[#FEF08A]/80 hover:bg-yellow-200 text-yellow-950 border border-yellow-300"
                        : "bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white shadow-md shadow-sky-200/60 hover:scale-[1.01]"
                    }`}
                  >
                    {isInTray ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-yellow-900 stroke-[3]" />
                        <span>In VTO Tray ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add to VTO Tray ✨</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
