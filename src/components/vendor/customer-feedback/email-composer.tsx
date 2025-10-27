"use client";
import { useState } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Textarea } from "@/components/vendor/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { CustomInput } from "../CustomInput";
import FileUpload from "../forms/file-upload";

interface EmailComposerProps {
  setIsComposingMail: () => void;
}

export default function EmailComposer(props: EmailComposerProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState(``);

  const handleSend = () => {
    console.log("Sending email:", { to, subject, message });
    // send logic  should behere
  };

  return (
    <div className="w-full p-6 bg-white xl:hidden">
      <div className="space-y-4">
        <CustomInput
          id="to"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To:"
        />
        <CustomInput
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject:"
        />
        <Textarea
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your response"
          className="text-[16px] leading-[22px] text-[#656565] min-h-[137px] resize-none px-4 py-3 bg-white border-[#EEEEEE] rounded-[16px]"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Paperclip className="w-4 h-4" />
            Attach Document
          </div>

          <FileUpload className="bg-transparent h-[188px] py-5 rounded-[8px]" />
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-x-2 pt-4">
          <Button
            onClick={handleSend}
            className="bg-[#F28C0D] hover:bg-[#F28C0D] text-xs font-medium text-white px-5 py-2.5 rounded-full flex items-center gap-2 w-full"
          >
            <Send className="w-4 h-4" />
            Send
          </Button>
          <Button
            onClick={props.setIsComposingMail}
            variant="outline"
            className="px-5 py-2.5 rounded-full text-xs font-medium w-full border-[#9C5432] text-[#292929] hover:bg-transparent bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
