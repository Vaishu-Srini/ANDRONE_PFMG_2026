import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, X, Check } from "lucide-react";

// TODO: Replace with real API call
const MOCK_SCENARIOS = [
  { id: 1, name: "Shoot And Scoot 2", date: "03 Mar 2025", phases: 7 },
  { id: 2, name: "Shoot And Scoot 2", date: "01 Aug 2028", phases: 3 },
  { id: 3, name: "Shoot And Scoot 2", date: "15 Apr 2024", phases: 3 },
  { id: 4, name: "Shoot And Scoot 2", date: "27 Feb 2027", phases: 3 },
];

const LoadScenarioModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const handleRowClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const handlePreview = (e, scenario) => {
    e.stopPropagation();
    const params = new URLSearchParams({
      id: scenario.id,
      name: scenario.name,
      date: scenario.date,
      phases: scenario.phases,
    });
    window.open(`/scenario-preview?${params.toString()}`, "_blank");
  };

  const handleLoad = () => {
    const scenario = MOCK_SCENARIOS.find((s) => s.id === selectedId);
    if (!scenario) return;
    console.log("Loading scenario into form:", scenario);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* [&>button]:hidden hides shadcn's default close X */}
      <DialogContent
        className="max-w-4xl bg-[#2C2D30] border-[#545454] text-white p-0 gap-0 overflow-hidden shadow-2xl rounded-xl [&>button]:hidden"
        aria-describedby="load-scenario-desc"
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-center px-8 pt-7 pb-3">
          {/* This is the REAL DialogTitle — Radix needs it for a11y */}
          <DialogTitle className="text-base font-mono tracking-wide font-semibold text-gray-100">
            Load Jamming Scenarios
          </DialogTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-8 pb-6">
          {/* This is the REAL DialogDescription — Radix needs it for a11y */}
          <DialogDescription
            id="load-scenario-desc"
            className="text-sm font-mono text-gray-500 mb-5"
          >
            Select A Scenario To Load
          </DialogDescription>

          {/* Table Container */}
          <div className="rounded-lg overflow-hidden border border-[#545454]/40">
            {/* Table Header */}
            <div className="grid grid-cols-[40px_2fr_1.5fr_1fr_44px] items-center bg-[#393A3E] px-4 py-3">
              <div />
              <span className="text-[13px] text-gray-400 font-medium font-mono">
                Scenario Name
              </span>
              <span className="text-[13px] text-gray-400 font-medium font-mono">
                Created Date
              </span>
              <span className="text-[13px] text-gray-400 font-medium font-mono">
                Phase No's
              </span>
              <div />
            </div>

            {/* Table Rows */}
            <div>
              {MOCK_SCENARIOS.map((scenario, index) => {
                const isSelected = selectedId === scenario.id;
                const isHovered = hoveredId === scenario.id;

                return (
                  <div
                    key={scenario.id}
                    onClick={() => handleRowClick(scenario.id)}
                    onMouseEnter={() => setHoveredId(scenario.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`
                      grid grid-cols-[40px_2fr_1.5fr_1fr_44px] items-center px-4 py-5
                      cursor-pointer transition-colors duration-150
                      ${
                        isSelected
                          ? "bg-[#4A4A5A]"
                          : isHovered
                            ? "bg-[#353638]"
                            : "bg-[#2C2D30]"
                      }
                      ${
                        index < MOCK_SCENARIOS.length - 1
                          ? "border-b border-white/[0.04]"
                          : ""
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center justify-center">
                      <div
                        className={`
                          w-[18px] h-[18px] rounded flex items-center justify-center
                          transition-all duration-150 border
                          ${
                            isSelected
                              ? "bg-[#7B70D6] border-[#7B70D6]"
                              : "bg-transparent border-[#6b7280]"
                          }
                        `}
                      >
                        {isSelected && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>

                    {/* Scenario Name */}
                    <span
                      className={`text-[15px] font-medium font-mono ${
                        isSelected ? "text-gray-300" : "text-gray-200"
                      }`}
                    >
                      {scenario.name}
                    </span>

                    {/* Created Date */}
                    <span
                      className={`text-[15px] font-mono ${
                        isSelected ? "text-gray-400" : "text-gray-300"
                      }`}
                    >
                      {scenario.date}
                    </span>

                    {/* Phases */}
                    <span
                      className={`text-[15px] font-mono ${
                        isSelected ? "text-gray-400" : "text-gray-300"
                      }`}
                    >
                      Phases {scenario.phases}
                    </span>

                    {/* Preview Eye Icon */}
                    <button
                      type="button"
                      onClick={(e) => handlePreview(e, scenario)}
                      className="flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer p-1"
                      title="Preview Scenario"
                    >
                      <Eye strokeWidth={1.5} className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-8 pb-7 pt-2">
          <Button
            type="button"
            onClick={handleLoad}
            disabled={!selectedId}
            className="bg-[#7B70D6] hover:bg-[#6a60c5] text-white px-8 py-2.5 rounded-lg
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors font-medium text-sm"
          >
            Load Scenario
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadScenarioModal;
