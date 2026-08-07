import type { MeasurementState } from "@/components/BodyMeasurements";

export type BodyShape =
  | "Pear"
  | "Hourglass"
  | "Rectangle"
  | "Apple"
  | "Inverted Triangle";

export function calculateBodyShape(measurements: MeasurementState): BodyShape {
  const { bustIn, waistIn, hipsIn } = measurements;

  if (hipsIn <= 0 || waistIn <= 0) return "Hourglass";

  const waistToHip = waistIn / hipsIn;
  const waistToBust = waistIn / (bustIn || 1);

  if (waistToHip >= 0.85 && waistToBust >= 0.85) {
    return "Apple";
  }

  if (bustIn > hipsIn + 2) {
    return "Inverted Triangle";
  }

  if (hipsIn > bustIn + 2) {
    return "Pear";
  }

  if (waistToHip <= 0.8) {
    return "Hourglass";
  }

  return "Rectangle";
}
