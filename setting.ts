import { FaDhl } from "react-icons/fa6";
import { SiFedex, SiUps, SiUsps, SiAmazon, SiDeliveroo } from "react-icons/si";
import { MdLocalShipping } from "react-icons/md";

import {
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiLifeBuoy,
  FiBell,
  FiTruck,
  FiCreditCard,
  FiMail,
} from "react-icons/fi";

import {
  LuLayoutDashboard,
  LuPackage,
  LuShoppingCart,
  LuMessageCircle,
  LuWallet,
  LuSettings,
  LuUsers,
  LuShoppingBag,
  LuMegaphone,
  LuList,
} from "react-icons/lu";

export const APP_NAME = "African Market Hub";

interface NavItem {
  id: number;
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

// export const VENDOR_MENU: NavItem[] = [
//   { id: 1, label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
//   {
//     id: 2,
//     label: "Item Management",
//     href: "/dashboard/item-management",
//     icon: LuPackage,
//     children: [],
//   },
//   {
//     id: 3,
//     label: "Order Management",
//     href: "/dashboard/order-management",
//     icon: LuShoppingCart,
//   },
//   {
//     id: 4,
//     label: "Customer Feedback",
//     href: "/dashboard/customer-feedback",
//     icon: LuMessageCircle,
//   },
//   {
//     id: 5,
//     label: "Finance & Payment",
//     href: "/dashboard/finance-payment",
//     icon: LuWallet,
//   },
//   {
//     id: 9,
//     label: "Shop Management",
//     href: "/dashboard/shop-management",
//     icon: LuShoppingBag,
//     children: [
//       {
//         id: 91,
//         label: "Shop Profile & Branding",
//         href: "/shop-management/profile",
//         icon: LuShoppingBag,
//       },
//       {
//         id: 92,
//         label: "Promotions & Discounts",
//         href: "/shop-management/promotions",
//         icon: LuMegaphone,
//       },
//       {
//         id: 93,
//         label: "Store Policies",
//         href: "/shop-management/policies",
//         icon: LuList,
//       },
//     ],
//   },
//   {
//     id: 7,
//     label: "Accounts & Settings",
//     href: "/dashboard/account-settings",
//     icon: LuSettings,
//     children: [
//       // Assuming sub-settings links
//     ],
//   },
//   // { id: 8, label: "Vendor Support", href: "/vendor-support", icon: LuUsers },
// ];

export const VENDOR_MENU: NavItem[] = [
  { id: 1, label: "Dashboard", href: "/dashboard", icon: LuLayoutDashboard },
  {
    id: 2,
    label: "Products & Inventory", // More descriptive
    href: "/dashboard/item-management",
    icon: LuPackage,
  },
  {
    id: 3,
    label: "Orders & Fulfillment", // "Fulfillment" is a huge buzzword in CA/US
    href: "/dashboard/order-management",
    icon: LuShoppingCart,
  },
  {
    id: 4,
    label: "Reviews", // Simple and direct
    href: "/dashboard/customer-feedback",
    icon: LuMessageCircle,
  },
  {
    id: 5,
    label: "Earnings & Payouts", // "Earnings" is more motivating than "Finance"
    href: "/dashboard/finance-payment",
    icon: LuWallet,
  },
  {
    id: 9,
    label: "Storefront",
    href: "/dashboard/shop-management",
    icon: LuShoppingBag, 
  },
  {
    id: 7,
    label: "Settings",
    href: "/dashboard/account-settings",
    icon: LuSettings,
  },
];
export const CUSTOMER_MENU = [
  { name: "Overview", href: "/account", icon: FiUser },
  { name: "My Orders", href: "/account/orders", icon: FiPackage },
  { name: "Track Shipments", href: "/account/tracking", icon: FiTruck },
  { name: "Wishlist", href: "/account/wishlists", icon: FiHeart },
  { name: "Saved Addresses", href: "/account/address", icon: FiMapPin },
  // { name: "Inbox", href: "/account/messages", icon: FiMail }, 
  { name: "Notifications", href: "/account/notifications", icon: FiBell },
  { name: "Support & Returns", href: "/account/support", icon: FiLifeBuoy },
  { name: "Security & Settings", href: "/account/settings", icon: FiSettings },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DIMENSION_OPTIONS = [
  { label: "pound", value: "lbs" },
  { label: "ounce", value: "oz" },
  { label: "kilogram", value: "kg" },
  { label: "gram", value: "g" },
];

export const SIZE_UNIT_OPTIONS = [
  { label: "inch", value: "in" },
  { label: "centimeter", value: "cm" },
];

export const PRICING_MODEL_OPTIONS = [
  { value: "fixed", label: "Fixed" },
  { value: "negotiable", label: "Negotiable" },
];

export const DELIVERY_METHOD_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "hybrid", label: "Hybrid" },
];

export const MAX_IMAGES = 7;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CARRIER_ICONS: Record<
  string,
  { icon: React.ComponentType<any>; color: string }
> = {
  dhl: { icon: FaDhl, color: "#FFCC00" },
  fedex: { icon: SiFedex, color: "#4D148C" },
  ups: { icon: SiUps, color: "#180B02" },
  usps: { icon: SiUsps, color: "#3333CC" },
  amazon: { icon: SiAmazon, color: "#FF9900" },
  deliveroo: { icon: SiDeliveroo, color: "#00CCBC" },
  default: { icon: MdLocalShipping, color: "#FF9920" },
};

export const CANADA_TIMEZONE = "America/Toronto";

export const ALLOWED_COUNTRIES = [
  "CA", // Canada 
];

export const COMPANY_CONTACT_INFO = {
  address: "77 The Lakes, Larkfield, Aylesford, Kent ME20 6SJ, UK",
  phone: "+44 7930 173135",
  email: "info@africanmarkethub.ca",
  companyName: APP_NAME,
  about: `
African Market Hub is a modern, people-focused food and service marketplace created to make everyday living simpler, faster, and more convenient. Built with the needs of today’s consumers in mind, African Market Hub connects individuals, families, and communities with high-quality foods, trusted sellers, essential products, and reliable home services — all through one easy-to-use digital platform.

From freshly prepared meals to groceries, home essentials, and professional services, African Market Hub brings everything closer to you. Our platform empowers local vendors, supports small businesses, and ensures that customers enjoy competitive pricing, verified quality, and seamless delivery experiences.

Whether you're shopping for daily essentials, placing a food order, booking a service professional, or exploring new offerings, African Market Hub is designed to save you time, reduce stress, and enhance convenience. We are committed to redefining lifestyle simplicity by merging technology, trust, and real human need into a single ecosystem that works for everyone.

At African Market Hub, we don't just deliver products — we deliver comfort, reliability, and a better way to live every day.
`,
  companyDescription: `
Discover Africa's vibrant economy in one marketplace. We connect you directly with local entrepreneurs offering authentic African products—from stunning fashion and intricate crafts to farm-fresh produce and essential electronics. Buyers, find quality, heritage, and value. Sellers, access new markets and grow your business effortlessly. Your gateway to African excellence.`,
};

export const ROLE_OPTIONS = [
  { value: "customer", label: "Register as Customer" },
  { value: "vendor", label: "Register as Seller" },
];
