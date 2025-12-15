import CategorySection from "./components/CategorySection";
import HeroBanner from "./components/HeroBanner";
import LatestProducts from "./components/LatestProducts";
import TodaysDeal from "./components/TodaysDeal";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <HeroBanner />
      <CategorySection type="products" />
      <CategorySection type="services" />
      {/* <TodaysDeal />
      <LatestProducts /> */}
    </div>
  );
}
