// Type definitions for createJammer.json structure

export interface JammerDetailsJson {
  lastGenerated: string; // e.g., "23 Jul'24 23:09"
  techniques: Technique[];
  sequences: Sequence[];
}

export interface Technique {
  id: string; // e.g., "T1", "T2", "T3", "T4"
  name: string; // e.g., "Technique 1", "Technique 2"
}

export interface Sequence {
  id: string; // e.g., "Sequence_1", "Sequence_2"
  segments: Segment[];
}

export interface Segment {
  id: string; // e.g., "Segment_1", "Segment_2", "Segment_3"
  techniqueId: string; // References Technique.id
  cycleType: CycleType;
  probability: number; // Percentage (0-100)
  cycleCount: number;
  chart: ChartData;
}

export type CycleType = "Tech Cycle" | "Absolute Time";

export interface ChartData {
  x: number[]; // X-axis data points
  y: number[]; // Y-axis data points
}