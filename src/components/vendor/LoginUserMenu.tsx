import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/vendor/ui/dropdown-menu";
import {
  ChartPie,
  CircleHelp,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LoginUserMenuProps {
  name: string;
  lastName: string;
  profileImage: string;
  logOut: () => void;
}

function LoginUserMenu({
  name,
  lastName,
  logOut,
  profileImage,
}: LoginUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-primary flex items-center gap-2 rounded-[39px] px-8 py-4 text-[#FFFFFF] focus:outline-0">
        <User width={24} height={24} />{" "}
        <span className="flex text-sm">{name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-4.5 w-[340px] rounded-3xl p-2.5 text-base leading-[22px]">
        <DropdownMenuLabel className="flex items-center gap-2 pb-4">
          <Image
            src={profileImage}
            width={48}
            height={28}
            className="rounded-full"
            alt="profileImage"
          />
          <div className="font-semibold">
            {name} {lastName}
          </div>
        </DropdownMenuLabel>
        <Link href="/setting">
          <DropdownMenuItem className="flex items-center gap-2 pb-3 pl-4">
            <ChartPie width={24} height={24} className="text-[#464646]" />{" "}
            <span className="text-sm text-[#989898]">Account Overview</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem className="flex items-center gap-2 py-3 pl-4">
          <ShoppingBag width={24} height={24} className="text-[#464646]" />{" "}
          <span className="text-sm text-[#989898]">Orders</span>
        </DropdownMenuItem>
        <Link href="/wishlist">
          <DropdownMenuItem className="flex items-center gap-2 py-3 pl-4">
            <Heart width={24} height={24} className="text-[#464646]" />
            <span className="text-sm text-[#989898]">Wishlist</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/account-setting">
          <DropdownMenuItem className="flex items-center gap-2 py-3 pl-4">
            <Settings width={24} height={24} className="text-[#464646]" />
            <span className="text-sm text-[#989898]">Account Setting</span>
          </DropdownMenuItem>{" "}
        </Link>

        <DropdownMenuItem className="flex items-center gap-2 py-3 pl-4">
          <CircleHelp width={24} height={24} className="text-[#464646]" />
          <span className="text-sm text-[#989898]">Customer Support</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="mt-4 flex items-center gap-2 py-3 pl-4"
          onClick={logOut}
        >
          <LogOut width={24} height={24} className="text-[#464646]" />
          <span className="text-sm text-[#F1352B]">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LoginUserMenu;
