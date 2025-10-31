"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendor/ui/table";
import { Button } from "@/components/vendor/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/vendor/ui/select";
import { Search, Calendar } from "lucide-react";
import { ReactNode } from "react";
import { Calendar as CalendarComponent } from "@/components/vendor/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/vendor/ui/popover";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => ReactNode;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Filter {
  label: string;
  type?: "select" | "dateRange";
  options?: { label: string; value: string }[];
  onSelect?: (value: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
  dateRange?: DateRange;
}

interface DataTableProps<T> {
  data: T[];
  heading?: string;
  columns: Column<T>[];
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableSearch?: boolean;
  filters?: Filter[];
  onSearch?: (query: string) => void;
  currentPage?: number;
  rowsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  rowActions?: (item: T) => ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  heading,
  columns,
  enableSelection = false,
  enablePagination = true,
  enableSearch = false,
  filters = [],
  onSearch,
  currentPage = 1,
  rowsPerPage = 7,
  totalItems = 0,
  onPageChange,
  onRowsPerPageChange,
  onSelectionChange,
  rowActions,
}: DataTableProps<T>) {
  const handleSelectionChange = (selectedItems: T[]) => {
    onSelectionChange?.(selectedItems);
  };

  const getNestedValue = (obj: T, path: string): string => {
    return (
      path
        .split(".")
        .reduce((acc, key) => {
          if (acc && typeof acc === "object") {
            return (acc as Record<string, unknown>)[key];
          }
          return undefined;
        }, obj as unknown)
        ?.toString() ?? ""
    );
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const getPageNumbers = (mobile = false) => {
    const pageNumbers = [];
    const maxVisiblePages = mobile ? 3 : 5;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfMaxVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="w-full">
      {/* mobile */}
      {(enableSearch || filters.length > 0) && (
        <div className="flex flex-col gap-y-3 pb-4 rounded-[16px] w-full lg:hidden">
          <div className="">
            {enableSearch && (
              <div className="flex-1 relative w-full">
                <input
                  id="search"
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none placeholder:pl-4"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
                <div className="absolute inset-y-0 left-4 top-1 flex items-center justify-center w-8 h-8 bg-[#FBF7F1] rounded-full">
                  <Search className="h-5 w-5 text-[#F8A317]" />
                </div>
              </div>
            )}
          </div>
          {filters.length > 0 && (
            <div className="grid grid-cols-3 gap-x-2 w-auto">
              {filters.map((filter, index) =>
                filter.type === "dateRange" ? (
                  <Popover key={index}>
                    <PopoverTrigger
                      asChild
                      className="bg-white border border-[#EEEEEE] rounded-sm"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {filter.label}
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex bg-[#FFFFFF] gap-2 p-3">
                        <div>
                          <div className="mb-2 font-medium">Start Date</div>
                          <CalendarComponent
                            mode="single"
                            selected={filter.dateRange?.from}
                            onSelect={(date) =>
                              filter.onDateRangeChange?.({
                                from: date || undefined,
                                to: filter.dateRange?.to,
                              })
                            }
                            initialFocus
                          />
                        </div>
                        <div>
                          <div className="mb-2 font-medium">End Date</div>
                          <CalendarComponent
                            mode="single"
                            selected={filter.dateRange?.to}
                            onSelect={(date) =>
                              filter.onDateRangeChange?.({
                                from: filter.dateRange?.from,
                                to: date || undefined,
                              })
                            }
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Select key={index} onValueChange={filter.onSelect}>
                    <SelectTrigger className="w-full rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] w-md:[150px]">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#FFFFFF]">
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              )}
            </div>
          )}
        </div>
      )}
      {/* desktop */}
      {(enableSearch || filters.length > 0) && (
        <div
          className={cn(
            "flex gap-x-2 items-center justify-between bg-white px-4 py-6 rounded-t-[16px] w-full overflow-x-auto no-scrollbar xl:p-8",
            !heading && "p-0"
          )}
        >
          <div className="flex items-center justify-center gap-x-5">
            <h1 className="font-semibold text-lg/6 lg:text-2xl/8">{heading}</h1>
            {enableSearch && (
              <div className="hidden flex-1 relative max-w-[400px] lg:block">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-16 pr-4 py-2 border rounded-sm h-10 outline-none"
                  onChange={(e) => onSearch?.(e.target.value)}
                />
                <div className="absolute inset-y-0 left-4 top-1 flex items-center justify-center w-8 h-8 bg-[#FBF7F1] rounded-full">
                  <Search className="h-5 w-5 text-[#F8A317]" />
                </div>
              </div>
            )}
          </div>
          {filters.length > 0 && (
            <div className="hidden items-center gap-x-3 lg:flex">
              {filters.map((filter, index) =>
                filter.type === "dateRange" ? (
                  <Popover key={index}>
                    <PopoverTrigger
                      asChild
                      className="bg-white border border-[#EEEEEE] rounded-sm"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        {filter.label}
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex bg-[#FFFFFF] gap-2 p-3">
                        <div>
                          <div className="mb-2 font-medium">Start Date</div>
                          <CalendarComponent
                            mode="single"
                            selected={filter.dateRange?.from}
                            onSelect={(date) =>
                              filter.onDateRangeChange?.({
                                from: date || undefined,
                                to: filter.dateRange?.to,
                              })
                            }
                            initialFocus
                          />
                        </div>
                        <div>
                          <div className="mb-2 font-medium">End Date</div>
                          <CalendarComponent
                            mode="single"
                            selected={filter.dateRange?.to}
                            onSelect={(date) =>
                              filter.onDateRangeChange?.({
                                from: filter.dateRange?.from,
                                to: date || undefined,
                              })
                            }
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Select key={index} onValueChange={filter.onSelect}>
                    <SelectTrigger className="w-[150px] rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#FFFFFF]">
                      {filter.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              )}
            </div>
          )}
        </div>
      )}

      <div className="rounded-md overflow-x-auto">
        <Table className="min-w-full sm:min-w-[800px] md:min-w-0">
          <TableHeader className="bg-[#FFFBED] border-t-2 border-b-2 border-primary">
            <TableRow>
              {enableSelection && (
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessorKey)}
                  className="min-w-[120px] sm:min-w-[150px] whitespace-nowrap"
                >
                  {column.header}
                </TableHead>
              ))}
              {rowActions && (
                <TableHead className="min-w-[100px] whitespace-nowrap">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#FFFFFF] rounded-b-2xl">
            {data.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={
                    columns.length + 
                    (enableSelection ? 1 : 0) + 
                    (rowActions ? 1 : 0)
                  } 
                  className="text-center py-12 text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  {enableSelection && (
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={() => handleSelectionChange([item])}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={`${item.id}-${String(column.accessorKey)}`}
                      className="min-w-[120px] sm:min-w-[150px] px-3 py-4"
                    >
                      <div
                        className="max-w-[200px] truncate"
                        title={
                          column.cell
                            ? undefined
                            : getNestedValue(item, String(column.accessorKey))
                        }
                      >
                        {column.cell
                          ? column.cell(item)
                          : getNestedValue(item, String(column.accessorKey))}
                      </div>
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="min-w-[100px] px-3 py-4">
                      {rowActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-3 sm:p-4">
          <div className="text-xs sm:text-sm flex gap-1 sm:gap-2 items-center text-muted-foreground">
            <span className="whitespace-nowrap">
              {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, totalItems)} of {totalItems}
            </span>
            <div className="whitespace-nowrap">Row/Page:</div>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => onRowsPerPageChange?.(parseInt(value))}
            >
              <SelectTrigger className="w-[60px] sm:w-[70px] ml-1 sm:ml-2 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="7">7/12</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1 sm:gap-2 overflow-x-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-xs hidden sm:flex"
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
            >
              ⟪
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-xs"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </Button>
            {/* Mobile pagination numbers */}
            <div className="flex gap-1 sm:hidden overflow-x-auto">
              {getPageNumbers(true).map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 flex items-center text-xs"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-[32px] p-1 text-xs shrink-0"
                    onClick={() => onPageChange?.(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            {/* Desktop pagination numbers */}
            <div className="hidden sm:flex gap-2">
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 flex items-center text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 min-w-[32px] p-1 text-xs"
                    onClick={() => onPageChange?.(page as number)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-xs"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 text-xs hidden sm:flex"
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⟫
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
