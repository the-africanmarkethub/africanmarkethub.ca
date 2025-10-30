"use client";
import { Edit, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/vendor/ui/button";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import { useState } from "react";
import { Badge } from "@/components/vendor/ui/badge";
// import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/vendor/ui/dropdown-menu";
import { useGetTickets } from "@/hooks/vendor/useGetTickets";
import { tv } from "tailwind-variants";
import TableSkeletonLoader from "../TableSkeletonLoader";

const ticketingTable = tv({
  slots: {
    dropdownMenuContent:
      "space-y-4 bg-white py-[1.625rem] px-10 border-[#A9A9A933] border rounded-[5px] shadow-[0_4px_4px_0px_rgba(0, 0, 0, 0.25)]",
    dropdownButton:
      "bg-white p-0 h-fit flex-center text-[14px] leading-[14px] hover:bg-white",
    dropdownIcon: "w-6 h-6",
  },
});

const { dropdownMenuContent, dropdownButton, dropdownIcon } = ticketingTable();

export interface TicketFilters {
  status?: string;
  dateRange?: DateRange;
  location?: string;
}
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Ticket {
  ticket_id: string;
  subject: string;
  updated_at: string;
  response_status: "close" | "open";
}

interface TableTicket {
  id: string;
  subject: string;
  lastUpdated: string;
  status: "close" | "open";
}

export function TicketingTable() {
  // const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [, /* currentPage */ setCurrentPage] = useState(1);

  const filters: TicketFilters = {
    status: selectedStatus,
    dateRange,
    location: selectedLocation,
  };

  const { data: ticketsResponse, isLoading } = useGetTickets(filters);

  const tickets: TableTicket[] =
    ticketsResponse?.data?.data?.map((tic: Ticket) => {
      return {
        id: tic.ticket_id || "",
        subject: tic.subject || "",
        lastUpdated: new Date(tic.updated_at).toLocaleDateString() || "",
        status: tic.response_status || "",
      };
    }) || [];

  const columns = [
    {
      header: "Ticket ID",
      accessorKey: "id",
    },
    {
      header: "Subject",
      accessorKey: "subject",
    },
    {
      header: "Last Updated",
      accessorKey: "lastUpdated",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: TableTicket) => (
        <Badge
          variant={item.status === "close" ? "success" : "destructive"}
          className="px-2"
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  // const handleEdit = (item: TableTicket) => {
  //   console.log("Edit order:", item.id);
  // };

  // const handleView = (item: TableTicket) => {
  //   router.push(`/orders/${item.id}`);
  // };

  const rowActions = () => (
    <button className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={dropdownMenuContent()}>
          <DropdownMenuItem>
            <Button className={dropdownButton()}>
              <Eye className={dropdownIcon()} />
              View Details
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button className={dropdownButton()}>
              <Edit className={dropdownIcon()} />
              Edit
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button className={dropdownButton()}>
              <Trash2 className={dropdownIcon()} />
              Delete
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </button>
  );

  const filterConfig = [
    {
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Close", value: "close" },
        { label: "Open", value: "Open" },
      ],
      onSelect: (value: string) => {
        setSelectedStatus(value);
        console.log("Status filter:", value);
      },
    },
    {
      label: "Date",
      type: "dateRange" as const,
      dateRange,
      onDateRangeChange: (range: DateRange) => {
        setDateRange(range);
        console.log("Date range:", range);
      },
    },
    {
      label: "Location",
      type: "select" as const,
      options: [
        { label: "All", value: "all" },
        { label: "Local", value: "local" },
        { label: "International", value: "international" },
      ],
      onSelect: (value: string) => {
        setSelectedLocation(value);
        console.log("Location filter:", value);
      },
    },
  ];

  return (
    <div className="mt-4">
      {isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <DataTable
          data={tickets}
          columns={columns}
          enableSelection
          enableSearch
          filters={filterConfig}
          onSearch={(query) => console.log("Search query:", query)}
          currentPage={ticketsResponse?.data?.current_page || 1}
          rowsPerPage={ticketsResponse?.data?.per_page || 10}
          totalItems={ticketsResponse?.data?.total || 0}
          onPageChange={(page) => setCurrentPage(page)}
          rowActions={rowActions}
        />
      )}
    </div>
  );
}
