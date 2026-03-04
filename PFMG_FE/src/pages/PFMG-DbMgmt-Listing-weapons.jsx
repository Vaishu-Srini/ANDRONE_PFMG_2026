import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import copy from "@/assets/images/copy.svg";
import detach from "@/assets/images/detach.svg";
import noise from "@/assets/images/noise.svg";
import {
  Eye,
  EyeOff,
  Volume2,
  Link,
  Plus,
  ChevronRight,
  Copy,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  usePlatformIdStore,
  useSidebarStore,
  useWeaponIdStore,
  // useWeaponStore,
} from "../store/missionStore";
import { toast } from "react-toastify";
// Aliased import to keep backend compatibility

import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { ChevronDown } from "lucide-react";
import { saveWeapon } from "../services/AdroneServices";

import { fetchWeaponTree } from "../services/AdroneServices";
import dayjs from "dayjs";

// ------------------------------------------------------------
// FORM CONFIG (renamed for Weapon System)
// ------------------------------------------------------------
const formConfig = {
  symbolDetails: {
    weaponSymbol: { type: "input", label: "Add Symbol", required: true },
    foregroundColor: {
      type: "color",
      label: "Select Foreground Color",
      required: true,
    },
    backgroundColor: {
      type: "color",
      label: "Select Background Color",
      required: true,
    },
  },
  weaponDetails: {
    weaponName: { type: "input", label: "Weapon System Name", required: true },
    type: {
      type: "select",
      label: "Threat Type",
      required: true,
      options: [
        { value: "S", label: "S" },
        { value: "T", label: "T" },
        { value: "U", label: "U" },
      ],
    },
    // priority: { type: "input", label: "Priority", required: true },
    priority: { type: "number", label: "Priority", required: true },

    description: {
      type: "textarea",
      label: "Description",
      required: true,
      placeholder: "Enter weapon system description...",
    },
  },
};

