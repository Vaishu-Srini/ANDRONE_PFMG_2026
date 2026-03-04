export const BASE_URL = "http://localhost:5058/api/";

// -------- Mission Save --------
export async function saveMission(data) {
  const payload = {
    MissionId: 0,
    MissionName: data.missionName,
    MissionDate: new Date().toISOString().replace("Z", ""),
    MissionType: data.missionType,
    Description: data.description,
    UserId: 0,
    Status: "DRAFT",
  };

  try {
    console.log("Payload being sent to Mission API:", payload);

    const response = await fetch(`${BASE_URL}Mission/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("Mission API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to save mission: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in saveMission:", error);
    throw error;
  }
}

// -------- Platform Save --------
// export async function savePlatform(data, missionId) {
//   const isUpdate = data.platformId && data.platformId > 0;

//   const payload = {
//     platformId: isUpdate ? data.platformId : 0,
//     platformName: data.platformName,
//     threatType: data.threatType,
//     priority: data.priority,
//     displayStatus: data.displayStatus,
//     symbolCodeType: data.symbolCodeType,
//     alternateSymbol: data.alternateSymbol,
//     foreGroundColor: data.foreGroundColor,
//     backGroundColor: data.backGroundColor,
//     description: data.description,
//     thumbnailImage: "U29tZUF1ZGlvRGF0YQ==",
//     previewSymbol: "U29tZUF1ZGlvRGF0YQ==",
//     createdAt: new Date().toISOString().replace("Z", ""),
//     missionId: missionId, //  dynamically set, no hardcoding
//     userId: 501,
//   };

//   try {
//     console.log("Payload being sent to Platform API:", payload);

//     const response = await fetch(`${BASE_URL}Platform/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const responseData = await response.json();
//     console.log("Platform API response:", responseData);

//     if (!response.ok) {
//       throw new Error(
//         `Failed to save platform: ${JSON.stringify(responseData)}`
//       );
//     }

//     return responseData;
//   } catch (error) {
//     console.error("Error in savePlatform:", error);
//     throw error;
//   }
// }

// -------- Emitter Save --------

export async function saveEmitter(data) {
  const payload = {
    emitterId: Number(data.emitterId) || 0,
    weaponId: Number(data.weaponId) || 0,
    emitterName: data.emitterName,
    description: data.description || "",
    emitterType: data.type || "GROUND",
    symbol: data.symbol || "NEW",
    foregroundColor: data.foregroundColor || "#FF5733",
    backgroundColor: data.backgroundColor || "#C0C0C0",
    isUnknown: Boolean(data.isUnknown),
    isGroundOnly: Boolean(data.isGroundOnly),
    createdBy: "string",
    modifiedBy: "string",
    createdDate: null,
    modifiedDate: null,
    latitude: String(data.latitude || "0.0"),
    longitude: String(data.longitude || "0.0"),
  };

  try {
    const response = await fetch(`${BASE_URL}Emitter/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("API Error:", responseData);
      throw new Error(
        `Save failed: ${JSON.stringify(responseData.errors || responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in saveEmitter:", error);
    throw error;
  }
}

export async function saveMode(form, emitterId) {
  try {
    console.log("Raw form data:", form);

    /* ----------- 1) SAFE ROW MAPPERS (id always INT=0) ----------- */
    const mapFrequencyRow = (row) => ({
      id: 0, // FIX: backend requires integer, do NOT send timestamp
      minFrequency: Number(row.minFrequency || 0),
      maxFrequency: Number(row.maxFrequency || 0),
      frequencyStaggerLevel: Number(row.frequencyStaggerLevel || 0),
      frequencyJitterMean: Number(row.frequencyJitterMean || 0),
      frequencyJitterPercentage: Number(row.frequencyJitterPercentage || 0),
    });

    const mapPriRow = (row) => ({
      id: 0,
      minPri: Number(row.minPri || 0),
      maxPri: Number(row.maxPri || 0),
      priStaggerLevel: Number(row.priStaggerLevel || 0),
      priJitterMean: Number(row.priJitterMean || 0),
      priJitterPercentage: Number(row.priJitterPercentage || 0),
    });

    const mapPwRow = (row) => ({
      id: 0,
      minPw: Number(row.minPw || 0),
      maxPw: Number(row.maxPw || 0),
      pwStaggerLevel: Number(row.pwStaggerLevel || 0),
      pwJitterMean: Number(row.pwJitterMean || 0),
      pwJitterPercentage: Number(row.pwJitterPercentage || 0),
    });

    /* -------------------------------------------------------------
       2) MAIN PAYLOAD (EXACT BACKEND MATCH)
    ------------------------------------------------------------- */
    const payload = {
      modeId: Number(form.modeId) || 0,
      modeName: form.modeName,
      description: form.description,
      modeType: form.modeType,
      platformType: form.platformType,
      subMode: form.subModeType,
      threatType: form.threatType,
      testType: form.modeTestType,

      priStaggerLevel: Number(form.priStaggerLevel || 0),

      symbolCodeType: 1,
      modeSymbol: form.modeSymbol,
      bgColor: form.backgroundColor,
      fgColor: form.foregroundColor,

      eirpValue: Number(form.eirpValue || 0),
      lethalRange: Number(form.lethalRange || 0),
      groundOnly: form.groundOnly,

      rangeEstimation: form.diskRangeEstimation,
      emitterId: Number(emitterId),

      frequencyType: form.frequencyType,
      frequencyClass: form.frequencyClass,
      priType: form.priType,
      priClass: form.priClass,
      pwType: form.pwType,
      pwClass: form.pwClass,

      modeFrequencyDetails: (form.frequencyTables || []).map(mapFrequencyRow),
      modePriDetails: (form.priTables || []).map(mapPriRow),
      modePwDetails: (form.pwTables || []).map(mapPwRow),

      modeScanDetails: [
        {
          id: 0,
          scanType: form.scanType,
          minScanSector: Number(form.minScanSector),
          maxScanSector: Number(form.maxScanSector),
          minScanRate: Number(form.minScanRate),
          maxScanRate: Number(form.maxScanRate),
          nominalScanRate: Number(form.normalScanRate),
          sideLobeLevel: Number(form.sideLobeLevel),
          sideLobeStd: Number(form.sideLobeStd),
          minBeamWidth: Number(form.minBeamWidth),
          maxBeamWidth: Number(form.maxBeamWidth),
          calculatedTot: form.calculateTot ? 1 : 0,
          minTot: Number(form.minTot),
          maxTot: Number(form.maxTot),
        },
      ],

      createdBy: "ADMIN",
      modifiedBy: "ADMIN",
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    console.log("FINAL PAYLOAD SENT TO API:", payload);

    /* ---------------- API CALL ---------------- */
    const response = await fetch(`${BASE_URL}Mode/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    console.log("Mode API Response:", json);

    if (!response.ok) {
      throw new Error(json.message || "Mode save failed");
    }

    return json;
  } catch (err) {
    console.error("saveMode ERROR:", err);
    throw err;
  }
}

export async function saveStandaloneMode(form, emitterIdFromCaller) {
  try {
    console.log("Raw form data:", form);

    /* -----------------------------------------
       0) EMITTER ID AUTO-RESOLUTION
    ----------------------------------------- */
    const queryEmitterId = Number(
      new URLSearchParams(window.location.search).get("emitterId"),
    );

    const resolvedEmitterId =
      Number(emitterIdFromCaller) ||
      Number(form?.emitterId) ||
      queryEmitterId ||
      0;

    if (!resolvedEmitterId) {
      console.warn("emitterId could not be resolved. Backend MAY reject.");
    }

    /* -----------------------------------------
       1) SAFE ROW MAPPERS
       (id MUST be 0 because backend only accepts INT32)
    ----------------------------------------- */
    const mapFrequencyRow = (row) => ({
      id: 0,
      minFrequency: Number(row.minFrequency || 0),
      maxFrequency: Number(row.maxFrequency || 0),
      frequencyStaggerLevel: Number(row.frequencyStaggerLevel || 0),
      frequencyJitterMean: Number(row.frequencyJitterMean || 0),
      frequencyJitterPercentage: Number(row.frequencyJitterPercentage || 0),
    });

    const mapPriRow = (row) => ({
      id: 0,
      minPri: Number(row.minPri || 0),
      maxPri: Number(row.maxPri || 0),
      priStaggerLevel: Number(row.priStaggerLevel || 0),
      priJitterMean: Number(row.priJitterMean || 0),
      priJitterPercentage: Number(row.priJitterPercentage || 0),
    });

    const mapPwRow = (row) => ({
      id: 0,
      minPw: Number(row.minPw || 0),
      maxPw: Number(row.maxPw || 0),
      pwStaggerLevel: Number(row.pwStaggerLevel || 0),
      pwJitterMean: Number(row.pwJitterMean || 0),
      pwJitterPercentage: Number(row.pwJitterPercentage || 0),
    });

    /* -----------------------------------------
       FINAL PAYLOAD (backend EXACT format)
    ----------------------------------------- */
    const payload = {
      modeId: Number(form.modeId) || 0,
      modeName: form.modeName,
      description: form.description,
      modeType: form.modeType,
      platformType: form.platformType,
      subMode: form.subModeType,
      threatType: form.threatType,
      testType: form.modeTestType,

      priStaggerLevel: Number(form.priStaggerLevel || 0),

      symbolCodeType: 1,
      modeSymbol: form.modeSymbol,
      bgColor: form.backgroundColor,
      fgColor: form.foregroundColor,

      eirpValue: Number(form.eirpValue || 0),
      lethalRange: Number(form.lethalRange || 0),
      groundOnly: form.groundOnly ?? false,

      rangeEstimation: form.diskRangeEstimation,

      emitterId: resolvedEmitterId,

      frequencyType: form.frequencyType,
      frequencyClass: form.frequencyClass,
      priType: form.priType,
      priClass: form.priClass,
      pwType: form.pwType,
      pwClass: form.pwClass,

      modeFrequencyDetails: (form.frequencyTables || []).map(mapFrequencyRow),
      modePriDetails: (form.priTables || []).map(mapPriRow),
      modePwDetails: (form.pwTables || []).map(mapPwRow),

      modeScanDetails: [
        {
          id: 0,
          scanType: form.scanType,
          minScanSector: Number(form.minScanSector),
          maxScanSector: Number(form.maxScanSector),
          minScanRate: Number(form.minScanRate),
          maxScanRate: Number(form.maxScanRate),
          nominalScanRate: Number(form.normalScanRate),
          sideLobeLevel: Number(form.sideLobeLevel),
          sideLobeStd: Number(form.sideLobeStd),
          minBeamWidth: Number(form.minBeamWidth),
          maxBeamWidth: Number(form.maxBeamWidth),
          calculatedTot: form.calculateTot ? 1 : 0,
          minTot: Number(form.minTot),
          maxTot: Number(form.maxTot),
        },
      ],

      createdBy: "ADMIN",
      modifiedBy: "ADMIN",
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    console.log("FINAL Independent Mode Payload →", payload);

    /* -----------------------------------------
       3) API CALL
    ----------------------------------------- */
    const url = ` ${BASE_URL}Mode/standalone/save `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Independent Mode save failed → ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in saveIndependentMode:", error);
    throw error;
  }
}

function getStrictModeIdFromUrl() {
  const hash = window.location.hash;

  // Must be exact route
  if (!hash.startsWith("#/mission-creation?")) return 0;

  // Extract query part
  const queryString = hash.slice("#/mission-creation?".length);

  // STRICT regex match (EXACT order, EXACT params)
  const strictPattern = /^modeId=(\d+)&component=mode$/;

  const match = queryString.match(strictPattern);
  if (!match) return 0;

  // Guaranteed numeric modeId
  return Number(match[1]) || 0;
}

export async function saveIndependentMode(form) {
  try {
    console.log("Raw form data:", form);

    const modeIdFromUrl = getStrictModeIdFromUrl();
    const mapFrequencyRow = (row) => ({
      id: 0,
      minFrequency: Number(row?.minFrequency || 0),
      maxFrequency: Number(row?.maxFrequency || 0),
      frequencyStaggerLevel: Number(row?.frequencyStaggerLevel || 0),
      frequencyJitterMean: Number(row?.frequencyJitterMean || 0),
      frequencyJitterPercentage: Number(row?.frequencyJitterPercentage || 0),
    });

    const mapPriRow = (row) => ({
      id: 0,
      minPri: Number(row?.minPri || 0),
      maxPri: Number(row?.maxPri || 0),
      priStaggerLevel: Number(row?.priStaggerLevel || 0),
      priJitterMean: Number(row?.priJitterMean || 0),
      priJitterPercentage: Number(row?.priJitterPercentage || 0),
    });

    const mapPwRow = (row) => ({
      id: 0,
      minPw: Number(row?.minPw || 0),
      maxPw: Number(row?.maxPw || 0),
      pwStaggerLevel: Number(row?.pwStaggerLevel || 0),
      pwJitterMean: Number(row?.pwJitterMean || 0),
      pwJitterPercentage: Number(row?.pwJitterPercentage || 0),
    });

    const payload = {
      modeId: modeIdFromUrl, // ONLY from URL, else 0

      modeName: form.modeName,
      description: form.description,
      modeType: form.modeType,
      platformType: form.platformType,
      subMode: form.subModeType,
      threatType: form.threatType,
      testType: form.modeTestType,

      priStaggerLevel: Number(form.priStaggerLevel || 0),

      symbolCodeType: 1,
      modeSymbol: form.modeSymbol,
      bgColor: form.backgroundColor,
      fgColor: form.foregroundColor,

      eirpValue: Number(form.eirpValue || 0),
      lethalRange: Number(form.lethalRange || 0),

      groundOnly: form.groundOnly ?? false,
      rangeEstimation: form.diskRangeEstimation,

      frequencyType: form.frequencyType,
      frequencyClass: form.frequencyClass,
      priType: form.priType,
      priClass: form.priClass,
      pwType: form.pwType,
      pwClass: form.pwClass,

      modeFrequencyDetails: (form.frequencyTables || []).map(mapFrequencyRow),
      modePriDetails: (form.priTables || []).map(mapPriRow),
      modePwDetails: (form.pwTables || []).map(mapPwRow),

      modeScanDetails: [
        {
          id: 0,
          scanType: form.scanType,
          minScanSector: Number(form.minScanSector || 0),
          maxScanSector: Number(form.maxScanSector || 0),
          minScanRate: Number(form.minScanRate || 0),
          maxScanRate: Number(form.maxScanRate || 0),
          nominalScanRate: Number(form.normalScanRate || 0),
          sideLobeLevel: Number(form.sideLobeLevel || 0),
          sideLobeStd: Number(form.sideLobeStd || 0),
          minBeamWidth: Number(form.minBeamWidth || 0),
          maxBeamWidth: Number(form.maxBeamWidth || 0),
          calculatedTot: form.calculateTot ? 1 : 0,
          minTot: Number(form.minTot || 0),
          maxTot: Number(form.maxTot || 0),
        },
      ],

      createdBy: "ADMIN",
      modifiedBy: "ADMIN",
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    console.log("FINAL Independent Mode Payload →", payload);

    const url = `${BASE_URL}Mode/independent/save`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Independent Mode save failed → ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in saveIndependentMode:", error);
    throw error;
  }
}

export async function fetchPlatformTree(platformId) {
  try {
    console.log(`Fetching platform tree for ID: ${platformId}`);

    const response = await fetch(`${BASE_URL}Platform/tree/${platformId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // Add this header to skip ngrok browser warning
      },
    });

    const responseData = await response.json();
    console.log("Platform Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch platform tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in fetchPlatformTree:", error);
    throw error;
  }
}

export async function fetchMissionTree(missionId) {
  try {
    console.log(`Fetching mission tree for ID: ${missionId}`);

    const response = await fetch(`${BASE_URL}Mission/tree/${missionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log("Mission Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch mission tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error("Error in fetchMissionTree:", error);
    throw error;
  }
}

export async function fetchEmitterTree(emitterId) {
  try {
    const response = await fetch(`${BASE_URL}Emitter/tree/${emitterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log("emitter Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch emitter tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

export async function fetchEmitterStandloneTree(emitterId) {
  try {
    const response = await fetch(
      `${BASE_URL}Emitter/standalone-tree/${emitterId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const responseData = await response.json();
    console.log("emitter Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch emitter tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

export async function fetchModeTree(modeId) {
  try {
    const response = await fetch(`${BASE_URL}Mode/mode-tree/${modeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log("mode Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch mode tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

export async function fetchModeIndependentTree(modeId) {
  try {
    const response = await fetch(`${BASE_URL}Mode/independent-tree/${modeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log("mode Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch mode tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

export async function fetchJammingTree(jammingId) {
  try {
    const response = await fetch(`${BASE_URL}Jamming/${jammingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    console.log("Jamming Tree API response:", responseData);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Jamming tree: ${JSON.stringify(responseData)}`,
      );
    }

    return responseData;
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
}

// -------- Mission Delete --------
export async function deleteMission(missionId) {
  try {
    console.log(`Deleting mission with ID: ${missionId}`);

    const response = await fetch(`${BASE_URL}Mission/${missionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    // Handle response safely (some APIs return empty body)
    const text = await response.text();
    const responseData = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(
        `Failed to delete mission: ${JSON.stringify(responseData)}`,
      );
    }

    console.log("Mission deleted successfully:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error in deleteMission:", error);
    throw error;
  }
}

// -------- Generate PFM File (Download CSV) --------
export async function generatePfmFile(missionId) {
  try {
    console.log(`Generating PFM file for mission ID: ${missionId}`);

    const response = await fetch(`${BASE_URL}Pfm/pfm-generation/${missionId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to generate PFM file: ${response.statusText}`);
    }

    // Extract filename from headers if available
    const contentDisposition = response.headers.get("content-disposition");
    const filenameMatch = new RegExp(/filename="?([^"]+)"?/).exec(
      contentDisposition,
    );
    // const filenameMatch =
    // contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);

    const filename = filenameMatch
      ? filenameMatch[1]
      : `mission_${missionId}.csv`;

    // Convert response to blob and trigger browser download
    const blob = await response.blob();
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    globalThis.URL.revokeObjectURL(url);

    console.log("PFM file downloaded:", filename);
    return filename;
  } catch (error) {
    console.error("Error generating/downloading PFM file:", error);
    throw error;
  }
}

// -------- Weapon Save (minimal backend format) --------
export async function saveWeapon(data) {
  //  Construct payload from form data
  const payload = {
    weaponId: Number(data.weaponId) || 0,
    weaponName: data.weaponName,
    weaponDate: new Date().toISOString(),
    description: data.description,
    threatType: data.type,
    foreGroundColor: data.foregroundColor,
    backGroundColor: data.backgroundColor,
    symbol: data.weaponSymbol,
    displayStatus: data.displayStatus,
    priority: Number(data.priority),
    createdBy: "Current User",
    createdDate: new Date().toISOString(),
    modifiedBy: "Another User",
    modifiedDate: new Date().toISOString(),
  };

  console.log("Weapon payload being sent to API:", payload);

  try {
    // Send payload to API
    const response = await fetch(`${BASE_URL}Weapon/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    //  Parse JSON response
    const responseData = await response.json();
    console.log(" Weapon API response:", responseData);

    //  Handle both HTTP and custom backend success cases
    if (!response.ok && responseData.statusCode !== 200) {
      console.error(" Weapon save failed:", responseData);
      throw new Error(
        responseData.message ||
          `Failed to save weapon: ${JSON.stringify(responseData)}`,
      );
    }

    console.log("Weapon saved/updated successfully!");
    return responseData;
  } catch (error) {
    console.error(" Error in saveWeapon():", error);
    throw error;
  }
}

export async function fetchWeaponTree(weaponId) {
  try {
    const response = await fetch(`${BASE_URL}Weapon/tree/${weaponId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(`Failed to fetch weapon tree: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("Error in fetchWeaponTree:", error);
    throw error;
  }
}

export async function fetchAllEmitter() {
  try {
    const response = await fetch(`${BASE_URL}Emitter/coordinates`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(`Failed to fetch all emitters: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("Error in fetchAllEmitter:", error);
    throw error;
  }
}

export async function SaveAOI(data) {
  //  Construct payload from form data — new consistent field names
  const payload = {
    areaInterestId: 0,
    areaName: data.areaName || data.aoiName,
    description: data.description || "",
    area: data.area || data.aoiArea,
    perimeter: data.perimeter || data.aoiPerimeter,
    missionId: data.MissionId || data.missionId,
    //  Prefer new key, fallback to old one if ever needed
    areaInterestCoordinateDtos:
      data.areaInterestCoordinateDtos || data.aoiCoordinates || [],
  };

  console.log("AOI payload being sent to API:", payload);

  try {
    const response = await fetch(`${BASE_URL}AreaInterest/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log(" AOI API response:", responseData);

    //  Accept both 200 & 201 as valid success codes
    if (
      !response.ok &&
      responseData.statusCode !== 200 &&
      responseData.statusCode !== 201
    ) {
      console.error(" AOI save failed:", responseData);
      throw new Error(
        responseData.message ||
          `Failed to save AOI: ${JSON.stringify(responseData)}`,
      );
    }

    console.log("AOI saved/updated successfully!");
    return responseData;
  } catch (error) {
    console.error(" Error in SaveAOI():", error);
    throw error;
  }
}

export async function UpdateAOI(data) {
  const payload = {
    areaInterestId: data.areaInterestId,
    areaName: data.areaName || data.aoiName,
    area: data.area || data.aoiArea,
    description: data.description || "",
    perimeter: data.perimeter || data.aoiPerimeter,
    missionId: data.missionId || data.MissionId,
    areaInterestCoordinateDtos:
      data.areaInterestCoordinateDtos || data.aoiCoordinates || [],
  };

  console.log("AOI payload being sent to API:", payload);

  try {
    const response = await fetch(`${BASE_URL}AreaInterest/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    console.log("AOI API response:", responseData);

    if (
      !response.ok &&
      responseData.statusCode !== 200 &&
      responseData.statusCode !== 201
    ) {
      console.error("AOI save failed:", responseData);
      throw new Error(
        responseData.message ||
          `Failed to save AOI: ${JSON.stringify(responseData)}`,
      );
    }

    console.log("AOI Updated Successfully!");
    return responseData;
  } catch (error) {
    console.error("Error in UpdateAOI():", error);
    throw error;
  }
}

export async function UpdateAllAOIsForMission(missionId) {
  try {
    // 1️Load AOI array from localStorage
    const aois =
      JSON.parse(localStorage.getItem(`aois_mission_${missionId}`)) || [];

    if (aois.length === 0) {
      console.warn(`No AOIs found for mission ${missionId}`);
      return;
    }

    console.log(` Updating ${aois.length} AOIs for mission ${missionId}`);

    //  Loop through each AOI ID
    for (const aoiId of aois) {
      try {
        // Set correct AOI ID context
        localStorage.setItem("current_aoiId", aoiId);

        // Fetch AOI details first
        const res = await AOIbyID(aoiId);
        if (res.statusCode !== 200 || !res.payload) {
          console.warn(`Skipping AOI ${aoiId}: not found`);
          continue;
        }

        const aoi = res.payload;

        // Build payload for update
        const payload = {
          areaInterestId: aoiId,
          areaName: aoi.areaName || "AOI",
          area: String(aoi.area ?? 0),
          perimeter: String(aoi.perimeter ?? 0),
          missionId: missionId,
          areaInterestCoordinateDtos: aoi.areaInterestCoordinateDtos || [],
        };

        // Send update to API
        const result = await UpdateAOI(payload);
        console.log(`AOI ${aoiId} updated successfully`, result);
      } catch (err) {
        console.error(`Failed to update AOI ${aoiId}:`, err);
      }
    }

    console.log("All AOIs processed successfully!");
  } catch (err) {
    console.error("Error in UpdateAllAOIsForMission:", err);
  }
}

export async function AOIbyID(aoiId) {
  try {
    const response = await fetch(`${BASE_URL}AreaInterest/${aoiId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    console.log(`AOIbyID response for AOI ID ${aoiId}:`, data);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch AOI by ID (${aoiId}): ${JSON.stringify(data)}`,
      );
    }
    return data;
  } catch (error) {
    console.error("Error in AOIbyID:", error);
    throw error;
  }
}

export async function GetEmittersInArea(missionId, aoiId) {
  try {
    console.log(
      `Fetching emitters in area for Mission ID: ${missionId}, AOI ID: ${aoiId}`,
    );
    const response = await fetch(
      `${BASE_URL}AreaInterest/getEmittersInArea/${missionId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        `Failed to fetch emitters in area (${missionId}): ${JSON.stringify(data)}`,
      );
    return data;
  } catch (error) {
    console.error("Error in GetEmittersInArea:", error);
    throw error;
  }
}

export async function fetchAllWeaponsSystems() {
  try {
    const response = await fetch(`${BASE_URL}Weapon/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend returned:", data);
      throw new Error(
        `Failed to fetch all weapons systems: ${data?.message || "Unknown error"}`,
      );
    }
    // Safely return only useful payload for UI
    if (data?.statusCode === 200 && Array.isArray(data?.payload)) {
      return data.payload;
    } else {
      console.warn("Unexpected data shape:", data);
      return [];
    }
  } catch (error) {
    console.error("Error in fetchAllWeaponsSystems:", error);
    throw error;
  }
}

export async function fetchAllStandAloneEmitters() {
  try {
    const response = await fetch(`${BASE_URL}Emitter/standalone/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch all standalone emitters: ${JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error in fetchAllStandAloneEmitters:", error);
    throw error;
  }
}

export async function fetchAllIndependentModes() {
  try {
    const response = await fetch(`${BASE_URL}Mode/independent/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch all standalone emitters: ${JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error in fetchAllStandAloneEmitters:", error);
    throw error;
  }
}

export async function saveEmitterLink(payload) {
  const response = await fetch(`${BASE_URL}EmitterModeLink/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Parse JSON only if the response has a body
  const contentType = response.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await response.json()
      : null;

  return { ok: response.ok, status: response.status, data };
}

//////////////////////////////////////////////
// STAND ALONE API CALLS
//////////////////////////////////////////////

export const saveIndependentEmitter = async (formData) => {
  try {
    const payload = {
      emitterId: formData.emitterId || 0,
      emitterName: formData.emitterName,
      description: formData.description,
      emitterType: formData.type,
      symbol: formData.symbol,
      foregroundColor: formData.foregroundColor,
      backgroundColor: formData.backgroundColor,
      isUnknown: Boolean(formData.isUnknown),
      isGroundOnly: Boolean(formData.isGroundOnly),
      createdBy: "system",
      createdDate: null,
      modifiedBy: "system",
      modifiedDate: null,
      latitude: String(formData.latitude || ""), // backend expects string
      longitude: String(formData.longitude || ""), // backend expects string
    };

    console.log("Sending independent emitter payload:", payload);

    const response = await fetch(`${BASE_URL}Emitter/standalone/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      console.error("Backend returned:", data);
      throw new Error(data.message || "Failed to save independent emitter");
    }

    return data;
  } catch (error) {
    console.error("saveIndependentEmitter failed:", error);
    throw error;
  }
};

export async function fetchIndependentEmitters() {
  try {
    const response = await fetch(`${BASE_URL}Emitter/standalone/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch independent emitters: ${JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error in fetchIndependentEmitters:", error);
    throw error;
  }
}

export async function fetchStandaloneEmitterTree(emitterId) {
  try {
    const response = await fetch(
      `${BASE_URL}Emitter/standalone-tree/${emitterId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failed to fetch standalone emitter tree: ${JSON.stringify(data)}`,
      );
    }
    return data;
  } catch (error) {
    console.error("Error in fetchStandaloneEmitterTree:", error);
    throw error;
  }
}

export async function fetchStandaloneModeTree(ModeId) {
  try {
    const response = await fetch(`${BASE_URL}Mode/standalone-tree/${ModeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        `Failed to fetch standalone emitter tree: ${JSON.stringify(data)}`,
      );
    }
    return data;
  } catch (error) {
    console.error("Error in fetchStandaloneEmitterTree:", error);
    throw error;
  }
}

//////////////////////////////////////////////
// Delete AOI CALL
//////////////////////////////////////////////
export async function DeleteAOI(id) {
  try {
    const response = await fetch(`${BASE_URL}AreaInterest/${id}`, {
      method: "DELETE",
    });

    // Handle 204 No Content safely
    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = { statusCode: response.status }; // fallback for empty body
    }

    console.log("AOI delete API response:", responseData);

    if (
      !response.ok &&
      responseData.statusCode !== 200 &&
      responseData.statusCode !== 204
    ) {
      console.error("AOI delete failed:", responseData);
      throw new Error(
        responseData.message || `Failed to delete AOI with ID ${id}`,
      );
    }

    console.log(`AOI ${id} deleted successfully`);
    return responseData;
  } catch (error) {
    console.error("Error in DeleteAOI():", error);
    throw error;
  }
}

//////////////////////////////////////////////////////////////////////////////////
//FLOW 1: WEAPONS > EMITTERS > MODES > JAMMING FLOW
/////////////////////////////////////////////////////////////////////////////////

export async function deleteWeapon(weaponId) {
  try {
    const response = await fetch(`${BASE_URL}Weapon/${weaponId}`, {
      method: "DELETE",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(`Failed to delete weapon: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("deleteWeapon ERROR:", error);
    throw error;
  }
}

export async function deleteEmitter(emitterId) {
  try {
    const response = await fetch(`${BASE_URL}Emitter/${emitterId}`, {
      method: "DELETE",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(`Failed to delete emitter: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("deleteEmitter ERROR:", error);
    throw error;
  }
}

export async function deleteMode(modeId) {
  try {
    const response = await fetch(`${BASE_URL}Mode/${modeId}`, {
      method: "DELETE",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(`Failed to delete mode: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("deleteMode ERROR:", error);
    throw error;
  }
}

export async function deleteJamming(jammingId) {
  try {
    const response = await fetch(`${BASE_URL}Jamming/${jammingId}`, {
      method: "DELETE",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(`Failed to delete jamming: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("deleteJamming ERROR:", error);
    throw error;
  }
}

// =========================================================
// FLOW 2: STANDALONE EMITTER CONTEXT (Emitter is Root)
// =========================================================

export async function deleteStandaloneEmitter(emitterId) {
  try {
    const response = await fetch(
      `${BASE_URL}Emitter/delete-standalone/${emitterId}`,
      {
        method: "DELETE",
      },
    );
    // Handle generic text/json response safely
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(`Failed: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("deleteStandaloneEmitter ERROR:", error);
    throw error;
  }
}

export async function deleteStandaloneMode(modeId) {
  try {
    const response = await fetch(
      `${BASE_URL}Mode/delete-standalone/${modeId}`,
      {
        method: "DELETE",
      },
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(`Failed: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("deleteStandaloneMode ERROR:", error);
    throw error;
  }
}

export async function deleteStandaloneJamming(jammingId) {
  try {
    const response = await fetch(
      `${BASE_URL}Jamming/delete-standalone/${jammingId}`,
      {
        method: "DELETE",
      },
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(`Failed: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("deleteStandaloneJamming ERROR:", error);
    throw error;
  }
}

// =========================================================
// FLOW 3: INDEPENDENT MODE CONTEXT (Mode is Root)
// =========================================================

export async function deleteIndependentMode(modeId) {
  try {
    const response = await fetch(
      `${BASE_URL}Mode/delete-independent/${modeId}`,
      {
        method: "DELETE",
      },
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(`Failed: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("deleteIndependentMode ERROR:", error);
    throw error;
  }
}

export const saveJammingToApi = async ({
  payload,
  weaponId,
  modeId,
  emitterId,
}) => {
  let JAMMING_API_URL;

  if (weaponId && weaponId !== "null" && weaponId !== "undefined") {
    JAMMING_API_URL = `${BASE_URL}Jamming/save`;
  } else if (!weaponId && modeId && emitterId && emitterId !== "null") {
    JAMMING_API_URL = `${BASE_URL}Jamming/standalone/save`;
  } else if (modeId && modeId !== 0 && modeId !== "null") {
    JAMMING_API_URL = `${BASE_URL}Jamming/independent-mode-jamming/save`;
  } else {
    JAMMING_API_URL = `${BASE_URL}Jamming/independent/save`;
  }

  const res = await fetch(JAMMING_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${JSON.stringify(json)}`);
  }

  return json;
};

export const saveTargetPhaseApi = async ({
  payload,
  weaponId,
  emitterId,
  modeId,
}) => {
  let endpointPath = "";

  if (weaponId && weaponId !== "null" && weaponId !== "undefined") {
    endpointPath = "TargetPhase/save-phase";
  } else if (emitterId && emitterId !== "null" && emitterId !== "undefined") {
    endpointPath = "TargetPhase/save-standalone-phase";
  } else if (modeId && modeId !== 0 && modeId !== "null") {
    endpointPath = "TargetPhase/save-independent-mode-phase";
  } else {
    // NO weapon, NO emitter, NO mode -> New 4th Flow independent jamming
    endpointPath = "TargetPhase/save-independent-phase";
  }

  const PHASE_API_URL = `${BASE_URL}${endpointPath}`;

  const res = await fetch(PHASE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text().catch(() => "");
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text; // Fallback to plain text if it's not valid JSON
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${JSON.stringify(json)}`);
  }

  return json;
};

export const deleteTargetPhaseApi = async ({
  phaseId,
  weaponId,
  emitterId,
  modeId,
}) => {
  let endpointPath = "";

  if (weaponId && weaponId !== "null" && weaponId !== "undefined") {
    endpointPath = `TargetPhase/delete-phase/${phaseId}`;
  } else if (emitterId && emitterId !== "null" && emitterId !== "undefined") {
    endpointPath = `TargetPhase/delete-standalone-phase/${phaseId}`;
  } else if (
    modeId &&
    modeId !== 0 &&
    modeId !== "null" &&
    modeId !== "undefined"
  ) {
    endpointPath = `TargetPhase/delete-independent-mode-phase/${phaseId}`;
  } else {
    endpointPath = `TargetPhase/delete-independent-phase/${phaseId}`;
  }

  const DELETE_API_URL = `${BASE_URL}${endpointPath}`;

  const res = await fetch(DELETE_API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const text = await res.text().catch(() => "");
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${JSON.stringify(json)}`);
  }

  return json;
};

export async function deleteIndependentJamming(jammingId) {
  try {
    const response = await fetch(
      `${BASE_URL}Jamming/delete-independent-mode-jamming/${jammingId}`,
      {
        method: "DELETE",
      },
    );
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) throw new Error(`Failed: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    console.error("deleteIndependentJamming ERROR:", error);
    throw error;
  }
}

export async function fetchAllIndependentJammings() {
  try {
    const response = await fetch(`${BASE_URL}Jamming/independent/all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log("All independent jammings response:", data);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch all independent jammings: ${JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error in fetchAllIndependentJammings:", error);
    throw error;
  }
}

export async function deleteIndependentStandaloneJamming(jammingId) {
  // Construct the URL dynamically using the passed jammingId
  const API_URL = `${BASE_URL}Jamming/delete-independent/${jammingId}`;

  const res = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Safely grab the response text first, just like your other services
  const text = await res.text().catch(() => "");
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text; // Fallback to plain text if it's not valid JSON
  }

  if (!res.ok) {
    throw new Error(
      `API error ${res.status}: ${typeof json === "object" ? JSON.stringify(json) : json}`,
    );
  }

  return json;
}

export async function fetchStandaloneJamming(jammingId) {
  try {
    // Assuming this is your backend endpoint pattern for fetching a single independent jamming
    const response = await fetch(
      `${BASE_URL}Jamming/independent/${jammingId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();
    console.log("Standalone Jamming Fetch Response:", data);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch standalone jamming: ${JSON.stringify(data)}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error in fetchStandaloneJamming:", error);
    throw error;
  }
}
