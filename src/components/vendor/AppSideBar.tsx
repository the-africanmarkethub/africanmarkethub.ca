"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  CreditCard,
  Truck,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  Store,
  Briefcase,
} from "lucide-react";
import {
  CustomSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/vendor/CustomSidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useShopDetails } from "@/hooks/vendor/useShopDetails";

const getNavigationItems = (isService: boolean) => [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/vendor/overview",
  },
  {
    title: isService ? "Service Management" : "Product Management",
    icon: isService ? Briefcase : Package,
    href: "/vendor/products",
    subItems: [
      {
        title: isService ? "Add New Service" : "Add New Product",
        href: "/vendor/products/new",
      },
      {
        title: isService ? "Manage Existing Services" : "Manage Existing Product",
        href: "/vendor/products/manage",
      },
      {
        title: isService ? "Service Promotion" : "Product Promotion",
        href: "/vendor/products/promotion",
      },
    ],
  },
  {
    title: "Order Management",
    icon: ShoppingCart,
    href: "/vendor/orders",
    subItems: [
      {
        title: "Order List",
        href: "/vendor/orders/order-list",
      },
      {
        title: "Processed Order",
        href: "/vendor/orders/processed-order",
      },
      // {
      //   title: "Manage Existing Product",
      //   href: "/vendor/orders/processed",
      // },
    ],
  },
  {
    title: "Customer Feedback",
    icon: MessageSquare,
    href: "/vendor/customer-feedback",
    subItems: [
      {
        title: "Customer Message",
        href: "/vendor/customer-feedback/message",
      },
      {
        title: "Rating & Review",
        href: "/vendor/customer-feedback/rating-review",
      },
    ],
  },
  {
    title: "Finance & Payment",
    icon: CreditCard,
    href: "/vendor/finance",
    subItems: [
      {
        title: "Earning Overview",
        href: "/vendor/finance/earning-overview",
      },
      {
        title: "Withdrawal",
        href: "/vendor/finance/withdrawal",
      },
    ],
  },
  {
    title: "Shipping & Logistics",
    icon: Truck,
    href: "/vendor/shipping",
  },
  {
    title: "Analytics & Report",
    icon: BarChart2,
    href: "/vendor/analytics",
    subItems: [
      {
        title: "Sales Analytics",
        href: "/vendor/analytics/sales-analytics",
      },
      {
        title: "Financial Reports",
        href: "/vendor/analytics/financial-reports",
      },
    ],
  },
  {
    title: "Account & Settings",
    icon: Settings,
    href: "/vendor/settings",
    subItems: [
      {
        title: "Profile Setting",
        href: "/vendor/settings/profile",
      },
      {
        title: "Notification Preference",
        href: "/vendor/settings/notification-preference",
      },
    ],
  },
  {
    title: "Vendor Support",
    icon: HelpCircle,
    href: "/vendor/vendor-support",
    subItems: [
      {
        title: "Help Centre",
        href: "/vendor/vendor-support/help-centre",
      },
    ],
  },
  {
    title: "Shop Management",
    icon: Store,
    href: "/vendor/shop",
    subItems: [
      {
        title: "Shop Profile & Branding",
        href: "/vendor/shop/profile-branding",
      },
      {
        title: "Promotions & Discounts",
        href: "/vendor/shop/promotion-discounts",
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Get shop details to determine if it's a service or product shop
  const { data: shopDetails } = useShopDetails();
  const isService = shopDetails?.shops?.[0]?.type === "services";
  
  // Get navigation items based on shop type
  const navigationItems = useMemo(() => getNavigationItems(isService), [isService]);
  
  // Access sidebar context (we don't need to control it manually since our custom sidebar handles it)
  // Auto-expand parent menu when navigating to any sub-item and keep it open
  useEffect(() => {
    const currentParent = navigationItems.find((item) =>
      item.subItems?.some((subItem) => pathname === subItem.href)
    );

    if (currentParent) {
      // Always ensure the current section is expanded
      setExpandedItems([currentParent.title]);
    } else {
      // If not in any sub-section, check if we're on a main page that has no sub-items
      const currentMainItem = navigationItems.find(
        (item) => pathname === item.href
      );
      if (currentMainItem && !currentMainItem.subItems) {
        // Clear expanded items if on a main page with no sub-items
        setExpandedItems([]);
      }
    }
  }, [pathname, navigationItems]);

  const handleMainItemClick = (item: (typeof navigationItems)[0]) => {
    if (item.subItems && item.subItems.length > 0) {
      const isAlreadyInThisSection = item.subItems.some(
        (subItem) => pathname === subItem.href
      );

      // If already in this section, don't navigate - just stay where you are
      if (isAlreadyInThisSection) {
        return;
      }

      // Navigate to the first sub-item immediately
      // The useEffect will handle expanding the menu automatically
      router.push(item.subItems[0].href);
    }
  };

  const handleLinkClick = (href: string) => {
    // Navigate to the page
    router.push(href);
    // Sidebar will stay open automatically on mobile since we control it
  };

  const isExpanded = (title: string) => expandedItems.includes(title);

  const isActive = (item: (typeof navigationItems)[0]) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => pathname === subItem.href);
    }
    return false;
  };

  return (
    <CustomSidebar>
      <SidebarHeader className="mb-10">
        <Link href="/vendor/overview">
          <Image
            src="/assets/icons/logo.svg"
            alt="Market Hub"
            width={142}
            height={36}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <div key={item.href}>
              {item.subItems ? (
                // Button for items with submenus
                <button
                  onClick={() => handleMainItemClick(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg py-4 text-base leading-[22px] font-normal transition-colors",
                    isActive(item)
                      ? "[&>div>svg]:text-[#F28C0D] text-[#F28C0D]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </div>
                  <div>
                    {isExpanded(item.title) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ) : (
                // Link for items without submenus
                <button
                  onClick={() => handleLinkClick(item.href)}
                  className={cn(
                    "flex w-full items-center gap-[3px] rounded-lg py-4 text-base leading-[22px] font-normal transition-colors text-left",
                    pathname === item.href
                      ? "[&>svg]:text-[#F28C0D] text-[#F28C0D]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </button>
              )}
              {item.subItems && isExpanded(item.title) && (
                <div className="mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.href}
                      onClick={() => handleLinkClick(subItem.href)}
                      className={cn(
                        "block w-full text-left pl-8 rounded-lg py-2 text-sm transition-colors",
                        pathname === subItem.href
                          ? "bg-[#FFFBED] text-[#464646]"
                          : "pl-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {subItem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <button className="flex w-full items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </SidebarFooter>
    </CustomSidebar>
  );
}
