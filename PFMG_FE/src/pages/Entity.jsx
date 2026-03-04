import { useState, useEffect } from "react";
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
import entitiesData from "@/json/entities.json";
const Entity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntities(entitiesData.entities);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Select All entities rows
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(currentEntities.map((_, index) => startIndex + index));
    } else {
      setSelectedRows([]);
    }
  };

  // Select Single entity row
  const handleSelectRow = (index, checked) => {
    const actualIndex = startIndex + index;
    if (checked) {
      setSelectedRows((prev) => [...prev, actualIndex]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== actualIndex));
    }
  };

  const filteredEntities = entities.filter(
    (entity) =>
      entity.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.manufacture.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredEntities?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntities = filteredEntities?.slice(startIndex, endIndex) || [];

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="min-h-screen bg-[#414141] text-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Heading</h1>
            <p className="text-gray-300 text-sm">
              These are entity added in the inventory which is being used in
              PFM.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-transparent border-[#C5BFFF] text-[#C5BFFF] hover:bg-[#C5BFFF]/10"
            >
              Import
            </Button>
            <Button className="bg-[#7B70D6] hover:bg-[#6B60C6] text-white cursor-pointer">
              + Add
            </Button>
          </div>
        </div>
      </div>
      {/* Search and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by mission name or by author name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#37383B] border-[#555] text-white placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#C5BFFF] text-sm">
            {selectedRows.length} Rows Selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-white bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[4px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
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
              className="text-white hover:text-white bg-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[4px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <img src={forwardIcon} alt="Next" className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white border border-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[4px] cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white border border-[#C5BFFF]/10 hover:bg-[#C5BFFF]/20 rounded-[4px] cursor-pointer"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#37383B] rounded-lg overflow-hidden">
        {/* Data Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-[#C5BFFF]" />
              <p className="text-gray-300 text-sm">Loading entities...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#555] bg-[#393A3E] text-sm first:rounded-t-lg font-medium font-mono">
                <TableHead className="w-12 first:rounded-tl-lg text-white">
                  <Checkbox
                    checked={
                      selectedRows.length === currentEntities.length &&
                      currentEntities.length > 0
                    }
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </TableHead>
                <TableHead className="text-white">Entity</TableHead>
                <TableHead className="text-white">Entity Id</TableHead>
                <TableHead className="text-white">Manufacture</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Class</TableHead>
                <TableHead className="text-white">Endurance</TableHead>
                <TableHead className="text-white">Registered</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="w-12 last:rounded-tr-lg text-white"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEntities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center gap-6 text-center">
                      <div className="relative bg-[#7C6FD5] h-[84px] w-[84px] rounded-full flex items-center justify-center">
                        <div className="w-9 h-9 bg-gray-300 rounded opacity-80"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white font-mono">
                          No Entities Found
                        </h3>
                        <div className="space-y-1 text-sm text-gray-300">
                          <p>
                            Currently there are no entities matching your search
                            criteria.
                          </p>
                          <p>
                            Try adjusting your search terms or add new entities.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentEntities.map((entity, index) => (
                  <TableRow
                    key={entity.id}
                    className={`border-[#555] bg-[#414141] text-base ${index === currentEntities.length - 1 ? "last:rounded-b-lg" : ""}`}
                  >
                    <TableCell
                      className={`${index === currentEntities.length - 1 ? "first:rounded-bl-lg" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={selectedRows.includes(startIndex + index)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(index, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-3">
                        <div className="w-[60px] h-[48px] bg-[#D9D9D9] rounded flex-shrink-0"></div>
                        <span>{entity.entity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.entityId}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.manufacturer}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.category}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.class}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.endurance}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.registered}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {entity.status}
                    </TableCell>
                    <TableCell
                      className={
                        index === currentEntities.length - 1
                          ? "last:rounded-br-lg"
                          : ""
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-[4px] text-gray-400 hover:text-white hover:bg-[#C5BFFF]/20 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#37383B] border-[#555]"
                        >
                          <DropdownMenuItem className="text-white hover:bg-[#404040]">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-[#404040]">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
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
export default Entity;
