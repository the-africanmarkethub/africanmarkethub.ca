import CustomDonutChart from "../CustomDonutChart";

const returnReasons = [
  { name: "Defective Products", value: 20, color: "#165DFF" },
  { name: "Wrong Item", value: 40, color: "#50CD89" },
  { name: "Arrived Late", value: 20, color: "#F28C0D" },
  { name: "Sizing Issues", value: 10, color: "#7239EA" },
  { name: "Changed my mind", value: 10, color: "#0FC6C2" },
];

const total = 2000;

export default function ReturnReasons() {
  return (
    <CustomDonutChart
      data={returnReasons}
      total={total}
      title="Return Reasons"
      enablePeriod={false}
    />
  );
}
