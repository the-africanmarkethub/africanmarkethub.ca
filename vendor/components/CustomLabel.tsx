import { Label } from "./ui/label";

type Props = {
  htmlFor: string;
  text: string;
};

export const CustomLabel = (props: Props) => {
  return (
    <Label
      htmlFor={props.htmlFor}
      className="text-sm font-normal text-[#292929]"
    >
      {props.text}
    </Label>
  );
};
