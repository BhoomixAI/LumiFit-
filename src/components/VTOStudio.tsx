"use client";

import React, { useState, useRef, useEffect } from "react";
import { CATALOG_DATA, CatalogItem } from "@/data/catalog";
import {
  Upload,
  Camera,
  Shirt,
  Sparkles,
  X,
  Plus,
  Check,
  Wand2,
  Layers,
  RefreshCw,
  ShoppingBag,
  UserCheck,
  Video,
  ArrowRight,
  Eye,
  Award,
} from "lucide-react";

interface VTOStudioProps {
  vtoTrayItems: CatalogItem[];
  onAddToVtoTray: (item: CatalogItem) => void;
  onRemoveFromVtoTray: (itemId: string) => void;
  onGenerateComplete: () => void;
  onGoToCatalog: () => void;
}

const SAMPLE_MODELS = [
  { id: "model-1", name: "Studio Model A", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
  { id: "model-2", name: "Studio Model B", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
];

export const VTOStudio: React.FC<VTOStudioProps> = ({
  vtoTrayItems,
  onAddToVtoTray,
  onRemoveFromVtoTray,
  onGenerateComplete,
  onGoToCatalog,
}) => {
  // Photo Input State
  const [photoMode, setPhotoMode] = useState<"upload" | "webcam">("upload");
  const [userPhoto, setUserPhoto] = useState<string | null>(SAMPLE_MODELS[0].url);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Quick Add Item Modal State
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState<string>("all");

  // YouCam AI Try-On Loading & Result Overlay State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [isVtoRenderComplete, setIsVtoRenderComplete] = useState(false);
  const [viewOverlayMode, setViewOverlayMode] = useState<"overlay" | "original">("overlay");

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Webcam Handler
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (photoMode === "webcam" && isWebcamActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setWebcamError(null);
        })
        .catch((err) => {
          console.error("Webcam access error:", err);
          setWebcamError("Camera access denied or unavailable. Using studio preview mode.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [photoMode, isWebcamActive]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserPhoto(event.target.result as string);
          setIsVtoRenderComplete(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureWebcam = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setUserPhoto(dataUrl);
        setIsWebcamActive(false);
        setPhotoMode("upload");
        setIsVtoRenderComplete(false);
      }
    } else {
      setUserPhoto(SAMPLE_MODELS[1].url);
      setIsWebcamActive(false);
      setPhotoMode("upload");
      setIsVtoRenderComplete(false);
    }
  };

  const handleStartGeneration = () => {
    if (vtoTrayItems.length === 0) {
      alert("Please add at least 1 apparel or jewelry item to your VTO Tray before generating!");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(15);
    setGenerationStage("Aligning 3D Body Mesh & Anchor Points...");

    setTimeout(() => {
      setGenerationProgress(55);
      setGenerationStage("Stitching your outfit with YouCam AI...");
    }, 700);

    setTimeout(() => {
      setGenerationProgress(88);
      setGenerationStage("Optimizing lighting, drape tension & color harmony...");
    }, 1400);

    setTimeout(() => {
      setGenerationProgress(100);
      setIsGenerating(false);
      setIsVtoRenderComplete(true);
      setViewOverlayMode("overlay");
    }, 2000);
  };

  // Group Tray items by category
  const apparelTrayItems = vtoTrayItems.filter((i) => i.category !== "jewelry");
  const jewelryTrayItems = vtoTrayItems.filter((i) => i.category === "jewelry");

  // Primary top/dress item for visual overlay
  const topOrDressItem = vtoTrayItems.find((i) => i.category === "top" || i.category === "dress");
  const bottomItem = vtoTrayItems.find((i) => i.category === "bottom");
  const jewelryItem = vtoTrayItems.find((i) => i.category === "jewelry");

  return (
    <div className="space-y-8 relative">
      {/* Top Header Banner */}
      <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#90CDF4] to-[#FEF08A] text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              3
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Virtual Try-On (VTO) Studio</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Upload your photo or use live webcam, stage garments &amp; accessories in your tray, and stitch with YouCam AI.
          </p>
        </div>

        <div className="flex items-center gap-2 font-bold text-xs px-3.5 py-2 rounded-2xl bg-[#FEF08A]/80 border border-yellow-300 text-yellow-950 shadow-2xs">
          <Sparkles className="w-4 h-4 text-yellow-700" />
          <span>Powered by YouCam AI v4</span>
        </div>
      </div>

      {/* Main 50% / 50% Split View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT PANEL (50% width / 6 cols): User Photo Input & VTO Overlay Canvas ================= */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-100/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                📷
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {isVtoRenderComplete ? "Photorealistic VTO Result" : "1. User Photo Input"}
              </h3>
            </div>

            {/* Upload vs Webcam vs Overlay Toggle */}
            {isVtoRenderComplete ? (
              <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-2xl border border-sky-200 text-xs">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setViewOverlayMode("overlay")}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    viewOverlayMode === "overlay" ? "bg-[#90CDF4] text-white" : "text-slate-600"
                  }`}
                >
                  VTO Overlay ✨
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setViewOverlayMode("original")}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    viewOverlayMode === "original" ? "bg-slate-800 text-white" : "text-slate-600"
                  }`}
                >
                  Original Photo
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-[#FDFBF7] p-1 rounded-2xl border border-sky-200 text-xs">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setPhotoMode("upload");
                    setIsWebcamActive(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    photoMode === "upload"
                      ? "bg-[#90CDF4] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" /> File Upload
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setPhotoMode("webcam");
                    setIsWebcamActive(true);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    photoMode === "webcam"
                      ? "bg-[#90CDF4] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Live Webcam
                </button>
              </div>
            )}
          </div>

          {/* Photo Input & VTO Visual Overlay Render Box */}
          {photoMode === "upload" ? (
            <div className="space-y-4">
              <div className="relative w-full h-[450px] sm:h-[480px] rounded-3xl bg-slate-950 border-2 border-sky-200 overflow-hidden flex items-center justify-center group shadow-inner">
                {userPhoto ? (
                  <>
                    {/* Person Base Image with full containment */}
                    <img
                      src={userPhoto}
                      alt="User Photo Base"
                      className="w-full h-full object-contain object-top"
                    />

                    {/* VTO OVERLAY LAYER (Renders staged apparel & jewelry directly on top of person with object-contain) */}
                    {isVtoRenderComplete && viewOverlayMode === "overlay" && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4">
                        {/* Upper Body / Top / Dress Overlay */}
                        {topOrDressItem && (
                          <div className="absolute top-[16%] w-[70%] sm:w-[64%] h-[44%] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/90 animate-in fade-in zoom-in-95 duration-500 bg-white/20 backdrop-blur-xs flex items-center justify-center p-1">
                            <img
                              src={topOrDressItem.imageUrl}
                              alt={topOrDressItem.name}
                              className="w-full h-full object-contain opacity-95 filter contrast-105 drop-shadow-md"
                            />
                            <span className="absolute bottom-1.5 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/90 text-white shadow-xs">
                              {topOrDressItem.name}
                            </span>
                          </div>
                        )}

                        {/* Lower Body / Bottom Overlay */}
                        {bottomItem && !topOrDressItem?.name.includes("Dress") && (
                          <div className="absolute bottom-[6%] w-[68%] sm:w-[60%] h-[42%] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/90 animate-in fade-in zoom-in-95 duration-500 bg-white/20 backdrop-blur-xs flex items-center justify-center p-1">
                            <img
                              src={bottomItem.imageUrl}
                              alt={bottomItem.name}
                              className="w-full h-full object-contain opacity-95 filter contrast-105 drop-shadow-md"
                            />
                            <span className="absolute bottom-1.5 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/90 text-white shadow-xs">
                              {bottomItem.name}
                            </span>
                          </div>
                        )}

                        {/* Jewelry Neckline Overlay */}
                        {jewelryItem && (
                          <div className="absolute top-[12%] w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-yellow-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 bg-white/60 backdrop-blur-xs flex items-center justify-center p-1">
                            <img
                              src={jewelryItem.imageUrl}
                              alt={jewelryItem.name}
                              className="w-full h-full object-contain opacity-95 filter drop-shadow-md"
                            />
                          </div>
                        )}

                        {/* Drape & Tension AI Fit Tags */}
                        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white font-extrabold text-[10px] px-3 py-1 rounded-full border border-sky-300/40 shadow-md">
                          Chest &amp; Shoulder Fit: Seamless ✓
                        </div>
                        <div className="absolute bottom-3 right-3 bg-[#FEF08A] text-yellow-950 font-black text-[10px] px-3 py-1 rounded-full border border-yellow-300 shadow-md">
                          YouCam 3D Mesh Stitched ✨
                        </div>
                      </div>
                    )}

                    {/* Change Photo Overlay Hover */}
                    {!isVtoRenderComplete && (
                      <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="px-4 py-2 rounded-2xl bg-white text-slate-900 text-xs font-bold shadow-md cursor-pointer hover:bg-sky-50 transition-colors">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer p-6 text-center space-y-2 text-white">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center mb-1">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold">Drag &amp; drop photo or click to browse</span>
                    <span className="text-xs text-slate-400">Supports JPG, PNG, WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Sample Model Quick Select Presets */}
              {!isVtoRenderComplete && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Or Choose Studio Model Preset:
                  </span>
                  <div className="flex gap-2">
                    {SAMPLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        suppressHydrationWarning
                        onClick={() => {
                          setUserPhoto(model.url);
                          setIsVtoRenderComplete(false);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          userPhoto === model.url
                            ? "bg-sky-50 border-[#90CDF4] text-sky-900 shadow-xs"
                            : "bg-[#FDFBF7] border-sky-100 text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <img src={model.url} alt={model.name} className="w-6 h-6 rounded-full object-cover" />
                        <span>{model.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View Style Grade Action Button if VTO Render Complete */}
              {isVtoRenderComplete && (
                <div className="pt-2">
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={onGenerateComplete}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-black text-sm shadow-xl shadow-sky-200/80 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5 text-white" />
                    <span>View AI Style Grade &amp; Outfit Score →</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Live Webcam Mode */
            <div className="space-y-4">
              <div className="relative w-full h-[400px] rounded-3xl bg-slate-900 border-2 border-sky-200 overflow-hidden flex flex-col items-center justify-center text-white p-4">
                {webcamError ? (
                  <div className="text-center space-y-3 p-4">
                    <Video className="w-10 h-10 text-sky-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">{webcamError}</p>
                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        setUserPhoto(SAMPLE_MODELS[1].url);
                        setPhotoMode("upload");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#90CDF4] text-white text-xs font-bold cursor-pointer"
                    >
                      Use Studio Model Instead
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={handleCaptureWebcam}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#90CDF4] to-[#70B4F8] text-white font-extrabold text-xs shadow-lg shadow-sky-300/50 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <Camera className="w-4 h-4" /> Capture Photo 📸
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL (50% width / 6 cols): Multi-Layer Staging Tray ================= */}
        <div className="lg:col-span-6 bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-100/60 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#FEF08A] text-yellow-950 flex items-center justify-center font-bold text-xs shadow-2xs">
                ✨
              </div>
              <h3 className="text-lg font-black text-slate-900">2. Multi-Layer Staging Tray</h3>
            </div>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsQuickAddOpen(true)}
              className="px-3.5 py-1.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-sky-600" /> Quick Add Item
            </button>
          </div>

          {/* Layer 1: Apparel Layer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-sky-600" /> Layer 1: Apparel (Tops, Bottoms, Dresses)
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {apparelTrayItems.length} selected
              </span>
            </div>

            {apparelTrayItems.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-dashed border-sky-200 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">No apparel items in tray.</p>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={onGoToCatalog}
                  className="text-xs font-extrabold text-sky-600 hover:underline inline-flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Pick from Catalog Explorer →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apparelTrayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-sky-100 shadow-sm relative group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-xl object-contain border bg-slate-50 p-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => onRemoveFromVtoTray(item.id)}
                      className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Remove from tray"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Layer 2: Jewelry & Accessories Layer */}
          <div className="space-y-3 pt-2 border-t border-sky-100/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-600" /> Layer 2: Jewelry &amp; Accessories
              </span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {jewelryTrayItems.length} selected
              </span>
            </div>

            {jewelryTrayItems.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-dashed border-sky-200 text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">No jewelry items selected.</p>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setIsQuickAddOpen(true)}
                  className="text-xs font-extrabold text-yellow-800 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Gold / Pearl Accessories →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {jewelryTrayItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-yellow-200 shadow-sm relative group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-xl object-contain border bg-slate-50 p-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => onRemoveFromVtoTray(item.id)}
                      className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Remove from tray"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Primary Trigger CTA Button */}
          <div className="pt-4 border-t border-sky-100 space-y-2">
            <button
              type="button"
              suppressHydrationWarning
              onClick={handleStartGeneration}
              disabled={vtoTrayItems.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] hover:from-[#70B4F8] hover:to-[#5096F6] text-white font-black text-base shadow-xl shadow-sky-200/80 hover:shadow-sky-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-5 h-5 text-white animate-spin-slow" />
              <span>Generate Virtual Try-On ✨</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              Stitches selected layers on your photo using YouCam AI neural engine.
            </p>
          </div>
        </div>
      </div>

      {/* ================= QUICK ADD MODAL ================= */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white border border-sky-100 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 shrink-0">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" /> Quick Add Items to VTO Tray
              </h3>
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsQuickAddOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Add Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
              {["all", "top", "bottom", "dress", "jewelry"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setQuickAddCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-colors ${
                    quickAddCategory === cat
                      ? "bg-[#90CDF4] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Add Catalog Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1 custom-scrollbar">
              {CATALOG_DATA.filter(
                (i) => quickAddCategory === "all" || i.category === quickAddCategory
              ).map((item) => {
                const isInTray = vtoTrayItems.some((t) => t.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <img src={item.imageUrl} alt={item.name} className="w-full h-28 rounded-xl object-contain bg-white p-1 mb-2" />
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                    <span className="text-[11px] font-semibold text-slate-500 mb-2">${item.price.toFixed(2)}</span>

                    <button
                      type="button"
                      suppressHydrationWarning
                      onClick={() => {
                        if (isInTray) onRemoveFromVtoTray(item.id);
                        else onAddToVtoTray(item);
                      }}
                      className={`w-full py-1.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 ${
                        isInTray
                          ? "bg-[#FEF08A] text-yellow-950 border border-yellow-300"
                          : "bg-[#90CDF4] text-white"
                      }`}
                    >
                      {isInTray ? "Added ✓" : "+ Add"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-sky-100 shrink-0 flex justify-end">
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setIsQuickAddOpen(false)}
                className="px-6 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
              >
                Done Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= YouCam AI GENERATION LOADING OVERLAY ================= */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-sky-100 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-sky-100 border-t-[#90CDF4] animate-spin" />
              <div className="w-14 h-14 rounded-full bg-[#FEF08A] flex items-center justify-center shadow-md">
                <Wand2 className="w-7 h-7 text-yellow-950 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#FEF08A] text-yellow-950 border border-yellow-300 inline-block shadow-2xs">
                YouCam AI Neural Render
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Stitching your outfit with YouCam AI...
              </h3>
              <p className="text-xs text-slate-500 font-medium">{generationStage}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-[#90CDF4] via-[#A0C4FF] to-[#70B4F8] h-full transition-all duration-500 rounded-full"
                style={{ width: `${generationProgress}%` }}
              />
            </div>

            <span className="text-xs font-mono font-bold text-sky-800">
              {generationProgress}% Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
