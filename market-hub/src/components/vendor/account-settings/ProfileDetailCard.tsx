import { Card, CardContent, CardHeader, CardTitle } from "@/components/vendor/ui/card";

type Props = {
  title: string;
  content: React.ReactNode;
  action?: React.ReactNode;
};

export const ProfileDetailCard = (props: Props) => {
  return (
    <Card className="border border-[#DCDCDC] rounded-[16px] bg-white p-4">
      <CardHeader className="flex-row flex-between p-0">
        <CardTitle className="text-[16px] leading-[22px] font-semibold text-[#292929]">
          {props.title}
        </CardTitle>
        <div className="">{props.action}</div>
      </CardHeader>
      <CardContent className="p-0">{props.content}</CardContent>
    </Card>
  );
};
