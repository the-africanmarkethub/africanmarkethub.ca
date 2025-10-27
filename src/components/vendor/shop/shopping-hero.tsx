import { Button } from "@/components/vendor/ui/button";
import Image from "next/image";

export default function ShoppingHero({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-lg sm:h-[400px] ">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/marketplace-hero.png"
          alt="Shopping background with clothing items"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-[#0000009E]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="mb-6">
          <h4 className="text-white text-[32px] leading-10 font-semibold">
            Replace cover image
          </h4>
          <p className="text-[#8A8A8A] text-[13px] leading-4">
            Optimal dimension 1100×400 px
          </p>
        </div>

        <Button
          className="bg-[#F28C0D] hover:bg-[#F28C0D] text-white px-6 py-3 rounded-full text-lg font-medium transition-colors"
          size="lg"
          onClick={onClick}
        >
          Edit Shop
        </Button>
      </div>
    </div>
  );
}
