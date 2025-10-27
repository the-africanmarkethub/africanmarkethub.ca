// "use client";
import Footer from "@/components/customer/Footer";
import NavBar from "@/components/customer/NavBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const { data: user } = useUser();

  return (
    <main className="relative font-exo flex flex-col min-h-screen bg-[#FFFFFD] overflow-x-hidden">
      <NavBar />
      <div className="mt-0 sm:mt-[148px] flex-grow ">{children}</div>
      <Footer />
    </main>
  );
}
