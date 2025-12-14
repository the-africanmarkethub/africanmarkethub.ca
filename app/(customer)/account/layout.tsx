import AccountHero from "./components/AccountHero";
import AccountSidebar from "./components/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="  bg-gray-50 text-gray-800">
      {/* Hero */}
      <AccountHero />

      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 lg:w-1/5 w-full">
          <AccountSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
}
