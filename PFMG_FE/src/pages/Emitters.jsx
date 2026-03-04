import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Trash2,
  Filter,
  MoreVertical,
  Copy,
  Loader2,
} from "lucide-react";
import backwardIcon from "@/assets/images/backward.svg";
import forwardIcon from "@/assets/images/forward.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

//  JSON Data
import emittersData from "@/json/emitters.json";
import weaponsData from "@/routeData/weapons.json";

//  Icons for each tab
import weaponIcon from "../../src/assets/images/sidebar-icons/Emitters.svg";
import emitterIcon from "../../src/assets/images/sidebar-icons/ico_emitter_24px.svg";
import modeIcon from "../../src/assets/images/sidebar-icons/ico_Mode_24px2x.png";

import {
  fetchAllStandAloneEmitters,
  fetchAllWeaponsSystems,
  fetchAllIndependentModes,
  deleteWeapon,
  deleteStandaloneEmitter,
  deleteIndependentMode,
  fetchAllIndependentJammings,
  deleteIndependentStandaloneJamming,
} from "../services/AdroneServices";
import { useResponseModal } from "../context/ResponseModalContext";

const Emitters = () => {
  const navigate = useNavigate();

  //  Global Response Modal
  const { open } = useResponseModal();

  // --------------------------
  // STATE
  // --------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeTab, setActiveTab] = useState("weapons");
  const [emitters, setEmitters] = useState([]);
  const [modes, setModes] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [jamming, setJamming] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 7;

  // --------------------------
  // LOAD DATA
  // --------------------------

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        //  Fetch real weapons data
        const weaponsListResponse = await fetchAllWeaponsSystems();
        const weaponsList =
          weaponsListResponse?.payload || weaponsListResponse || [];
        setWeapons(weaponsList);

        // Fetch standalone emitters from backend
        const emittersListResponse = await fetchAllStandAloneEmitters();
        const emittersList =
          emittersListResponse?.payload || emittersListResponse || [];
        setEmitters(emittersList);

        // Fetch standalone modes from backend
        const modesListResponse = await fetchAllIndependentModes();
        const modesList = modesListResponse?.payload || modesListResponse || [];
        setModes(modesList);

        const jammingListResponse = await fetchAllIndependentJammings();
        const jammingList =
          jammingListResponse?.payload || jammingListResponse || [];
        console.log("jammingList", jammingList);
        setJamming(jammingList);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // --------------------------
  // TAB CONFIGURATION
  // --------------------------
  const tabOptions = [
    {
      key: "weapons",
      label: "WEAPON SYSTEM",
      color: "#B7AFFF",
      icon: weaponIcon,
    },
    {
      key: "emitters",
      label: "EMITTERS",
      color: "#FFD580",
      icon: emitterIcon,
    },
    {
      key: "modes",
      label: "MODES",
      color: "#8FFFAB",
      icon: modeIcon,
    },
    {
      key: "jamming",
      label: "JAMMING",
      color: "#8FFFAB",
      icon: modeIcon,
    },
  ];

  // --------------------------
  // DATA HANDLING
  // --------------------------
  const currentData =
    activeTab === "emitters"
      ? emitters
      : activeTab === "modes"
        ? modes
        : activeTab === "weapons"
          ? weapons
          : jamming;

  const filterItem = (item) => {
    const searchLower = searchTerm.toLowerCase();
    if (activeTab === "emitters") {
      return (
        item?.entityName?.toLowerCase().includes(searchLower) ||
        item?.createdBy?.toLowerCase().includes(searchLower)
      );
    } else if (activeTab === "modes") {
      return (
        item?.mode?.toLowerCase().includes(searchLower) ||
        item?.createdBy?.toLowerCase().includes(searchLower)
      );
    } else if (activeTab === "weapons") {
      return (
        item?.weaponName?.toLowerCase().includes(searchLower) ||
        item?.createdBy?.toLowerCase().includes(searchLower)
      );
    } else {
      return (
        item?.jammingName?.toLowerCase().includes(searchLower) ||
        item?.createdBy?.toLowerCase().includes(searchLower)
      );
    }
  };

  const filteredData = currentData.filter(filterItem);

  // --------------------------
  // PAGINATION
  // --------------------------
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDataPage = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // --------------------------
  // ROW SELECTION
  // --------------------------
  const handleSelectAll = (checked) =>
    checked
      ? setSelectedRows(currentDataPage.map((_, i) => startIndex + i))
      : setSelectedRows([]);

  const handleSelectRow = (index, checked) => {
    const actualIndex = startIndex + index;
    setSelectedRows((prev) =>
      checked
        ? [...prev, actualIndex]
        : prev.filter((id) => id !== actualIndex),
    );
  };

  // --------------------------
  // TAB CHANGE
  // --------------------------
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setIsTabSwitching(true);
    setActiveTab(tab);
    setSelectedRows([]);
    setTimeout(() => setIsTabSwitching(false), 300);
  };

  // --------------------------
  // ROW NAVIGATION
  // --------------------------

  const handleRowClick = (item) => {
    if (activeTab === "emitters") {
      navigate(
        `/mission-creation?emitterId=${item.emitterId}&component=emitter`,
      );
    } else if (activeTab === "modes") {
      navigate(`/mission-creation?modeId=${item.modeId}&component=mode`);
    } else if (activeTab === "weapons") {
      navigate(`/mission-creation?weaponId=${item.weaponId}&component=weapon`);
    } else if (activeTab === "jamming") {
      navigate(
        `/mission-creation?jammingId=${item.jammingId}&component=jamming`,
      );
    }
  };

  const isDisabled = isLoading || isTabSwitching;

  const getSelectedIdsByTab = () => {
    return selectedRows
      .map((rowIndex) => filteredData[rowIndex])
      .filter(Boolean)
      .map((item) => {
        if (activeTab === "weapons") return item.weaponId;
        if (activeTab === "emitters") return item.emitterId;
        if (activeTab === "modes") return item.modeId;
        if (activeTab === "jamming") return item.jammingId;
        return null;
      })
      .filter(Boolean);
  };

  const handleDeleteSelected = async () => {
    const ids = getSelectedIdsByTab();
    if (ids.length === 0) return;

    // Use the global 'open' function
    open({
      type: "delete",
      title: "Confirm Bulk Delete",
      message: `Are you sure you want to delete ${ids.length} selected ${activeTab.slice(0, -1)} System(s)?`,
      confirmText: "Delete All",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          if (activeTab === "weapons") {
            await Promise.all(ids.map((id) => deleteWeapon(id)));
            setWeapons((prev) => prev.filter((w) => !ids.includes(w.weaponId)));
          } else if (activeTab === "emitters") {
            await Promise.all(ids.map((id) => deleteStandaloneEmitter(id)));
            setEmitters((prev) =>
              prev.filter((e) => !ids.includes(e.emitterId)),
            );
          } else if (activeTab === "modes") {
            await Promise.all(ids.map((id) => deleteIndependentMode(id)));
            setModes((prev) => prev.filter((m) => !ids.includes(m.modeId)));
          } else if (activeTab === "jamming") {
            await Promise.all(
              ids.map((id) => deleteIndependentStandaloneJamming(id)),
            );
            setJamming((prev) =>
              prev.filter((j) => !ids.includes(j.jammingId)),
            );
          }

          setSelectedRows([]);

          // Optional: Show success after deletion
          open({
            type: "success",
            title: "Deleted",
            message: "Items removed successfully.",
          });
        } catch (error) {
          console.error("Bulk delete failed:", error);
          open({
            type: "error",
            title: "Error",
            message: "Failed to delete items.",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleSingleDelete = async (item) => {
    open({
      type: "delete",
      title: `Delete ${activeTab.slice(0, -1).toUpperCase()}`,
      message: `Are you sure you want to delete this ${activeTab.slice(0, -1)} System?`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          if (activeTab === "weapons") {
            await deleteWeapon(item.weaponId);
            setWeapons((prev) =>
              prev.filter((w) => w.weaponId !== item.weaponId),
            );
          } else if (activeTab === "emitters") {
            await deleteStandaloneEmitter(item.emitterId);
            setEmitters((prev) =>
              prev.filter((e) => e.emitterId !== item.emitterId),
            );
          } else if (activeTab === "modes") {
            await deleteIndependentMode(item.modeId);
            setModes((prev) => prev.filter((m) => m.modeId !== item.modeId));
          } else if (activeTab === "jamming") {
            await deleteIndependentStandaloneJamming(item.jammingId);
            setJamming((prev) =>
              prev.filter((j) => j.jammingId !== item.jammingId),
            );
          }

          setSelectedRows([]);

          // Optional: Show success after deletion
        } catch (error) {
          console.error("Delete failed:", error);
          open({
            type: "error",
            title: "Error",
            message: "Failed to delete item.",
          });
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  // --------------------------
  // RENDER
  // --------------------------

  return (
    <div className="min-h-screen bg-[#414141] text-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              {activeTab === "weapons"
                ? "Weapons System Database"
                : activeTab === "emitters"
                  ? "Emitters Database"
                  : "Modes Database"}
            </h1>
            <p className="text-gray-400 text-sm">
              These are entities added in the inventory which are used in PFM.
            </p>
          </div>

          <Button
            className="bg-[#7B70D6] hover:bg-[#6B60C6] text-white font-semibold"
            onClick={() => {
              // Navigate to EntitySelection and pass active tab as state
              navigate("/Emitter-Type-Selection", {
                state: { defaultType: activeTab },
              });
            }}
          >
            + Create New
          </Button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`Search by ${activeTab} name or author`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isDisabled}
            className={`pl-10 bg-[#37383B] border-[#555] text-white placeholder-gray-400 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#C5BFFF] text-sm">
            {selectedRows.length} Rows Selected
          </span>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousPage}
              disabled={isDisabled || currentPage === 1}
              className={`bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 ${
                isDisabled || currentPage === 1 ? "opacity-50" : ""
              }`}
            >
              <img src={backwardIcon} alt="Previous" className="h-4 w-4" />
            </Button>

            <span className="text-white text-sm">
              {totalItems > 0
                ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
                : "0 of 0"}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={
                isDisabled || currentPage === totalPages || totalPages === 0
              }
              className={`bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 ${
                isDisabled || currentPage === totalPages ? "opacity-50" : ""
              }`}
            >
              <img src={forwardIcon} alt="Next" className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled || selectedRows.length === 0}
            className="border border-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className="border border-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Tabs Section (MAP-based) */}
      <div className="mb-6">
        <div className="flex justify-center gap-10 border-b border-[#555] pb-3">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              disabled={isTabSwitching}
              className={`flex flex-col flex-1 items-center gap-1 transition-all duration-200 ${
                activeTab === tab.key
                  ? "scale-105 border-b-2 border-[#7B70D6]"
                  : "hover:opacity-80"
              } ${isTabSwitching ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-3 cursor-pointer">
                {/* <img
                  src={tab.icon}
                  alt={tab.label}
                  className={`w-6 h-6 mb-1 ${
                    activeTab === tab.key ? "opacity-100" : "opacity-60"
                  }`}
                /> */}
                <span
                  className="text-sm font-semibold"
                  style={{
                    // color: activeTab === tab.key ? tab.color : "#AAA",
                    color: activeTab === tab.key ? "#AAA" : "#AAA",
                  }}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#37383B] rounded-lg overflow-hidden">
        {isDisabled ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5BFFF]" />
            <span className="ml-3 text-white">Loading {activeTab}...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#555] bg-[#393A3E] text-sm">
                <TableHead className="w-12">
                  <Checkbox
                    // checked={
                    //   selectedRows.length === currentDataPage.length &&
                    //   currentDataPage.length > 0
                    // }

                    checked={
                      currentDataPage.length > 0 &&
                      currentDataPage.every((_, i) =>
                        selectedRows.includes(startIndex + i),
                      )
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-white font-medium">
                  {activeTab === "emitters"
                    ? "Emitter Name"
                    : activeTab === "modes"
                      ? "Mode Name"
                      : activeTab === "weapons"
                        ? "Weapon Name"
                        : "Jamming Name"}
                </TableHead>
                <TableHead className="text-white font-medium">
                  Created By
                </TableHead>
                <TableHead className="text-white font-medium">
                  Created Date
                </TableHead>
                <TableHead className="text-white font-medium">
                  Modified By
                </TableHead>
                <TableHead className="text-white font-medium">
                  Modified Date
                </TableHead>
                <TableHead className="text-white font-medium">
                  Description
                </TableHead>
                <TableHead className="text-white font-medium"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentDataPage.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    <div className="text-center text-gray-300">
                      No {activeTab} Found
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentDataPage.map((item, index) => (
                  <TableRow
                    // key={item.id || index}
                    key={
                      activeTab === "weapons"
                        ? item.weaponId
                        : activeTab === "emitters"
                          ? item.emitterId
                          : activeTab === "modes"
                            ? item.modeId
                            : item.jammingId
                    }
                    className="border-[#555] bg-[#414141] hover:bg-[#4A4B4E] cursor-pointer"
                    onClick={(e) => {
                      if (e.target.closest('input[type="checkbox"]')) return;
                      handleRowClick(item);
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(startIndex + index)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(index, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {activeTab === "emitters"
                        ? item.emitterName
                        : activeTab === "modes"
                          ? item.modeName
                          : activeTab === "weapons"
                            ? item.weaponName
                            : item.jammingName}
                    </TableCell>
                    <TableCell>{item.createdBy}</TableCell>
                    <TableCell>{item.createdDate}</TableCell>
                    <TableCell>{item.modifiedBy}</TableCell>
                    <TableCell>{item.modifiedDate}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 rounded text-gray-400 hover:text-white hover:bg-[#C5BFFF]/20"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#37383B] border-[#555]"
                        >
                          <DropdownMenuItem className="text-white hover:bg-[#404040]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSingleDelete(item);
                              }}
                              className="flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </button>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-[#404040]">
                            <Copy className="h-4 w-4 mr-2" /> Copy
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Emitters;
