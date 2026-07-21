"use client";

import React from "react";
import { Ruler, Maximize2, Activity, Sparkles } from "lucide-react";

export interface MeasurementState {
  heightCm: number;
  bustIn: number;
  waistIn: number;
  hipsIn: number;
}

interface BodyMeasurementsProps {
  measurements: MeasurementState;
  onChange: (key: keyof MeasurementState, val: number) => void;
}

const PRESETS = [
  { name: "Standard Hourglass", height: 168, bust: 36, waist: 27, hips: 38 },
  { name: "Athletic Build", height: 172, bust: 34, waist: 26, hips: 36 },
  { name: "Petite Balance", height: 158, bust: 33, waist: 25, hips: 35 },
  { name: "Curvy Elegance", height: 165, bust: 40, waist: 32, hips: 44 },
];

export const BodyMeasurements: React.FC<BodyMeasurementsProps> = ({
  measurements,
  onChange,
}) => {
  const fields = [
    {
      key: "heightCm" as const,
      label: "Height",
      unit: "cm",
      min: 120,
      max: 220,
      step: 1,
      icon: Ruler,
      description: "Base height for hem length & silhouette scaling",
    },
    {
      key: "bustIn" as const,
      label: "Bust / Chest",
      unit: "in",
      min: 24,
      max: 60,
      step: 0.5,
      icon: Activity,
      description: "Fullest point around bust or upper chest",
    },
    {
      key: "waistIn" as const,
      label: "Waist",
      unit: "in",
      min: 18,
      max: 56,
      step: 0.5,
      icon: Maximize2,
      description: "Narrowest natural waist circumference",
    },
    {
      key: "hipsIn" as const,
      label: "Hips",
      unit: "in",
      min: 24,
      max: 66,
      step: 0.5,
      icon: Maximize2,
      description: "Fullest circumference across hip bones",
    },
  ];

  const handleInputChange = (key: keyof MeasurementState, rawValue: string, min: number, max: number) => {
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed)) return;
    const clamped = Math.min(Math.max(parsed, min), max);
    onChange(key, clamped);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border border-sky-100/60 rounded-3xl p-6 sm:p-8 shadow-xl shadow-sky-100/50 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#90CDF4] to-[#A0C4FF] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              A
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Body Measurements</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Adjust sliders or enter numbers directly to refine your fit recommendations.
          </p>
        </div>

        {/* Dynamic ratio tag */}
        <div className="self-start sm:self-auto text-xs px-3.5 py-1.5 rounded-2xl bg-[#FEF08A]/80 border border-yellow-300 text-yellow-950 flex items-center gap-2 shadow-2xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-yellow-700" />
          <span>
            W/H Ratio: <strong className="text-sky-900 font-black">{(measurements.waistIn / (measurements.hipsIn || 1)).toFixed(2)}</strong>
          </span>
        </div>
      </div>

      {/* Preset Quick Select Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Quick Proportions Preset
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                onChange("heightCm", preset.height);
                onChange("bustIn", preset.bust);
                onChange("waistIn", preset.waist);
                onChange("hipsIn", preset.hips);
              }}
              className="text-xs py-2.5 px-3 rounded-2xl bg-[#FDFBF7] hover:bg-sky-50 border border-sky-100 hover:border-[#90CDF4] text-slate-700 hover:text-slate-900 font-semibold transition-all duration-200 text-center truncate shadow-2xs cursor-pointer"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-6 pt-2">
        {fields.map((field) => {
          const Icon = field.icon;
          const val = measurements[field.key];
          return (
            <div key={field.key} className="space-y-2 group">
              {/* Label + Active Numerical Value Display */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#90CDF4]" />
                  </div>
                  <span>{field.label}</span>
                </label>
                <div className="flex items-center gap-1.5 bg-sky-50/80 px-3 py-1.5 rounded-2xl border border-sky-200 text-sm font-extrabold text-sky-700 shadow-xs">
                  <input
                    type="number"
                    value={val}
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    onChange={(e) => handleInputChange(field.key, e.target.value, field.min, field.max)}
                    className="w-12 bg-transparent text-right focus:outline-none text-sky-800 font-black focus:bg-white rounded px-1 transition-colors"
                  />
                  <span className="text-slate-500 text-xs font-semibold">{field.unit}</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="relative pt-1">
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={val}
                  onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
                  className="w-full"
                  aria-label={field.label}
                />
                {/* Min / Max bounds indicator */}
                <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                  <span>{field.min} {field.unit}</span>
                  <span className="text-slate-500">{field.description}</span>
                  <span>{field.max} {field.unit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
