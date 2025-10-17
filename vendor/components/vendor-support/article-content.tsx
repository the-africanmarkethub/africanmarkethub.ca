// import Image from "next/image";

export function ArticleContent() {
  return (
    <article className="prose prose-gray max-w-none p-4 bg-white rounded-[16px] xl:p-8">
      <p className="font-normal text-sm text-[#292929] mb-8 xl:text-[16px] xl:leading-[22px]">
        Creating effective product listings is the cornerstone of successful
        selling on African Market Hub. The quality of your listings directly
        impacts your visibility, customer trust, and conversion rates. This
        tutorial will guide you through the process of creating compelling
        product listings that attract customers and drive sales.
      </p>

      <h2 className="font-medium">
        Understanding the Importance of Quality Listings
      </h2>

      <p className="mb-2">
        {
          "Before diving into the specifics, let's understand why quality listings matter:"
        }
      </p>

      <ul className="list-disc pl-6 space-y-0.5">
        <li>
          First Impressions: Your product listing is often the first interaction
          customers have with your business.
        </li>
        <li>
          Trust Building: Professional listings signal reliability and quality
          to potential buyers.
        </li>
        <li>
          Search Visibility: Well-optimized listings rank higher in both
          platform and external search results.
        </li>
        <li>
          {
            "Conversion Rates: Clear, detailed listings answer customer questions before they're asked, increasing sales."
          }
        </li>
      </ul>

      {/* <div className="relative w-full h-64 my-8 rounded-lg overflow-hidden">
        <Image
          src="/images/marketplace-hero.png"
          alt="Marketplace scene showing various colorful products and textiles"
          fill
          className="object-cover"
        />
      </div> */}
    </article>
  );
}
