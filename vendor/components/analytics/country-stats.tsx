import Image from "next/image";

interface Props {
  id: number;
  imgUrl: string;
  country: string;
  percentage: number;
  usersCount: number;
}

export default function CountryStats(props: Props) {
  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start justify-start gap-y-4">
        <Image src={props.imgUrl} alt="usa flag" width={24} height={24} />
        <h1 className="text-[16px] leading-[22px] font-medium">
          {props.country}
        </h1>
      </div>
      <div className="flex items-center justify-center gap-x-2 text-sm text-[#656565] mt-1">
        {props.percentage}%<span>.</span>
        {props.usersCount} Users
      </div>
    </div>
  );
}
