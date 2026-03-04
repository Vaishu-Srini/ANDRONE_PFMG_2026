import React, { useRef, useState } from "react";
import { Search, X, Plus, ChevronDown } from "lucide-react";
import Draggable from "react-draggable";
import { PopoverContent } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import sitemap from "../../assets/images/sitemap.jpg";

const LATITUDE_OPTIONS = [
  "38.89744", // Washington DC
  "40.71280", // NYC
  "51.50740", // London
  "12.97160", // Bangalore
  "17.38500", // Hyderabad
  "35.67620", // Tokyo
];

const LONGITUDE_OPTIONS = [
  "-77.03968",
  "-74.00600",
  "-0.12780",
  "77.59460",
  "78.48670",
  "139.65030",
];

const AssignSite = (props) => {
  const {
    onClose = () => {},
    sites = [
      {
        id: "1",
        name: "Bangalore-Hyderabad",
        image: sitemap,
        //  "https://csspicker.dev/api/image/?q=map+terrain&image_type=photo",
        isAssigned: true,
      },
      {
        id: "2",
        name: "Site Name",
        image: sitemap,
        // "https://csspicker.dev/api/image/?q=map+terrain&image_type=photo",
      },
      {
        id: "3",
        name: "Site Name",
        image: sitemap,
        // "https://csspicker.dev/api/image/?q=map+terrain&image_type=photo",
      },
    ],
  } = props;

  // State for Latitude and Longitude
  const [selectedLat, setSelectedLat] = useState(LATITUDE_OPTIONS[0]);
  const [selectedLng, setSelectedLng] = useState(LONGITUDE_OPTIONS[0]);

  //  Add State for Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  // Filter logic: Check if site name includes the search query (case insensitive)
  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PopoverContent
      forceMount
      sideOffset={8}
      className="!fixed left-0 -top-20 w-auto bg-transparent border-none shadow-none"
      style={{ zIndex: 9999 }}
    >
      <Draggable
        handle=".drag-handle"
        position={position}
        onStop={(_, data) => setPosition({ x: data.x, y: data.y })}
        nodeRef={nodeRef}
      >
        <div
          ref={nodeRef}
          className="w-[400px] bg-[#2a2a2a] rounded-[8px] shadow-2xl text-white font-mono"
        >
          {/* Header */}
          <div className="drag-handle flex items-center justify-between px-4 py-2 border-b border-black/10 cursor-move">
            <h2 className="text-white/95 font-mono text-sm not-italic font-medium leading-normal">
              Assign Site
            </h2>

            <PopoverClose asChild>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </PopoverClose>
          </div>

          {/* Search */}
          <div className="p-4 bg-[#4B4C4E]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              {/* Connect Input to State */}
              <input
                type="text"
                placeholder="Search Site"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#37383B] text-white/65 pl-10 pr-4 py-2 rounded text-base placeholder-white/65  placeholder-text-base font-karla font-normal leading-6 focus:outline-none focus:ring-1 focus:ring-gray-600"
              />
            </div>
          </div>

          {/* Map Properties */}
          <div className="px-4 pb-4 mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/95 font-mono text-xs not-italic font-medium leading-normal">
                Map Properties
              </h3>
              <button className="text-xs text-[#C5BFFF] font-mono underline font-medium not-italic leading-normal transition-colors">
                Save Site
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              {/* Latitude Dropdown */}
              <div>
                <label className="text-xs text-white/70 font-karla not-italic font-medium leading-normal mb-2 block">
                  Latitude
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 hover:bg-[#404040] transition-colors">
                      <span className="text-white/95 font-karla text-base not-italic font-medium leading-normal">
                        {selectedLat}
                      </span>
                      <ChevronDown
                        size={28}
                        className="text-gray-400 border-l border-gray-600 pl-3 h-6  text-center"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px] bg-[#3a3a3a] border border-gray-600 text-white z-[10000]">
                    {LATITUDE_OPTIONS.map((lat) => (
                      <DropdownMenuItem
                        key={lat}
                        onClick={() => setSelectedLat(lat)}
                        className="cursor-pointer hover:bg-[#4a4a4a] focus:bg-[#4a4a4a] py-2 px-4"
                      >
                        {lat}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Longitude Dropdown */}
              <div>
                <label className="text-xs text-white/70 font-karla not-italic font-medium leading-normal mb-2 block">
                  Longitude
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-[#3a3a3a] text-gray-300 px-4 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 hover:bg-[#404040] transition-colors">
                      <span className="text-white/95 font-karla text-base not-italic font-medium leading-normal">
                        {selectedLng}
                      </span>
                      <ChevronDown
                        size={28}
                        className="text-gray-400 border-l border-gray-600 pl-3 h-6"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[180px] bg-[#3a3a3a] border border-gray-600 text-white z-[10000]">
                    {LONGITUDE_OPTIONS.map((lng) => (
                      <DropdownMenuItem
                        key={lng}
                        onClick={() => setSelectedLng(lng)}
                        className="cursor-pointer hover:bg-[#4a4a4a] focus:bg-[#4a4a4a] py-2 px-4"
                      >
                        {lng}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Site List */}
          <div className="px-4 pb-0">
            <h3 className=" text-white/95 font-mono text-xs not-italic font-medium leading-normal mb-3">
              Select a Site to Assign
            </h3>
            <div>
              {/* 4. Map over filteredSites instead of sites */}
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <div
                    key={site.id}
                    className="flex items-center justify-between bg-[rgba(55,56,59,0.95)] py-2 px-4  hover:bg-white/10 transition-colors border-b border-black/10"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <img
                        src={site.image}
                        alt={site.name}
                        className="w-15 h-15 rounded object-cover"
                      />
                      <span className="text-white/95 font-mono text-sm not-italic font-medium leading-normal">
                        {site.name}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-white transition-colors">
                      {site.isAssigned ? <X size={20} /> : <Plus size={20} />}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 text-xs py-2">
                  No sites found
                </div>
              )}
            </div>
          </div>

          <div className=" py-3 px-6 flex justify-end">
            <button className=" px-4.5 py-1.5 bg-[#7B70D6] hover:bg-[#C5BFFF] text-white/95 font-karla rounded text-sm font-bold leading-normal transition-colors">
              Add Site
            </button>
          </div>
        </div>
      </Draggable>
    </PopoverContent>
  );
};

export default AssignSite;
