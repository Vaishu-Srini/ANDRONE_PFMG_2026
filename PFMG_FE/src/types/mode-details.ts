// Type definitions for mode_details.json structure

import { JammerDetailsJson } from "./jammer-details";

export interface ModeDetailsJson {
  id: string;
  code: ModeCode;
  lastEdited: string; // e.g., "23 Jul'24 23:09"
  details: ModeMetaDetails;
  dispRangeEstimation:string; //enum EIRP
  ewParameters: EwParameters;
  scanDetails: ScanDetails;
  modeParams: ModeSpecificParameters;
  comments: string;
  jammingData: JammerDetailsJson;
}

interface ModeCode {
  symbolCodeType?: string; // e.g., "Old" | "New"
  selectSymbol?: string;
  alternateSymbol: string;
  fgColor: string; // hex color, e.g., #ffffff
  bgColor: string; // hex color, e.g., #F7B500
}

interface ModeMetaDetails {
  // Display details
  emitterName?: string;
  groundOnly?: boolean;
  isUnknown?: boolean;
  type: string; // e.g., "Search"
  location?: string;
  audioId?: string;
  description?: string;
  modeSubmode?: string;
  platformType?: string;
  threatType?: string;
  lethalRange?: number;
}

interface EwParameters {
  frequency: Frequency;
  pri: PRI;
  pulseWidth: PulseWidth;
}

interface MinMaxDeviation {
  min: number;
  max: number;
  deviation: number;
}

interface Frequency {
  freqType: string; // e.g., "Ex Type"
  frequencyClass?: string;
  frequencyTable: Array<MinMaxDeviation>;
}
interface PRI {
  priType: string; // e.g., "Type 3"
  priClass?: string;
  priTable: Array<MinMaxDeviation & { staggerLevel: number }>; // PRI entries have staggerLevel
}
interface PulseWidth {
  pwType: string; // e.g., "Type 1"
  pwClass?: string;
  pulseWidthTable: Array<MinMaxDeviation>;
}

interface ScanDetails {
  scanType: string; // e.g., "Not Calculated" | "Agile" | "Stable"
  minScanSector: number;
  maxScanSector: number;
  minScanRate: number;
  normalScanRate: number;
  sideLobeLevel: number;
  sideLobeStd: number;
  maxScanSection: number;
  maxScanRate: number;
  minTot: number;
  maxTot: number;
}

interface ModeSpecificParameters{
  testName: string;
  testTimeInterval: number;
  ageOut: number;
  priority: number;
  testType: string;
  powerLevel: number;
  pwTimeBase: number;
  pvMinSamples: number;
  pvMeasurementTime: string;
}
