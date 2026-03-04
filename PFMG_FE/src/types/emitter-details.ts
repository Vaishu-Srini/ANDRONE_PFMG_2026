import { ModeDetailsJson } from "./mode-details";

interface EmitterDetailsJson {
    id: string;
    code: EmitterCode;
    lastEdited: string; // e.g., "23 Jul'24 23:09"
    details: EmitterMetaDetails;
    attachedModes: ModeDetailsJson[];
  }
  

  interface EmitterCode {
    symbolCodeType?: string; // e.g., "Old" | "New"
    selectSymbol?: string;
    alternateSymbol: string;
    fgColor: string; // hex color, e.g., #ffffff
    bgColor: string; // hex color, e.g., #F7B500
  }

  interface EmitterMetaDetails {
    // Display details
    emitterName?: string;
    groundOnly?: boolean;
    isUnknown?: boolean;
    type: string; // e.g., "Search"
    location?: string;
    audioId?: string;
    description?: string;
  }