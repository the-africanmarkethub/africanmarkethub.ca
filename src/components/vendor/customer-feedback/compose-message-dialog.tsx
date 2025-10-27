import { Button } from "@/components/vendor/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/vendor/ui/dialog";
import { Textarea } from "@/components/vendor/ui/textarea";
import { Paperclip, Plus, Send, X } from "lucide-react";
import { useState } from "react";
import { CustomInput } from "../CustomInput";
import FileUpload from "../forms/file-upload";

interface ComposeMessageDialogProps {
  onSend?: (message: { to: string; subject: string; message: string }) => void;
}

export function ComposeMessageDialog({ onSend }: ComposeMessageDialogProps) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (onSend) {
      onSend({ to, subject, message });
    }
    setOpen(false);
    setTo("");
    setSubject("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full text-base leading-[22px]  bg-primary text-[#FFFFFF] rounded-full">
          <Plus /> Compose Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] [&>button]:hidden bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1.5">
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Compose and send a new message to your customer
            </DialogDescription>
          </div>
          <Button
            onClick={() => setOpen(false)}
            className="bg-transparent p-0 [&_svg]:size-6"
          >
            <X />
          </Button>
        </DialogHeader>
        <div className="space-y-6">
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
        </div>
        <DialogFooter>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSend}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="px-6 py-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
