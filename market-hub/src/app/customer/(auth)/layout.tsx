// src/components/AuthLayout.js
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full max-h-screen">
      {/* Side Image Section */}
      <Image
        src="/img/authImage.png"
        width={1000}
        height={1000}
        alt=""
        layout="responsive"
        className="hidden contain-content h-full lg:block max-w-[50%]"
      />

      <section className="relative container  w-full lg:max-w-[50%] overflow-y-scroll no-scrollbar">
        <Image
          src="/img/African Market Hub.svg"
          width={94}
          height={24}
          alt="Logo"
          className="absolute left-[50px] top-16 md:hidden"
        />
        <Image
          src="/img/African Market Hub.svg"
          width={177}
          height={60}
          alt="Logo"
          className="hidden justify-start self-start md:block absolute left-[141px] top-16
          "
        />

        <MaxWidthWrapper className="w-full flex flex-col justify-center items-center ">
          <div className="">{children}</div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
