import BannerCarousel from "./components/BannerCarousel";
import CategorySection from "./components/CategorySection";
import LatestProducts from "./components/LatestProducts";
import TodaysDeal from "./components/TodaysDeal";

export default function Home() {
  return (
    <div className="bg-gray-50">
      <BannerCarousel />
      <CategorySection />
      {/* <TodaysDeal />
      <LatestProducts /> */}
    </div>
  );
}
