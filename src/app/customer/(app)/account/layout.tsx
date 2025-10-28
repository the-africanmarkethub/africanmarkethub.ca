"use client";
import AccountSidebar from "@/components/customer/account/AccountSidebar";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Match /account/orders/[orderId] (where orderId is a dynamic segment)
  const isOrderDetailsPage = /^\/account\/orders\/[^/]+$/.test(pathname);

  return (
    <div className="w-full mt-16 md:mt-0 bg-gray-50">
      <div className="relative">
        <Image
          src="/img/Banner.svg"
          alt=""
          width={1440}
          height={177}
          className="w-full h-auto"
        />
        <div className="absolute text-[#F8F8F8] top-4 md:top-[38px] space-y-2 md:space-y-[22px] left-4 md:left-[81px]">
          <h1 className="text-2xl md:text-5xl font-semibold tracking-tight">
            My Account
          </h1>

          <div className="flex text-xs md:text-sm font-normal gap-1 items-center">
            <p>Home</p>
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
            <p>My Account</p>
          </div>
        </div>
      </div>
      <MaxWidthWrapper className="flex flex-col md:flex-row gap-4 md:gap-8 mt-8 md:mt-20 mb-8 w-full items-start px-4 md:px-0">
        {!isOrderDetailsPage && (
          <div className="hidden md:block">
            <AccountSidebar />
          </div>
        )}
        <div className="flex-1 w-full px-4 md:px-0">{children}</div>
      </MaxWidthWrapper>
    </div>
  );
}
