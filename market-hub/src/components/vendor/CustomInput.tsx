import { Input } from "@/components/vendor/ui/input";

type Props = {
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  inputClass?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CustomInput = (props: Props) => {
  const type = props.type ?? "text";

  return (
    <Input
      id={props.id}
      type={type}
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
      className={`w-full px-4 py-3 h-[54px] bg-white border border-[#EEEEEE] rounded-[8px] text-sm font-normal text-[#7C7C7C] ${props.inputClass} lg:text-[16px] lg:leading-[22px]`}
    />
  );
};
