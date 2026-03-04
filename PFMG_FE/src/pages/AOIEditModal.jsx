import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UpdateAOI } from "../services/AdroneServices"; // same API used for create
import { useSearchParams } from "react-router-dom";
import { useAoiStore } from "../store/missionStore";
import { AOIbyID } from "../services/AdroneServices";
import { useResponseModal } from "../context/ResponseModalContext";

const VALIDATION_RULES = {
  name: {
    required: true,
    min: 3,
    max: 50,
    pattern: /^[a-zA-Z0-9\s-_]+$/, // No special characters
  },
  description: {
    required: true,
    min: 10,
    max: 500,
  },
};

export function AOIEditModal({ isOpen, onClose, aoi }) {
  const { aoiData } = useAoiStore();
  const { open } = useResponseModal();
  const [searchParams] = useSearchParams();
  const missionId = Number(searchParams.get("missionId")) || 0;

  const [points, setPoints] = useState([]);
  const [aoiName, setAoiName] = useState("");
  const [description, setDescription] = useState("");

  // Sync AOI data when modal opens
  useEffect(() => {
    if (aoiData) {
      const formattedPoints = (
        Array.isArray(aoiData.points) ? aoiData.points : []
      ).map((p) => {
        const lat = parseFloat(p.raw?.lat ?? p.lat);
        const lon = parseFloat(p.raw?.long ?? p.long);
        const alt = parseFloat(p.raw?.alt ?? p.alt);

        return {
          raw: { lat, long: lon, alt },
          lat: `${isFinite(lat) ? lat.toFixed(6) : 0}° N`,
          long: `${isFinite(lon) ? lon.toFixed(6) : 0}° E`,
          alt: `${isFinite(alt) ? alt.toFixed(1) : 0} m`,
        };
      });

      setPoints(formattedPoints);
      setAoiName(aoiData.name || "AOI");
      setDescription(aoiData.description || "");
    }
  }, [aoiData, isOpen]);
  // When modal opens (or after refresh), fetch AOI from backend if not in store
  useEffect(() => {
    const fetchAOIFromBackend = async () => {
      if (!isOpen || !aoi?.id) return;

      try {
        // console.log(`Fetching AOI details for ID ${aoi.id}`);
        const res = await AOIbyID(aoi.id);

        if (res.statusCode === 200 && res.payload) {
          const data = res.payload;
          const formattedPoints = (
            Array.isArray(data.areaInterestCoordinateDtos)
              ? data.areaInterestCoordinateDtos
              : []
          ).map((p) => ({
            raw: {
              lat: parseFloat(p.latitude),
              long: parseFloat(p.longitude),
              alt: parseFloat(p.altitude),
            },
            lat: `${parseFloat(p.latitude).toFixed(6)}° N`,
            long: `${parseFloat(p.longitude).toFixed(6)}° E`,
            alt: `${parseFloat(p.altitude).toFixed(1)} m`,
          }));

          setPoints(formattedPoints);
          setAoiName(data.areaName || "AOI");
          setDescription(data.description || "");
        } else {
          console.warn(`Failed to fetch AOI ${aoi.id}`, res);
        }
      } catch (err) {
        console.error("Failed to load AOI for editing:", err);
      }
    };

    fetchAOIFromBackend();
  }, [isOpen, aoi]);

  // Handle coordinate edits
  const handleChange = (i, field, value) => {
    const updated = [...points];
    const val = parseFloat(value);

    if (!updated[i].raw) updated[i].raw = {};
    updated[i].raw[field] = val;

    if (field === "lat")
      updated[i].lat = `${isFinite(val) ? val.toFixed(6) : 0}° N`;
    if (field === "long")
      updated[i].long = `${isFinite(val) ? val.toFixed(6) : 0}° E`;
    if (field === "alt")
      updated[i].alt = `${isFinite(val) ? val.toFixed(1) : 0} m`;

    setPoints(updated);
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name Validation
    if (VALIDATION_RULES.name.required && !aoiName.trim()) {
      newErrors.aoiName = "AOI Name is strictly required.";
    } else if (aoiName.length < VALIDATION_RULES.name.min) {
      newErrors.aoiName = `Name must be at least ${VALIDATION_RULES.name.min} characters.`;
    } else if (!VALIDATION_RULES.name.pattern.test(aoiName)) {
      newErrors.aoiName = "Name contains invalid characters.";
    }

    // Description Validation
    if (VALIDATION_RULES.description.required && !description.trim()) {
      newErrors.description = "Please provide a description for this area.";
    } else if (description.length < VALIDATION_RULES.description.min) {
      newErrors.description = `Description is too short (min ${VALIDATION_RULES.description.min} chars).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if form is clean
  };

  const handleSave = async () => {
    // 1. FORM VALIDATION GUARD
    const newErrors = { aoiName: "", description: "" };
    let hasError = false;

    // Use VALIDATION_RULES instead of the non-existent 'limits' variable
    const nameVal = VALIDATION_RULES.name;
    const descVal = VALIDATION_RULES.description;

    if (!aoiName.trim()) {
      newErrors.aoiName = "AOI Name is strictly required.";
      hasError = true;
    } else if (aoiName.length < nameVal.min) {
      newErrors.aoiName = `Name must be at least ${nameVal.min} characters.`;
      hasError = true;
    } else if (!nameVal.pattern.test(aoiName)) {
      newErrors.aoiName = "Name contains invalid characters.";
      hasError = true;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
      hasError = true;
    } else if (description.length < descVal.min) {
      newErrors.description = `Description is too short (min ${descVal.min} chars).`;
    }

    // STOP HERE if validation fails. API will NOT be called.
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // 2. COORDINATE VALIDATION (Your Original Logic)
    if (!aoi) {
      console.warn("No AOI selected to update");
      return;
    }

    const validRows = points.filter(
      (p) =>
        p?.raw &&
        !isNaN(p.raw.lat) &&
        !isNaN(p.raw.long) &&
        Math.abs(p.raw.lat) > 0.0001 &&
        Math.abs(p.raw.long) > 0.0001,
    );

    if (validRows.length < 3) {
      open({
        type: "info",
        title: "Invalid AOI",
        message:
          "Please enter at least 3 valid coordinate points to form a valid Area of Interest.",
      });
      return;
    }

    // 3. UI SYNC (Your Original Logic)
    window.dispatchEvent(
      new CustomEvent("AOI_UPDATED", {
        detail: { id: aoi.id, name: aoiName, points: validRows },
      }),
    );

    // 4. API EXECUTION (Your Original Logic)
    try {
      const coords = validRows.map((p) => ({
        id: 0,
        latitude: parseFloat(p.raw.lat).toFixed(6),
        longitude: parseFloat(p.raw.long).toFixed(6),
        altitude: parseFloat(p.raw.alt ?? 0).toFixed(1),
      }));

      // Ensure polygon closure
      if (coords.length >= 3) {
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (
          first.latitude !== last.latitude ||
          first.longitude !== last.longitude
        ) {
          coords.push({ ...first });
        }
      }

      const payload = {
        areaInterestId: aoi.id,
        areaName: aoiName.trim(),
        description: description.trim(),
        area: String(aoiData?.area ?? 0),
        perimeter: String(aoiData?.perimeter ?? 0),
        missionId,
        areaInterestCoordinateDtos: coords,
      };

      const res = await UpdateAOI(payload);

      if (res?.statusCode === 200) {
        open({
          type: "success",
          title: "AOI Updated",
          message: "Area of Interest was updated successfully.",
        });
        onClose(); // Only close modal on success
      }
    } catch (err) {
      console.error("AOI update failed:", err);
      open({
        type: "error",
        title: "Update Failed",
        message: "Failed to update the Area of Interest. Please try again.",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="aoi-edit-desc"
        className="w-[520px] bg-[#2A2A2A] text-white rounded-lg"
      >
        <DialogHeader>
          <DialogTitle>Edit Area of Interest</DialogTitle>
          <DialogDescription id="aoi-edit-desc">
            Adjust AOI coordinates or update its metadata.
          </DialogDescription>
        </DialogHeader>

        {points.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-10">
            No AOI data loaded. Draw or select an AOI first.
          </div>
        ) : (
          <div className="space-y-4">
            {/* AOI Name */}
            {/* <div className="space-y-1">
              <div className="flex justify-between">
                <Label
                  className={`text-sm ${errors.aoiName ? "text-red-400" : "text-white/90"}`}
                >
                  AOI Name
                </Label>
                <span className="text-[10px] text-gray-500">
                  {aoiName.length}/{VALIDATION_RULES.name.max}
                </span>
              </div>
              <Input
                value={aoiName}
                onChange={(e) => {
                  setAoiName(e.target.value);
                  setErrors((prev) => ({ ...prev, aoiName: "" })); // Reset error on type
                }}
                className={errors.aoiName ? "border-red-500" : ""}
              />
              {errors.aoiName && (
                <span className="text-red-500 text-xs">{errors.aoiName}</span>
              )}
            </div> */}

            <Input
              value={aoiName}
              onChange={(e) => {
                setAoiName(e.target.value);
                setErrors((prev) => ({ ...prev, aoiName: "" }));
              }}
              // Keep the original background and border classes here, only toggle the red border
              className={`bg-[#404343] border-[#404040] text-white ${
                errors.aoiName
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />

            {/* Description Textarea */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <Label
                  className={`text-sm ${errors.description ? "text-red-400" : "text-white/90"}`}
                >
                  Description
                </Label>
                <span className="text-[10px] text-gray-500">
                  {description.length}/{VALIDATION_RULES.description.max}
                </span>
              </div>
              <Textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" })); // Reset error on type
                }}
                className={`bg-[#404343] border-[#404040] text-white ${
                  errors.aoiName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description}
                </span>
              )}
            </div>

            {/* Coordinates Table */}
            <div>
              <Label className="text-sm font-medium text-white/90 mb-2 block">
                Edit Coordinates
              </Label>
              <div className="bg-[#404343] border border-[#404040] rounded-md overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-2 bg-[#383A3E] border-b border-[#404040] text-xs font-semibold text-white/90">
                  <div className="px-3 py-2 border-r border-[#404040]">
                    Latitude [ ° ]
                  </div>
                  <div className="px-3 py-2 border-r border-[#404040]">
                    Longitude [ ° ]
                  </div>
                  {/* <div className="px-3 py-2">Altitude [m]</div> */}
                </div>

                {/* Body */}
                {points.map((p, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-[#404040] last:border-b-0"
                  >
                    <div className="px-2 py-2">
                      <Input
                        type="text"
                        value={p.lat || ""}
                        onChange={(e) => handleChange(i, "lat", e.target.value)}
                        className="bg-transparent border-none text-white text-sm focus-visible:ring-0"
                      />
                    </div>
                    <div className="px-2 py-2">
                      <Input
                        type="text"
                        value={p.long || ""}
                        onChange={(e) =>
                          handleChange(i, "long", e.target.value)
                        }
                        className="bg-transparent border-none text-white text-sm focus-visible:ring-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-2">
              <Button
                className="bg-[#7B70D6] hover:bg-[#6B60C6] text-white px-6 py-2 text-sm font-medium"
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
