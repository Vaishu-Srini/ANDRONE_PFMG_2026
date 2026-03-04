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
  Plus,
  Download,
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
import Data from "@/json/Generated.json";
import LoadingToast from "./LoadingToast";
import SuccessToast from "./SuccessToast";
import { ToastContainer, toast } from "react-toastify";

const PfmGenFile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntities(Data);
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

  const filteredEntities = (entities || []).filter(
    (entity) =>
      entity.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.missionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.createdDate.toLowerCase().includes(searchTerm.toLowerCase())
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

  const triggerToast = (loadingMsg, successMsg) => {
    const id = toast(<LoadingToast text={loadingMsg} />, {
      autoClose: false,
      closeButton: false,
    });

    setTimeout(() => {
      toast.update(id, {
        render: <SuccessToast text={successMsg} />,
        autoClose: 2000,
        closeButton: false,
      });
    }, 2500);
  };

  // vaishnavi change {24/12/2025 02:30pm} and {29/12/2025 9:30am}
  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="flex-col-6">
        <h1 className="page-heading text-primary">All Files</h1>
        <p className="page-subheading text-secondary">
          These are entities added in the inventory which are used in PFM.
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex-col-gap-5 flex-row-between-2xl py-5">
        <div className="flex-item-md ">
          <Search className="input-icon-left sq-5 text-emphasis" />
          <Input
            placeholder="Search by File name or by Mission Id"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-graphite black-soft-border text-primary input-text w-fixed-md "
          />
        </div>

        <div className="flex-row-6">
          <span className="text-accent info-text">
            {selectedRows.length} Rows Selected
          </span>
          <div className="flex-row-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary btn-lavender btn-disabled sq-6 p-2"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <img src={backwardIcon} alt="Previous" />
            </Button>
            <span className="info-text text-primary">
              {totalItems > 0 ? (
                <>
                  <span className="font-medium">
                    {startIndex + 1}-{Math.min(endIndex, totalItems)}
                  </span>
                  <span className="font-bold"> of {totalItems}</span>
                </>
              ) : (
                <>
                  <span className="font-medium">0</span>
                  <span className="font-bold"> of 0</span>
                </>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary btn-lavender btn-disabled sq-6 p-2"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <img src={forwardIcon} alt="Next" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="btn-outline"
            onClick={() =>
              triggerToast("Downloading 10 Files...", "4 Files Downloaded")
            }
          >
            <Download />
          </Button>
          <Button variant="ghost" size="sm" className="btn-outline">
            <Trash2 />
          </Button>
          <Button variant="ghost" size="sm" className="btn-outline">
            <Filter /> <span className="btn-text-sm">Filter</span>
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#37383B] rounded-lg overflow-hidden">
        {/* Data Table */}
        {isLoading ? (
          <div className="flex-center py-12">
            <div className="flex-col-4">
              <Loader2 className="sq-8 spin text-accent" />
              <p className="text-primary info-text">Loading entities...</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="table-container">
                <TableHead className="w-12 last:rounded-tr-lg">
                  <Checkbox
                    checked={
                      selectedRows.length === currentEntities.length &&
                      currentEntities.length > 0
                    }
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  File Name
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  Mission ID
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  Created date
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  Created by
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  File Size
                </TableHead>
                <TableHead className="text-primary table-header-text">
                  Description
                </TableHead>
                <TableHead className="w-12 last:rounded-tr-lg text-primary table-header-text"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEntities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-16">
                    <div className="flex-col-2 text-center">
                      <div className="relative sq-21 flex-center bg-highlight rounded-full">
                        <div className="opacity-80"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-primary text-mono-heading ">
                          No Entities Found
                        </h3>
                        <div className="text-emphasis-strong text-body-medium">
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
                currentEntities.map((data, index) => (
                  <TableRow
                    key={data.missionId}
                    className={`border-neutral surface-active surface-hover-strong transition-colors cursor-pointer ${index === currentEntities.length - 1 ? "last:rounded-b-lg" : ""}`}
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
                    <TableCell className="text-primary table-cell-text">
                      <div className="flex items-center gap-3">
                        <span>{data.fileName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary table-cell-text">
                      {data.missionId}
                    </TableCell>
                    <TableCell className="text-primary table-cell-text">
                      {data.createdDate}
                    </TableCell>
                    <TableCell className="text-primary table-cell-text">
                      {data.createdBy}
                    </TableCell>
                    <TableCell className="text-primary table-cell-text">
                      {data.fileSize}
                    </TableCell>
                    <TableCell className="text-primary table-cell-text">
                      {data.description}
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
                            className="sq-6 p-0 btn-transparent text-primary cursor-pointer"
                          >
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-graphite border-neutral"
                        >
                          <DropdownMenuItem className="text-primary table-cell-text hover-bg-surface cursor-pointer">
                            <Trash2 className=" mr-2" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-primary table-cell-text hover-bg-surface cursor-pointer">
                            <Copy className=" mr-2" />
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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        closeButton={false}
        draggable
      />
    </div>
  );
};
export default PfmGenFile;
