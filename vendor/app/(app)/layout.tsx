"use client";

import { AppSidebar } from "@/components/AppSideBar";
// import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { SidebarProvider } from "@/components/CustomSidebar";
import { AuthGuard } from "@/components/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen bg-[#faf7f7]">
          <AppSidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <NavBar />
            <main className="flex-1 overflow-y-auto">
              <div className="mt-16 sm:mt-20 md:mt-[100px] md:mr-16 p-4">{children}</div>
            </main>
            {/* <Footer /> */}
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
