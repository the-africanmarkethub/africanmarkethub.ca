import { Star } from "lucide-react";

interface Props {
  rating: number;
  width: number;
  height: number;
}

export const RatingStars = (props: Props) => {
  return (
    <div className="flex gap-x-1">
      {Array.from({ length: props.rating }, (_, index: number) => (
        <Star
          key={index}
          fill="#F1BB13"
          strokeWidth={0}
          width={props.width}
          height={props.height}
        />
      ))}
    </div>
  );
};
