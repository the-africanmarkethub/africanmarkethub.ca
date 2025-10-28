// src/components/AuthLayout.js
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-full max-h-screen">
      {/* Side Image Section */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src="/img/authImage.png"
          fill
          alt=""
          className="object-cover object-top"
          priority
        />
      </div>

      <section className="relative w-full lg:max-w-[50%] overflow-y-scroll no-scrollbar">

        <div className="w-full flex flex-col justify-center items-center min-h-screen px-6 md:px-12 lg:px-20 xl:px-32 pt-32 md:pt-36">
          <div className="w-full max-w-md relative">
            <Image
              src="/img/African Market Hub.svg"
              width={94}
              height={24}
              alt="Logo"
              className="absolute -top-32 left-0 md:hidden"
            />
            <Image
              src="/img/African Market Hub.svg"
              width={177}
              height={60}
              alt="Logo"
              className="hidden md:block absolute -top-36 left-0"
            />
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
