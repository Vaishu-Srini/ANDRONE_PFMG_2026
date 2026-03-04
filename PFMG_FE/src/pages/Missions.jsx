import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Filter,
  MoreVertical,
  Copy,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import backwardIcon from "@/assets/images/backward.svg";
import forwardIcon from "@/assets/images/forward.svg";
import foldersIcon from "@/assets/images/Folders.svg";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BASE_URL,
  deleteMission,
  generatePfmFile,
} from "../services/AdroneServices";
import { useResponseModal } from "../context/ResponseModalContext";

export default function Missions() {
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { open } = useResponseModal();
  //  Fetch Missions from API
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}Mission/all`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (res.ok && data?.payload) {
          setMissions(data.payload);
        } else {
          console.error("Failed to fetch missions:", data);
          setMissions([]);
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
        setMissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  //  Select All missions rows
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(currentMissions.map((_, index) => startIndex + index));
    } else {
      setSelectedRows([]);
    }
  };

  //  Select Single mission row
  const handleSelectRow = (index, checked) => {
    const actualIndex = startIndex + index;
    if (checked) {
      setSelectedRows((prev) => [...prev, actualIndex]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== actualIndex));
    }
  };

  //  Filter missions (search by mission name or description)
  const filteredMissions = missions?.filter(
    (mission) =>
      mission.missionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  Pagination logic
  const totalItems = filteredMissions?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMissions = filteredMissions?.slice(startIndex, endIndex) || [];
  //  Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  //  Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRowClick = (mission) => {
    // Build URL with both id + name (URLSearchParams auto-encodes)
    const params = new URLSearchParams({
      missionId: String(mission.missionId ?? ""),
      missionName: mission.missionName ?? "",
    });
    navigate(`/ew-config?${params.toString()}`);
  };

  const handleDeleteMission = async (missionId) => {
    open({
      type: "delete",
      title: "Delete Mission",
      message: "Are you sure you want to delete this mission?",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await deleteMission(missionId);
          setMissions((prev) => prev.filter((m) => m.missionId !== missionId));
        } catch (error) {
          console.error("Delete failed:", error);
        }
      },
    });
  };
  //  Delete all selected missions
  const handleDeleteSelected = async () => {
    open({
      type: "delete",
      title: "Delete Selected Missions",
      message: `Are you sure you want to delete ${selectedRows.length} selected mission(s)?`,
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          // Collect IDs of selected missions
          const selectedMissions = selectedRows.map(
            (rowIndex) => filteredMissions[rowIndex]
          );

          for (const mission of selectedMissions) {
            if (mission?.missionId) {
              await deleteMission(mission.missionId);
              console.log(` Deleted mission: ${mission.missionName}`);
            }
          }

          // Update state after deletions
          setMissions((prev) =>
            prev.filter(
              (m) =>
                !selectedMissions.some((sel) => sel.missionId === m.missionId)
            )
          );

          setSelectedRows([]); // Clear selection
        } catch (error) {
          console.error("Error deleting missions:", error);
        }
      },
    });
  };

  return (
    <div className="px-10 py-5 bg-[#414141] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center gap-1.5">
          <h1 className="text-2xl text-white/95 mb-1.5 font-mono not-italic font-medium leading-6 capitalize">
            All Missions
          </h1>
          <p className="text-white/65 font-karla text-xs not-italic font-normal leading-normal capitalize">
            These are entities added in the inventory which are used in PFM.
          </p>
        </div>
        {/* Create Mission Button */}
        <div>
          <div>
            <Button
              size="lg"
              className="bg-[#7B70D6] hover:bg-[#6B60C6] text-white cursor-pointer rounded-sm "
              onClick={() => navigate("/mission-selection")}
            >
              <Plus className="h-6 w-6" />
              <span className="text-white/95 font-karla text-[16px] not-italic font-bold leading-normal capitalize">
                Create Mission
              </span>
            </Button>
          </div>
        </div>
      </div>
      {/* Search and Controls */}
      <div className="flex flex-col gap-5 2xl:flex-row 2xl:justify-between 2xl:items-center py-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
          <Input
            placeholder="Search by mission name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#37383B] border-black/10 text-white/95 placeholder-white/65 font-karla text-[16px] not-italic font-400 leading-6 capitalize  w-[615.333px]  "
          />
        </div>

        <div className="flex items-center gap-6 ">
          <span className="text-[#C5BFFF] font-karla text-[16px] not-italic font-400 leading-6 tracking-[0.353px] capitalize">
            {selectedRows.length} Rows Selected
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="text-white hover:text-white bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed w-6 h-6 p-2"
            >
              <img src={backwardIcon} alt="Previous" />
            </Button>
            <span className="text-white/95 font-karla text-[16px] not-italic font-500 leading-6 tracking-[0.353px] capitalize">
              {totalItems > 0
                ? `${startIndex + 1}-${Math.min(endIndex, totalItems)} of ${totalItems}`
                : "0 of 0"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="text-white hover:text-white bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed w-6 h-6 p-2"
            >
              <img src={forwardIcon} alt="Next" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
            className="text-white border border-white/10 hover:bg-[#C5BFFF] rounded-[4px] cursor-pointer"
          >
            <Trash2 />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white border border-white/10 hover:bg-[#C5BFFF] rounded-[4px] cursor-pointer"
          >
            <Filter />
            <span className="text-white/95 font-karla text-[16px] not-italic font-medium leading-6 capitalize">
              Filter
            </span>
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="bg-[#37383B] rounded-lg overflow-hidden mt-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#C5BFFF]" />
              <p className="text-gray-300 text-sm">Loading missions...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 bg-[#393A3E]">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === currentMissions.length &&
                      currentMissions.length > 0
                    }
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Mission Name
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Type
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Modified Date
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Modified By
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Status
                </TableHead>
                <TableHead className="text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize">
                  Description
                </TableHead>
                <TableHead className="w-12 text-white/95 font-mono text-sm not-italic font-medium leading-6 capitalize"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentMissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="text-center py-13 2xl:px-[443px]"
                  >
                    <div className="flex flex-col items-center gap-6 text-center w-full">
                      <div className="relative bg-[#7C6FD5] h-[84px] w-[84px] rounded-full flex items-center justify-center">
                        <img
                          src={foldersIcon}
                          alt="No missions"
                          className="w-9 h-9 opacity-80"
                        />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-white/95 font-mono text-[16px] 2xl:text-2xl not-italic font-bold leading-8 ">
                          No Mission's is Created Yet
                        </h3>
                        <div className="text-white/70 font-karla text-sm 2xl:text-[16px] not-italic font-medium leading-normal ">
                          <p>Click on “Create Mission” to get started.</p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentMissions.map((mission, index) => (
                  <TableRow
                    key={mission.missionId || index}
                    onClick={() => handleRowClick(mission)}
                    className="border-[#555] bg-[#414141] hover:bg-[#4A4B4E] transition-colors cursor-pointer"
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.includes(startIndex + index)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(index, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize">
                      {mission.missionName}
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize">
                      {mission.missionType}
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize">
                      {new Date(mission.missionDate).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize">
                      {/* {new Date(mission.missionDate).toLocaleString()} */}
                      Admin
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize max-w-xs truncate">
                      {mission.status}
                    </TableCell>
                    <TableCell className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize max-w-xs truncate">
                      {mission.description}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-[#FFFFFF] hover:text-white hover:bg-[#C5BFFF]/20 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#37383B] border-[#555]"
                        >
                          <DropdownMenuItem
                            className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize hover:bg-[#404040] cursor-pointer"
                            onClick={() =>
                              handleDeleteMission(mission.missionId)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-white/95 font-karla text-[16px] not-italic font-normal leading-6 capitalize hover:bg-[#404040] cursor-pointer">
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
}
