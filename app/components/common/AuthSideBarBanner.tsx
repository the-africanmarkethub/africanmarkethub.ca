import { listBanners } from "@/lib/api/banners";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AuthSidebarBanner() {
  const [banners, setBanners] = useState<Array<any>>([]);

  useEffect(() => {
    listBanners("auth").then((res) => setBanners(res.data));
  }, []);
  const banner = banners.length > 0 ? banners[0] : null;

  return (
    <div className="relative hidden lg:block w-1/2">
      <Image
        fill
        src={banner?.banner || "/account-header.jpg"}
        alt="African Market Hub Branding"
        className="object-cover"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/5"></div>
    </div>
  );
}
