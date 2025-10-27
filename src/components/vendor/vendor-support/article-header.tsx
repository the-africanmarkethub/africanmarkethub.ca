import { BreadcrumbNav } from "./breadcrumb-nav";
import Image from "next/image";

export function ArticleHeader() {
  return (
    <header className="mb-8">
      <BreadcrumbNav />
      <h1 className="text-lg/5 font-semibold xl:text-2xl">
        Creating High-Quality Product Listings That Convert
      </h1>
      <div className="relative w-full h-[400px] my-8 rounded-[16px] overflow-hidden">
        <Image
          src="/assets/images/marketplace-hero.png"
          alt="Person in marketplace wearing face mask browsing colorful items"
          width={1061}
          height={400}
          className="object-cover h-full w-full"
        />
      </div>
    </header>
  );
}
