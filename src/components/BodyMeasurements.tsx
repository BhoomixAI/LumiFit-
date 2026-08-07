"use client";

import React, { useState, useEffect } from "react";
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
      min: 100,
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

  // Local state for free typing before clamp on blur
  const [localValues, setLocalValues] = useState<Record<keyof MeasurementState, string>>({
    heightCm: measurements.heightCm.toString(),
    bustIn: measurements.bustIn.toString(),
    waistIn: measurements.waistIn.toString(),
    hipsIn: measurements.hipsIn.toString(),
  });

  useEffect(() => {
    setLocalValues({
      heightCm: measurements.heightCm.toString(),
      bustIn: measurements.bustIn.toString(),
      waistIn: measurements.waistIn.toString(),
      hipsIn: measurements.hipsIn.toString(),
    });
  }, [measurements]);

  const handleStep = (key: keyof MeasurementState, step: number, min: number, max: number) => {
    const current = measurements[key];
    const nextVal = Math.min(Math.max(current + step, min), max);
    onChange(key, nextVal);
  };

  const handleTyping = (key: keyof MeasurementState, val: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: val }));
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      // Direct live update if it's within range
      onChange(key, parsed);
    }
  };

  const handleBlur = (key: keyof MeasurementState, min: number, max: number) => {
    const val = localValues[key];
    let parsed = parseFloat(val);
    if (isNaN(parsed)) {
      parsed = min;
    }
    const clamped = Math.min(Math.max(parsed, min), max);
    setLocalValues((prev) => ({ ...prev, [key]: clamped.toString() }));
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
            Enter values directly or click the increment controls to adjust your fit details.
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

      {/* Inputs List */}
      <div className="space-y-6 pt-2">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FDFBF7]/40 border border-sky-100/30 hover:border-sky-100 transition-all duration-300 group">
              {/* Label Info */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  <div className="w-7 h-7 rounded-xl bg-sky-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#90CDF4]" />
                  </div>
                  <span>{field.label}</span>
                </label>
                <p className="text-[11px] text-slate-400 font-medium pl-9">
                  {field.description} (Min: {field.min} / Max: {field.max})
                </p>
              </div>

              {/* Step Controls (Decrement, Direct Input, Increment) */}
              <div className="flex items-center gap-3 pl-9 sm:pl-0">
                <div className="flex items-center border border-sky-100 bg-white rounded-2xl overflow-hidden shadow-2xs focus-within:ring-2 focus-within:ring-[#90CDF4]/50 focus-within:border-[#90CDF4] transition-all">
                  {/* Decrement Button */}
                  <button
                    type="button"
                    onClick={() => handleStep(field.key, -field.step, field.min, field.max)}
                    className="w-11 h-11 flex items-center justify-center font-bold text-lg text-sky-600 hover:bg-sky-50 active:bg-sky-100/50 transition-colors border-r border-sky-100 cursor-pointer select-none"
                  >
                    &minus;
                  </button>

                  {/* Direct typing Number Input */}
                  <input
                    type="number"
                    value={localValues[field.key]}
                    onChange={(e) => handleTyping(field.key, e.target.value)}
                    onBlur={() => handleBlur(field.key, field.min, field.max)}
                    className="w-16 h-11 bg-white text-center text-slate-800 font-extrabold text-base focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  {/* Increment Button */}
                  <button
                    type="button"
                    onClick={() => handleStep(field.key, field.step, field.min, field.max)}
                    className="w-11 h-11 flex items-center justify-center font-bold text-lg text-sky-600 hover:bg-sky-50 active:bg-sky-100/50 transition-colors border-l border-sky-100 cursor-pointer select-none"
                  >
                    &#43;
                  </button>
                </div>
                <span className="text-slate-500 font-bold text-sm min-w-[20px]">{field.unit}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
