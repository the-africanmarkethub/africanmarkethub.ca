import { DataTable } from "../ui/data-table/DataTable";

interface RevenueProduct {
  id: string | number;
  category: string;
  revenue: string;
  percentageTotal: string;
  change: string;
}

const revenueProductData: RevenueProduct[] = [
  {
    id: 1,
    category: "Food & Beverages",
    revenue: "1,500,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 2,
    category: "Electronics",
    revenue: "1,200,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 3,
    category: "Apparel",
    revenue: "1,500,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 4,
    category: "Home Goods",
    revenue: "1,500,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 5,
    category: "Automotive",
    revenue: "1,300,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 6,
    category: "Health & Beauty",
    revenue: "1,500,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
  {
    id: 7,
    category: "Equipment",
    revenue: "1,700,000 CAD",
    percentageTotal: "20%",
    change: "+5%",
  },
];

const columns = [
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Revenue",
    accessorKey: "revenue",
  },
  {
    header: "% of Total",
    accessorKey: "percentageTotal",
  },

  { header: "Change", accessorKey: "change" },
];

export default function RevenueProductTable() {
  return (
    <div className="w-full rounded-2xl mx-auto pb-5 bg-white">
      <div className="flex justify-between items-center px-6 py-8">
        <h1 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8">
          Revenue by Product Category
        </h1>
      </div>
      <DataTable
        data={revenueProductData}
        columns={columns}
        enablePagination={false}
      />
    </div>
  );
}
