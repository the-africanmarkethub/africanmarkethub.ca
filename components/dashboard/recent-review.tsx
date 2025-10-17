import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { RatingStars } from "../RatingStars";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  product: {
    title: string;
    image: string;
  };
  user: {
    name: string;
    last_name: string;
    profile_photo: string;
  };
  status: "Published" | "Deleted";
}

export function RecentReview(props: Review) {
  return (
    <div className="pt-4 group">
      <div className="flex-between">
        <div className="flex-center gap-x-2">
          <Image
            src={
              props.user.profile_photo ?? "/assets/images/fallback-avatar.svg"
            }
            width={40}
            height={40}
            className="rounded-full"
            alt={props.user.name + props.user.last_name}
          />
          <div className="flex flex-col gap-y-1">
            <h1 className="text-sm font-medium text-[#292929] md:text-[16px] md:leading-[22px]">
              {props.user.name} {props.user.last_name}
            </h1>
            <RatingStars rating={props.rating} width={13} height={13} />
          </div>
        </div>
        <span className="text-xs font-normal">
          {formatDistanceToNow(new Date(props.created_at), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm font-normal text-[#656565] mt-2.5">
        {props.comment}
      </p>
      <div className="mt-4 border-b group-last:hidden"></div>
    </div>
  );
}
