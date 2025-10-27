import { ChevronRight } from "lucide-react";

export function BreadcrumbNav() {
  return (
    <nav className="hidden items-center space-x-2 text-sm mb-6 xl:flex">
      <span>marketplace</span>
      <ChevronRight className="h-4 w-4" />
      <span>Help Centre</span>
      <ChevronRight className="h-4 w-4" />
      <span>Tutorials</span>
    </nav>
  );
}
