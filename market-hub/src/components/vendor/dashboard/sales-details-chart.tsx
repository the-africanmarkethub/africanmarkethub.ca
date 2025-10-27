import React, { useState } from "react";
import { type Overview, OverviewChart } from "./OverviewChart";
import { useGetSalesDeatils } from "@/hooks/vendor/useGetSalesDetails";

export default function SalesDetailsChart() {
  const { data: salesDetailsResponse } = useGetSalesDeatils();
  const [selectedMonth, setSelectedMonth] = useState<string>("January");

  const salesDetails =
    salesDetailsResponse?.data?.map((sales: Overview) => {
      return {
        date: sales.date,
        total: Number(sales.total),
      };
    }) || [];

  // dummy data
  // const salesData = [
  //   { date: "2025-01-11", total: "13500" },
  //   { date: "2025-02-11", total: "5200" },
  //   { date: "2025-03-11", total: "10800" },
  //   { date: "2025-04-11", total: "8900" },
  //   { date: "2025-05-11", total: "7200" },
  //   { date: "2025-06-11", total: "26800" },
  //   { date: "2025-07-11", total: "11200" },
  //   { date: "2025-08-11", total: "8500" },
  //   { date: "2025-09-11", total: "29800" },
  //   { date: "2025-10-11", total: "12100" },
  //   { date: "2025-11-11", total: "64366" },
  //   { date: "2025-12-11", total: "15200" },
  // ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <OverviewChart
        title="Sales Details"
        data={salesDetails}
        options={months}
        selectedOption={selectedMonth}
        setSelectedOption={setSelectedMonth}
      />
    </>
  );
}