// ------------------------------------------------------------
// GENERIC FORM FIELD
// ------------------------------------------------------------
const FormField = ({
  field,
  register,
  errors,
  watch,
  setValue,
  onBlurWeaponName,
}) => {
  const fieldName = Object.keys(field)[0];
  const config = field[fieldName];
  const { type, label, options, placeholder } = config;

  const commonClasses = "bg-[#FFFFFF0D] border-black/10 text-white";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select
            value={watch[fieldName] || ""}
            onValueChange={(value) =>
              setValue(fieldName, value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className={`w-full ${commonClasses}`}>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent className="!bg-[#2C2D30] text-white">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            {...register(fieldName)}
            className={`w-full ${commonClasses} h-24 resize-none`}
            placeholder={placeholder}
          />
        );
      case "color":
        return (
          <div
            className={`flex items-center gap-3 rounded-lg px-3 py-1 ${commonClasses}`}
          >
            <input
              type="color"
              {...register(fieldName)}
              className="w-7  h-8"
              value={watch?.[fieldName] || "#000000"}
              onChange={(e) =>
                setValue(fieldName, e.target.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
            <input
              type="text"
              className="bg-transparent text-sm text-white w-24 outline-none"
              value={watch?.[fieldName] || ""}
              onChange={(e) =>
                setValue(fieldName, e.target.value.toUpperCase(), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          </div>
        );
      default:
        return (
          <Input
            type={type === "number" ? "number" : "text"}
            {...register(fieldName)}
            className={commonClasses}
            onChange={(e) =>
              setValue(fieldName, e.target.value, { shouldDirty: true })
            }
            onBlur={(e) => {
              if (fieldName === "weaponName" && onBlurWeaponName) {
                const newName = e.target.value.trim() || "WeaponSystem_Alpha";
                onBlurWeaponName(newName);
              }
            }}
          />
        );
    }
  };

  return (
    <div>
      <Label className={labelClasses}>{label}</Label>
      {renderField()}
      {errors[fieldName] && (
        <p className="text-red-400 text-xs mt-1">{errors[fieldName].message}</p>
      )}
    </div>
  );
};

const ToggleField = ({ name, label, checked, onCheckedChange, setValue }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm font-medium text-gray-300">{label}</span>
    <Switch
      checked={checked}
      onCheckedChange={(c) => {
        onCheckedChange(c);
        setValue(name, c);
      }}
      checkedText="YES"
      uncheckedText="NO"
      checkedBg="#C5BFFF"
      uncheckedBg="#A7A7A7"
      checkedThumb="bg-[#7B70D6]"
      uncheckedThumb="bg-[#545454]"
      checkedTextColor="text-[#313040]"
      uncheckedTextColor="text-[#545454]"
    />
  </div>
);

// ------------------------------------------------------------
// EMITTER CARD (unchanged, generic labeling)
// ------------------------------------------------------------

const EmitterCardComponent = ({
  emitter,
  index,
  isLast,
  toggleScanType,
  toggleEmParameter,
  detachMode,
  expandedStates, // Add this prop
}) => (
  <div>
    <div>
      <div className="mb-6">
        <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
          {/* Emitter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`px-2 py-1 rounded text-xs font-bold text-white`}
                style={{
                  backgroundColor: emitter.backgroundColor || "#8B0000",
                  color: emitter.foregroundColor || "white",
                }}
              >
                {emitter.symbol}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {emitter.emitterName}
              </h3>
            </div>

            <div className="flex items-center text-sm gap-4">
              <p className="text-sm text-gray-300 mr-5 ">
                LAST EDITED{" "}
                <span className=" font-medium text-white text-base">
                  {dayjs(emitter.modifiedDate).format("DD MMM'YY HH:mm")}
                </span>
              </p>

              <div className="flex gap-5 p-0">
                <button type="button" className="text-white p-0">
                  <img src={detach} alt="Detach" className="h-4 w-4" />
                </button>
                <button type="button" className="text-white">
                  <img src={copy} alt="Copy" className="h-4 w-4" />
                </button>
                <button type="button" className="text-white">
                  <img src={noise} alt="Noise" className="h-5 w-5" />
                </button>
              </div>

              <button type="button" variant="link" className="text-white ml-3">
                <ChevronRight className="w-5 h-5 border rounded-full" />
              </button>
            </div>
          </div>

          {/* Emitter Description */}
          <p className="text-gray-300 mb-4">{emitter.description}</p>

          {/* Emitter Parameters Table */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-gray-200 max-w-4xl">
            <div>
              <div className="text-gray-300 text-sm mb-1">TYPE</div>
              <div className="font-medium text-sm text-white">
                {emitter.emitterType}
              </div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1"># OF MODES</div>
              <div className="font-medium text-sm text-white">
                {emitter.modes?.length || 0}
              </div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1">LATITUDE</div>
              <div className="font-medium text-sm text-white">
                {emitter.latitude}
              </div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1">LONGITUDE</div>
              <div className="font-medium text-sm text-white">
                {emitter.longitude}
              </div>
            </div>
            <div>
              <div className="text-gray-300 text-sm mb-1">LAST EDITED</div>
              <div className="font-medium text-sm text-white">
                {dayjs(emitter.modifiedDate).format("DD MMM'YY HH:mm")}
              </div>
            </div>
          </div>
        </div>
        {!isLast && <Separator className="my-6 bg-gray-600" />}
      </div>
    </div>

    <div className="">
      <Accordion transition transitionTimeout={250}>
        <AccordionItem
          header={({ state }) => (
            <div className="flex items-center justify-between w-full">
              {state.isEnter ? (
                <ChevronDown className="w-8 h-8 text-gray-400 transition-transform duration-300" />
              ) : (
                <ChevronRight className="w-8 h-8 text-gray-400 transition-transform duration-300" />
              )}
              <span className="text-lg font-semibold text-gray-300">Modes</span>
            </div>
          )}
          className="font-bold w-auto flex-wrap ml-10 rounded-md "
          initialEntered
        >
          {emitter?.modes?.map((mode, idx) => (
            // <React.Fragment key={mode.id}>
            <React.Fragment key={idx}>
              <div className="mt-3">
                <div className="mb-6">
                  <div className="rounded-lg bg-[#FFFFFF0D] p-4 px-6">
                    {/* Mode Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-2 py-1 rounded text-xs font-bold text-white`}
                          style={{
                            backgroundColor: mode.bgColor || "#666",
                            color: mode.fgColor || "#fff",
                          }}
                        >
                          {mode.modeSymbol}
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {mode.modeName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            toggleScanType(emitter.emitterId, mode.modeId)
                          }
                          className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
                        >
                          {expandedStates[
                            `${emitter.emitterId}_${mode.modeId}_scan`
                          ] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          {expandedStates[
                            `${emitter.emitterId}_${mode.modeId}_scan`
                          ]
                            ? "HIDE SCAN TYPE"
                            : "SHOW SCAN TYPE"}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() =>
                            toggleEmParameter(emitter.emitterId, mode.modeId)
                          }
                          className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8 p-0"
                        >
                          {expandedStates[
                            `${emitter.emitterId}_${mode.modeId}_param`
                          ] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                          {expandedStates[
                            `${emitter.emitterId}_${mode.modeId}_param`
                          ]
                            ? "HIDE EM PARAMETER"
                            : "SHOW EM PARAMETER"}
                        </Button>

                        <p className="text-sm text-gray-300 font-medium mr-4">
                          LAST EDITED{" "}
                          <span className=" font-medium text-white text-base">
                            {dayjs(mode.modifiedDate).format("DD MMM'YY HH:mm")}
                          </span>
                        </p>

                        {expandedStates[
                          `${emitter.emitterId}_${mode.modeId}_scan`
                        ] ||
                        expandedStates[
                          `${emitter.emitterId}_${mode.modeId}_param`
                        ] ? (
                          <div className="flex gap-5 p-0">
                            <button type="button" className="text-white">
                              <img
                                src={noise}
                                alt="Noise"
                                className="h-5 w-5"
                              />
                            </button>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8"
                            >
                              <img
                                src={detach}
                                alt="Detach"
                                className="h-4 w-4"
                              />
                              Detach
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-5 p-0">
                            <button type="button" className="text-white p-0">
                              <img
                                src={detach}
                                alt="Detach"
                                className="h-4 w-4"
                              />
                            </button>
                            <button type="button" className="text-white">
                              <img src={copy} alt="Copy" className="h-4 w-4" />
                            </button>
                            <button type="button" className="text-white">
                              <img
                                src={noise}
                                alt="Noise"
                                className="h-5 w-5"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mode Description */}
                    <p className="text-gray-300 mb-4 font-medium">
                      {mode.description}
                    </p>

                    {/* Mode Parameters Table */}
                    <div className=" my-3">
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2">
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.modeType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            SUB-MODE TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.subMode}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            PLATFORM TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.platformType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            THREAT TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.threatType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            FREQ TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.frequencyType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            PRI TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.priType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            STAGGER LEVEL
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.priStaggerLevel || "-"}
                          </div>
                          {/* 
                          <div className="py-2 rounded text-sm font-medium text-white flex flex-row items-center">
                            {mode?.modePriDetails?.map((Sl, index) => (
                              <p key={index} className="">
                                {Sl?.priStaggerLevel
                                  ? `${Sl.priStaggerLevel},`
                                  : "-"}
                              </p>
                            ))}
                          </div> */}
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            PW TYPE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.pwType}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            DISP RANGE EST
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.rangeEstimation}
                          </div>
                        </div>
                        <div>
                          <Label className="block text-sm text-gray-300 mb-1">
                            LETHAL RANGE
                          </Label>
                          <div className="py-2 rounded text-sm font-medium text-white">
                            {mode.lethalRange}
                          </div>
                        </div>
                      </div>
                    </div>

                    {expandedStates[
                      `${emitter.emitterId}_${mode.modeId}_scan`
                    ] && <hr className=" border-gray-500" />}

                    {/* Scan Type Section */}
                    {expandedStates[
                      `${emitter.emitterId}_${mode.modeId}_scan`
                    ] &&
                      mode.modeScanDetails && (
                        <div className="my-4">
                          <div className="mb-4">
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2 gap-y-4">
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Scan Type
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.scanType || "N/A"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Min Scan Sector
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.minScanSector ||
                                    "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Max Scan Sector
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.maxScanSector ||
                                    "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Min Scan Rate
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.minScanRate || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Max Scan Rate
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.maxScanRate || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Normal Scan Rate
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.normalScanRate ||
                                    "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Side Lobe Level
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.sideLobeLevel ||
                                    "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Side Lobe STD
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.sideLobeStd || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Min TOT
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.minTot || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Max TOT
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.maxTot || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Min Beam Width
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.minBeamWidth || "0"}
                                </div>
                              </div>
                              <div>
                                <Label className="block text-sm text-gray-300 mb-1 uppercase">
                                  Max Beam Width
                                </Label>
                                <div className="text-sm font-medium text-white">
                                  {mode.modeScanDetails[0]?.maxBeamWidth || "0"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {expandedStates[
                      `${emitter.emitterId}_${mode.modeId}_param`
                    ] && <hr className=" border-gray-500" />}

                    {/* EW Parameters Section */}
                    {expandedStates[
                      `${emitter.emitterId}_${mode.modeId}_param`
                    ] &&
                      mode.modeFrequencyDetails && (
                        <div className="my-4">
                          <p className="font-medium text-base uppercase mb-4">
                            EW Parameters
                          </p>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* FREQ Table */}
                            <div className="bg-black/5 rounded overflow-hidden h-full">
                              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                                <div className="px-3 py-2">FREQ MIN</div>
                                <div className="px-3 py-2">FREQ MAX</div>
                                <div className="px-3 py-2">DEVIATION</div>
                              </div>
                              {mode.modeFrequencyDetails?.length > 0 ? (
                                mode.modeFrequencyDetails.map((freq, idx) => (
                                  <div
                                    key={freq.id}
                                    className="grid grid-cols-3 text-gray-100 text-sm"
                                  >
                                    <div className="px-3 py-2">
                                      {freq.minFrequency}
                                    </div>
                                    <div className="px-3 py-2">
                                      {freq.maxFrequency}
                                    </div>
                                    <div className="px-3 py-2">
                                      {freq.deviation || "-"}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-sm p-4 flex items-center justify-center">
                                  <p className="text-gray-400 text-sm">
                                    No FREQ data available
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* PRI Table */}
                            <div className="bg-black/5 rounded overflow-hidden h-full">
                              <div className="grid grid-cols-4 bg-[#393A3E] text-gray-100 text-sm font-medium">
                                <div className="px-3 py-2">PRI MIN</div>
                                <div className="px-3 py-2">PRI MAX</div>
                                <div className="px-3 py-2">DEVIATION</div>
                                <div className="px-3 py-2">STAGGER LEVEL</div>
                              </div>
                              {mode?.modePriDetails?.length > 0 ? (
                                mode.modePriDetails.map((pri, idx) => (
                                  <div
                                    key={pri.id}
                                    className="grid grid-cols-4 text-gray-100 text-sm"
                                  >
                                    <div className="px-3 py-2">
                                      {pri.minPri}
                                    </div>
                                    <div className="px-3 py-2">
                                      {pri.minPri}
                                    </div>
                                    <div className="px-3 py-2">
                                      {pri.deviation || "-"}
                                    </div>
                                    <div className="px-3 py-2">
                                      {pri.staggerLevel || "-"}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-sm p-4 flex items-center justify-center">
                                  <p className="text-gray-400 text-sm">
                                    No PRI data available
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* PW Table */}
                            <div className="bg-black/5 rounded overflow-hidden h-full">
                              <div className="grid grid-cols-3 bg-[#393A3E] text-gray-100 text-sm font-medium">
                                <div className="px-3 py-2">PW MIN</div>
                                <div className="px-3 py-2">PW MAX</div>
                                <div className="px-3 py-2">DEVIATION</div>
                              </div>
                              {mode.modePwDetails?.length > 0 ? (
                                mode.modePwDetails.map((pw, idx) => (
                                  <div
                                    key={pw.id}
                                    className="grid grid-cols-3 text-gray-100 text-sm"
                                  >
                                    <div className="px-3 py-2">{pw.minPw}</div>
                                    <div className="px-3 py-2">{pw.maxPw}</div>
                                    <div className="px-3 py-2">
                                      {pw.deviation || "-"}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="  rounded-sm p-4 flex items-center justify-center">
                                  <p className="text-gray-400 text-sm">
                                    No PW data available
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  {!isLast && <Separator className="my-6 bg-gray-600" />}
                  {/* {index < modes.length - 1 && <Separator className="my-6 bg-gray-600" />} */}
                </div>
              </div>
            </React.Fragment>
          ))}

          <div className=" w-full flex justify-end -mt-3 mb-3">
            <Button
              type="button"
              variant="outline"
              className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:text-[#C5BFFF] hover:bg-transparent cursor-pointer rounded-[4px] w-52"
            >
              <Plus className=" w-5 h-5" /> New Mode
            </Button>
          </div>

          {emitter?.modes.length === 0 && (
            <div className="text-gray-300 text-sm italic">
              No Modes attached yet
            </div>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  </div>
);

const EmitterCard = memo(EmitterCardComponent);

// ------------------------------------------------------------
// VALIDATION SCHEMA
// ------------------------------------------------------------
const validationSchema = yup.object({
  weaponSymbol: yup
    .string()
    .trim()
    .min(2, "Add Symbol must be at least 2 characters")
    .max(20, "Add Symbol cannot exceed 20 characters")
    .required("Add Symbol is required"),
  foregroundColor: yup
    .string()
    .required("Foreground Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (#RRGGBB)"),
  backgroundColor: yup
    .string()
    .required("Background Color is required")
    .matches(/^#[0-9A-F]{6}$/i, "Must be a valid hex color (#RRGGBB)"),
  weaponName: yup
    .string()
    .trim()
    .min(3, "Weapon name must be at least 3 characters")
    .max(50, "Weapon name cannot exceed 50 characters")
    .required("Weapon Name is required"),
  type: yup
    .string()
    .oneOf(["S", "T", "U"], "Invalid threat type")
    .required("Threat Type is required"),
  priority: yup
    .number()
    .typeError("Priority must be a number")
    .required("Priority is required")
    .min(1, "Priority must be at least 1")
    .max(10, "Priority cannot exceed 10"),
  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters")
    .required("Description is required"),
  displayStatus: yup.boolean().default(false),
  //   isUnknown: yup.boolean().default(false),
});

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
export default function PFMGDbMgmtListingWeapons() {
  const [isDisplayStatus, setIsDisplayStatus] = useState(false);
  const [isUnknown, setIsUnknown] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const weaponId = searchParams.get("weaponId");
  const sidebarData = useSidebarStore((s) => s.sidebarData);
  const platformId = usePlatformIdStore((s) => s.platformId);
  // const [modes, setModes] = useState([]);
  const [weaponTreeData, setWeaponTreeData] = useState([]);
  console.log("weaponTreeData for modal cards: ", weaponTreeData);
  // Add this state to track expanded states for modes
  const [expandedStates, setExpandedStates] = useState({});
  const [modes, setModes] = useState([
    {
      id: 1,
      code: { bgColor: "#4CAF50" },
      details: {
        type: "SEARCH",
        description: "Mock Mode for preview",
        subModeType: "Scan",
        platformType: "Ground Radar",
        threatType: "S",
        lethalRange: "8 km",
      },
      ewParameters: {
        frequency: {
          freqType: "CW",
          frequencyTable: [{ min: 500, max: 1000, deviation: 25 }],
        },
        pri: {
          priType: "Jittered",
          priTable: [{ min: 100, max: 150, deviation: 5, staggerLevel: 2 }],
        },
        pulseWidth: {
          pwType: "Wide",
          pulseWidthTable: [{ min: 20, max: 30, deviation: 2 }],
        },
      },
      scanDetails: {
        scanType: "Circular",
        minScanSector: 5,
        maxScanSector: 50,
        minScanRate: 1,
        normalScanRate: 3,
        sideLobeLevel: -25,
        sideLobeStd: 1.5,
        minTot: 0.2,
        maxTot: 1.0,
      },
      showScanType: true,
      showEmParameter: true,
      lastEdited: "Today",
    },
  ]);

  const weaponNode = useMemo(() => {
    if (!weaponId || !Array.isArray(sidebarData)) return null;
    const idStr = String(weaponId);
    return (
      sidebarData.find(
        (item) => String(item.data?.weaponId ?? item.id) === idStr,
      ) || null
    );
  }, [sidebarData, weaponId]);

  const weaponPayload = weaponNode?.data;
  console.log("weaponPayload: ", weaponPayload);
  const setRefetchSidebarData = useSidebarStore((s) => s.setRefetchSidebarData);
  const refetchSidebarData = useSidebarStore((s) => s.refetchSidebarData);
  console.log("refetchSidebarData: ", refetchSidebarData);
  const setCreating = useSidebarStore((s) => s.setCreating);
  // const setWeapon = useWeaponStore((state) => state.setWeapon);
  const { setWeaponId } = useWeaponIdStore();

  useEffect(() => {
    if (weaponPayload && Array.isArray(weaponPayload.modes)) {
      setModes(weaponPayload.modes);
    }
  }, [weaponPayload]);

  const getFormDefaultValues = () => ({
    weaponSymbol: "",
    foregroundColor: "#FFFFFF",
    backgroundColor: "#1E90FF",
    weaponName: "",
    type: "S",
    priority: "",
    description: "",
    isDisplayStatus: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: getFormDefaultValues(),
  });

  useEffect(() => {
    if (weaponId && weaponPayload) {
      reset(weaponPayload);
      setIsDisplayStatus(Boolean(weaponPayload.isDisplayStatus));
      setIsUnknown(Boolean(weaponPayload.isUnknown));
    } else {
      reset(getFormDefaultValues());
      setIsDisplayStatus(false);
      setIsUnknown(false);
    }
  }, [weaponId, weaponPayload, reset]);

  const watchedValues = watch();
  const weaponName = watch("weaponName");
  const [emitters, setEmitters] = useState([]);
  const [loadingEmitters, setLoadingEmitters] = useState(true);

  useEffect(() => {
    const loadWeaponData = async () => {
      if (!weaponId) {
        console.warn(
          "[fetchWeaponTree] No weaponId provided, skipping API call.",
        );
        return;
      }

      console.log("[fetchWeaponTree] Fetching weapon data for ID:", weaponId);
      setLoadingEmitters(true);

      try {
        const response = await fetchWeaponTree(weaponId);
        console.log("[fetchWeaponTree] Response received:", response);

        if (response?.statusCode === 200 && response?.payload) {
          const weaponData = response.payload;

          // Debug log: raw payload
          console.log("[fetchWeaponTree] Parsed weapon data:", weaponData);

          // --- Map backend keys to form field names ---
          const mappedValues = {
            weaponSymbol: weaponData.symbol || "",
            foregroundColor:
              weaponData.foregroundColor ||
              weaponData.foreGroundColor ||
              "#FFFFFF",
            backgroundColor:
              weaponData.backgroundColor ||
              weaponData.backGroundColor ||
              "#1E90FF",
            weaponName: weaponData.weaponName || "",
            type: weaponData.threatType || "S",
            priority: weaponData.priority || "",
            description: weaponData.description || "",
            isDisplayStatus: Boolean(weaponData.displayStatus),
          };
          console.log(
            "[fetchWeaponTree] Resetting form with values:",
            mappedValues,
          );

          // --- Apply to form ---
          reset(mappedValues);
          setIsDisplayStatus(mappedValues.isDisplayStatus);
          setIsUnknown(false);
          setWeaponTreeData(weaponData);
          console.log("weaponData: ", weaponData);

          // --- Update emitters ---
          setEmitters(weaponData.emitters || []);

          // --- Log final form state ---
          console.log("[fetchWeaponTree] Final form after reset:", watch());
        } else {
          console.warn(
            "[fetchWeaponTree] Unexpected response or no payload:",
            response,
          );
          setEmitters([]);
        }
      } catch (err) {
        console.error("[fetchWeaponTree] Error:", err);
        toast.error("Failed to load weapon data.");
      } finally {
        setLoadingEmitters(false);
      }
    };

    loadWeaponData();
  }, [weaponId, reset]);

  const onSubmit = async (formData) => {
    try {
      const weaponPayload = weaponId ? { ...formData, weaponId } : formData;

      const result = await saveWeapon(weaponPayload);

      // Handle both creation (201) and update (200)
      if (
        (result.statusCode === 201 || result.statusCode === 200) &&
        result.payload?.weaponId
      ) {
        const newWeaponId = result.payload.weaponId;

        const successMsg =
          result.statusCode === 201
            ? "Weapon created successfully!"
            : "Weapon updated successfully!";

        toast.success(successMsg, { position: "top-center" });

        console.log(
          "Redirecting to mission-creation with weaponId:",
          newWeaponId,
        );

        setWeaponId(newWeaponId);
        navigate(`/mission-creation?component=weapon&weaponId=${newWeaponId}`);

        // Refresh sidebar data and UI state
        setCreating(false, null);
        setRefetchSidebarData(!refetchSidebarData);
        return;
      }

      // Fallback for unexpected responses
      toast.error(result?.message || "Weapon save failed. Invalid response.", {
        position: "top-center",
      });
    } catch (err) {
      console.error("Weapon save failed:", err);
      toast.error("Failed to save weapon. Please check console for details.", {
        position: "top-center",
      });
    }
  };

  // Replace the toggleScanType function
  const toggleScanType = useCallback((emitterId, modeId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [`${emitterId}_${modeId}_scan`]: !prev[`${emitterId}_${modeId}_scan`],
    }));
  }, []);

  // Replace the toggleEmParameter function
  const toggleEmParameter = useCallback((emitterId, modeId) => {
    setExpandedStates((prev) => ({
      ...prev,
      [`${emitterId}_${modeId}_param`]: !prev[`${emitterId}_${modeId}_param`],
    }));
  }, []);

  const detachMode = useCallback(
    (modeId) => setModes((prev) => prev.filter((m) => m.id !== modeId)),
    [],
  );
  const handleAddEmitter = () => {
    setCreating(true, weaponId);

    if (!weaponId) {
      toast.error("No weapon selected. Please save the weapon first.");
      return;
    }

    navigate(`/mission-creation?weaponId=${weaponId}&component=emitter`, {
      state: { fromWeapon: true },
    });
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen bg-[#414141] text-white p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {weaponPayload?.weaponName ||
              weaponPayload?.entityName ||
              weaponName ||
              "Untitled Weapon System"}
          </h1>
          <p className="text-gray-300">Add Weapon System details</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:text-[#C5BFFF] hover:bg-transparent cursor-pointer rounded-[4px]"
          >
            Attach Emitter
          </Button>
          <Button
            type="button"
            onClick={handleAddEmitter}
            className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
            disabled={!weaponId}
          >
            <Plus className="w-4 h-4" />
            Add Emitter
          </Button>
          <Button
            type="submit"
            className="bg-[#7B70D6] hover:bg-[#7B70D6] text-white cursor-pointer rounded-[4px]"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Weapon Details Section */}
      <div className="rounded-lg mb-8 pr-[200px]">
        {/* Symbol Section */}
        <div className="flex gap-6 pb-6 mb-6 border-b border-[#fff]/10">
          <div className="border border-dashed border-gray-600 rounded-lg p-2 flex justify-center items-center">
            <div
              className="rounded p-3 min-w-[96px] w-[96px] h-[96px] flex justify-center items-center"
              style={{ backgroundColor: watch("backgroundColor") || "#262424" }}
            >
              <div
                className="font-mono text-lg"
                style={{ color: watch("foregroundColor") || "#00FF00" }}
              >
                {watch("weaponSymbol") || "SYM"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
            <div className="col-span-1 md:col-span-3 lg:col-span-5">
              <Label className="block text-sm font-medium text-gray-300">
                Create Symbol
              </Label>
            </div>
            <FormField
              field={{
                weaponSymbol: formConfig.symbolDetails.weaponSymbol,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
            <FormField
              field={{
                foregroundColor: formConfig.symbolDetails.foregroundColor,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />

            <FormField
              field={{
                backgroundColor: formConfig.symbolDetails.backgroundColor,
              }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>
        </div>

        {/* Core Weapon System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            field={{ weaponName: formConfig.weaponDetails.weaponName }}
            register={register}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
          <div className="flex gap-8">
            <ToggleField
              name="Display Status"
              label="DISPLAY STATUS"
              checked={isDisplayStatus}
              onCheckedChange={(checked) => {
                setIsDisplayStatus(checked);
                setValue("displayStatus", checked, { shouldDirty: true });
              }}
              setValue={setValue}
            />
          </div>
        </div>

        {/* Threat Type & Coordinates */}
        <div className="flex items-center justify-between gap-6 mt-5">
          <div className="flex flex-col flex-1">
            <Label className="block text-sm font-medium text-gray-300 mb-2">
              Threat Type
            </Label>
            <div className="flex gap-3">
              {["S", "T", "U"].map((option) => (
                <Button
                  key={option}
                  type="button"
                  onClick={() =>
                    setValue("type", option.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  className={`px-4 flex-1 py-2 rounded-md text-sm font-medium ${
                    (watch("type") || "S") === option //  default to "S"
                      ? "bg-[#7B70D6] text-white"
                      : "bg-[#FFFFFF0D] text-gray-300"
                  }`}
                >
                  {option.charAt(0) + option.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="flex-1">
            <FormField
              field={{ priority: formConfig.weaponDetails.priority }}
              register={register}
              errors={errors}
              watch={watchedValues}
              setValue={setValue}
            />
          </div>

          <div className="flex-1"></div>
        </div>

        <div className="pt-6 border-b pb-6 border-[#fff]/10">
          <FormField
            field={{ description: formConfig.weaponDetails.description }}
            register={register}
            errors={errors}
            watch={watchedValues}
            setValue={setValue}
          />
        </div>
      </div>

      {/* Modes Section */}
      <div className="rounded-lg">
        <div className=" w-full flex justify-between">
          <h2 className="text-xl font-semibold mb-5 text-white">
            EMITTERS & MODES
          </h2>
          <Button
            type="button"
            variant="ghost"
            className="text-[#c7c1f7] hover:text-white hover:bg-[#7B70D6] flex items-center gap-1 h-8"
          >
            <img src={detach} alt="Detach" className="h-4 w-4" />
            Detach All
          </Button>
        </div>

        {weaponTreeData?.emitters?.map((emitter, index) => (
          <EmitterCard
            key={emitter.emitterId}
            emitter={emitter}
            index={index}
            isLast={index === modes.length - 1}
            toggleScanType={toggleScanType}
            toggleEmParameter={toggleEmParameter}
            detachMode={detachMode}
            expandedStates={expandedStates} // Add this prop
          />
        ))}

        {weaponTreeData?.emitters?.length === 0 && (
          <div className="text-gray-300 text-sm italic">
            No Emitters attached yet. Click “Add Emitter” to create one.
          </div>
        )}
      </div>
    </form>
  );
}
