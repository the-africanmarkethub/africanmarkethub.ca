import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  Gift,
  Users,
  Bell,
  HelpCircle,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useLogout } from "@/hooks/customer/useLogout";
import { useUser } from "@/hooks/customer/useUser";
import { useEffect, useState } from "react";

const menu = [
  {
    name: "Account Overview",
    href: "/customer/account/overview",
    icon: <Clock size={18} />,
    requiresAuth: true,
  },
  {
    name: "Orders",
    href: "/customer/account/orders",
    icon: <ShoppingBag size={18} />,
    requiresAuth: true,
  },
  {
    name: "Chats",
    href: "/customer/account/chats",
    icon: <MessageCircle size={18} />,
    requiresAuth: true,
  },
  {
    name: "Wishlist",
    href: "/customer/wishlist",
    icon: <Heart size={18} />,
    requiresAuth: false, // Wishlist can work for both logged in and guest users
  },
  {
    name: "Address",
    href: "/customer/account/address",
    icon: <MapPin size={18} />,
    requiresAuth: true,
  },
  // {
  //   name: "Payment Method",
  //   href: "/account/payment",
  //   icon: <CreditCard size={18} />,
  //   requiresAuth: true,
  // },
  {
    name: "Account Setting",
    href: "/customer/account/settings",
    icon: <Settings size={18} />,
    requiresAuth: true,
  },
  {
    name: "Refer & Earn",
    href: "/customer/account/refer",
    icon: <Gift size={18} />,
    requiresAuth: true,
  },
  {
    name: "Recommendation",
    href: "/customer/account/recommendation",
    icon: <Users size={18} />,
    requiresAuth: true,
  },
  {
    name: "Notification",
    href: "/customer/account/notifications",
    icon: <Bell size={18} />,
    requiresAuth: true,
  },
  {
    name: "Customer Support",
    href: "/customer/account/support",
    icon: <HelpCircle size={18} />,
    requiresAuth: false, // Support should be available to everyone
  },
];

// Dummy user initial for avatar

export default function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();
  const { isLoading } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Filter menu items based on authentication status
  const visibleMenuItems = menu.filter((item) => {
    if (item.requiresAuth && !isAuthenticated) {
      return false; // Hide auth-required items if user is not logged in
    }
    return true;
  });

  // Show loading state during hydration or when loading user data
  if (!isMounted || isLoading) {
    return (
      <aside
        className="w-[376px] bg-white rounded-lg px-[46.5px] py-8 flex flex-col justify-center items-center h-full"
        style={{ boxShadow: "0px 4px 8px 0px #00000040" }}
      >
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside
      className="w-[376px] bg-white rounded-lg px-[46.5px] py-8 flex flex-col justify-between h-full"
      style={{ boxShadow: "0px 4px 8px 0px #00000040" }}
    >
      <div>
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded transition-colors duration-200
                    ${isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-primary/10 hover:text-primary"}
                    focus:outline-none focus:bg-primary/10 focus:text-primary
                  `}
                >
                  <span className="flex items-center">
                    {item.icon && (
                      <span className="text-inherit">{item.icon}</span>
                    )}
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Only show logout button if user is authenticated */}
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 mt-36 px-4 py-2"
        >
          <LogOut size={18} />
          Log out
        </button>
      )}

      {/* Show login prompt if user is not authenticated */}
      {!isAuthenticated && (
        <div className="mt-36 px-4 py-2">
          <Link
            href="/signin"
            className="flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Sign in to access your account
          </p>
        </div>
      )}
    </aside>
  );
}
