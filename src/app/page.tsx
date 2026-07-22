"use client";

import React, { useState } from "react";
import { Navigation, ActiveTab } from "@/components/Navigation";
import { Header } from "@/components/Header";
import { BodyMeasurements, MeasurementState } from "@/components/BodyMeasurements";
import { SeasonalPaletteSelector } from "@/components/SeasonalPaletteSelector";
import { StylePreviewCard } from "@/components/StylePreviewCard";
import { SaveSuccessModal } from "@/components/SaveSuccessModal";
import { AIChatbot, AIRecommendationFilter } from "@/components/AIChatbot";
import { CatalogExplorer } from "@/components/CatalogExplorer";
import { VTOStudio } from "@/components/VTOStudio";
import { StyleGrade } from "@/components/StyleGrade";
import { CatalogItem } from "@/data/catalog";
import { ArrowRight, Sparkles, ShieldCheck, Heart, RotateCcw } from "lucide-react";

export default function Home() {
  // State for Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("catalog");

  // Shared State for Section A (Body Measurements)
  const [measurements, setMeasurements] = useState<MeasurementState>({
    heightCm: 168,
    bustIn: 36,
    waistIn: 28,
    hipsIn: 38,
  });

  // Shared State for Section B (Seasonal Color Palette)
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("warm-autumn");

  // Shared State for VTO Tray Items
  const [vtoTrayItems, setVtoTrayItems] = useState<CatalogItem[]>([]);

  // Catalog State (Connected with AI Chatbot)
  const [catalogCategory, setCatalogCategory] = useState<string>("all");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>("");
  const [catalogMaxPrice, setCatalogMaxPrice] = useState<number | null>(null);
  const [recommendedItemIds, setRecommendedItemIds] = useState<string[]>([]);

  // Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleMeasurementChange = (key: keyof MeasurementState, val: number) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  const handleReset = () => {
    setMeasurements({
      heightCm: 168,
      bustIn: 36,
      waistIn: 28,
      hipsIn: 38,
    });
    setSelectedPaletteId("warm-autumn");
  };

  const handleAddToVtoTray = (item: CatalogItem) => {
    setVtoTrayItems((prev) => {
      if (prev.some((t) => t.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const handleRemoveFromVtoTray = (itemId: string) => {
    setVtoTrayItems((prev) => prev.filter((t) => t.id !== itemId));
  };

  // Callback triggered by AI Chatbot to filter Catalog Explorer grid dynamically!
  const handleAIRecommendationFilter = (filter: AIRecommendationFilter) => {
    if (filter.category) setCatalogCategory(filter.category);
    if (filter.maxPrice !== undefined) setCatalogMaxPrice(filter.maxPrice);
    if (filter.searchQuery !== undefined) setCatalogSearchQuery(filter.searchQuery);
    if (filter.recommendedIds) setRecommendedItemIds(filter.recommendedIds);
  };

  const handleClearAIFilters = () => {
    setCatalogCategory("all");
    setCatalogSearchQuery("");
    setCatalogMaxPrice(null);
    setRecommendedItemIds([]);
  };

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between selection:bg-sky-200 selection:text-sky-950">
      <div className="w-full">
        {/* Top Navigation Bar with Tab Switcher */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          vtoTrayCount={vtoTrayItems.length}
        />

        {/* TAB 1: Profile Setup */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <Header />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Area */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                <BodyMeasurements
                  measurements={measurements}
                  onChange={handleMeasurementChange}
                />

                <SeasonalPaletteSelector
                  selectedId={selectedPaletteId}
                  onSelect={setSelectedPaletteId}
                />

                <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 shadow-xl shadow-sky-100/60 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-5 py-3.5 rounded-2xl bg-[#FDFBF7] hover:bg-sky-50 border border-sky-200 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Default Dimensions
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSaveProfile();
                        setTimeout(() => {
                          setActiveTab("catalog");
                        }, 1200);
                      }}
                      disabled={isSaving}
                      className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-extrabold text-base shadow-xl shadow-sky-200/80 hover:shadow-sky-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer disabled:opacity-70"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Saving DNA Profile...</span>
                        </>
                      ) : (
                        <>
                          <span>Save Profile &amp; Continue →</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-sky-100/60 font-semibold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Encrypted Fit Data
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-600" /> Instant AI Match
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#90CDF4]" /> Zero Body Judgment Zone
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Live Preview */}
              <div className="lg:col-span-5 xl:col-span-4">
                <StylePreviewCard
                  measurements={measurements}
                  selectedPaletteId={selectedPaletteId}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Chat & Catalog (Screen 2 Split View) */}
        {activeTab === "catalog" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: AI Chatbot (40% width / 5 cols) */}
              <div className="lg:col-span-5">
                <AIChatbot
                  measurements={measurements}
                  selectedPaletteId={selectedPaletteId}
                  onApplyRecommendation={handleAIRecommendationFilter}
                />
              </div>

              {/* Right Side: Interactive Catalog Explorer (60% width / 7 cols) */}
              <div className="lg:col-span-7">
                <CatalogExplorer
                  vtoTrayItems={vtoTrayItems}
                  onAddToVtoTray={handleAddToVtoTray}
                  onRemoveFromVtoTray={handleRemoveFromVtoTray}
                  selectedCategory={catalogCategory}
                  onSelectCategory={setCatalogCategory}
                  searchQuery={catalogSearchQuery}
                  onSearchQueryChange={setCatalogSearchQuery}
                  maxPriceFilter={catalogMaxPrice}
                  onMaxPriceFilterChange={setCatalogMaxPrice}
                  recommendedItemIds={recommendedItemIds}
                  onClearAIFilters={handleClearAIFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VTO Studio (Screen 3 50% / 50% Split View) */}
        {activeTab === "vto" && (
          <div className="animate-in fade-in duration-300">
            <VTOStudio
              vtoTrayItems={vtoTrayItems}
              onAddToVtoTray={handleAddToVtoTray}
              onRemoveFromVtoTray={handleRemoveFromVtoTray}
              onGenerateComplete={() => setActiveTab("grade")}
              onGoToCatalog={() => setActiveTab("catalog")}
            />
          </div>
        )}

        {/* TAB 4: Style Grade (Screen 4 Personalized Scoring) */}
        {activeTab === "grade" && (
          <div className="animate-in fade-in duration-300">
            <StyleGrade
              measurements={measurements}
              selectedPaletteId={selectedPaletteId}
              vtoTrayItems={vtoTrayItems}
              onGoToCatalog={() => setActiveTab("catalog")}
              onGoToVTO={() => setActiveTab("vto")}
            />
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <SaveSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        measurements={measurements}
        selectedPaletteId={selectedPaletteId}
      />

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-sky-100 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
        <p>© 2026 LumiFit Intelligence. Next-Gen Style Curation Systems.</p>
        <div className="flex gap-4 text-slate-500">
          <a href="#" className="hover:text-sky-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-sky-600 transition-colors">Size Guide</a>
          <a href="#" className="hover:text-sky-600 transition-colors">AI Diagnostics</a>
        </div>
      </footer>
    </main>
  );
}
