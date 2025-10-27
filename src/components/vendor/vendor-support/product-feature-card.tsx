"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/vendor/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/vendor/ui/card";
import Image from "next/image";

interface Props {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export default function TutorialCard(props: Props) {
  const router = useRouter();
  const handleViewTutorial = (id: string) => {
    router.push(`/vendor-support/help-centre/${id}`);
  };

  return (
    <Card className="w-full overflow-hidden rounded-[8px] bg-white">
      <div className="relative w-full">
        <Image
          src={props.imageUrl}
          alt="Person browsing colorful marketplace items"
          className="w-full h-full object-cover"
          width={330}
          height={329}
        />
      </div>
      <CardHeader className="px-2 pt-2 pb-1 lg:px-[18px] lg:py-[18px]">
        <CardTitle className="font-semibold text-sm text-[#292929] lg:text-2xl/8">
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <CardDescription className="font-normal text-[10px] leading-[14px] text-[#525252] lg:text-[20px] lg:leading-[27px] pb-4 lg:px-[18px] lg:pb-[27px]">
          {props.description}
        </CardDescription>
        <Button
          className="w-full px-4 py-2 h-auto bg-[#F28C0D] hover:bg-[#F28C0D] text-xs text-white font-medium rounded-[39px] lg:text-base lg:leading-[22px] lg:px-6 lg:py-3"
          onClick={() => handleViewTutorial(props.id)}
        >
          Read More
        </Button>
      </CardContent>
    </Card>
  );
}
