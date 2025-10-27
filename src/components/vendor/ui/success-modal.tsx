import { Dialog, DialogContent } from "@/components/vendor/ui/dialog";
import { Button } from "@/components/vendor/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function SuccessModal({ isOpen, onClose, title }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] rounded-full p-0">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="#FFF5E9" />
              <path
                d="M24 12C17.376 12 12 17.376 12 24C12 30.624 17.376 36 24 36C30.624 36 36 30.624 36 24C36 17.376 30.624 12 24 12ZM24 33.6C18.696 33.6 14.4 29.304 14.4 24C14.4 18.696 18.696 14.4 24 14.4C29.304 14.4 33.6 18.696 33.6 24C33.6 29.304 29.304 33.6 24 33.6Z"
                fill="#F28C0D"
              />
              <path
                d="M28.5602 19.32L22.8002 25.08L19.4402 21.72C18.9602 21.24 18.2402 21.24 17.7602 21.72C17.2802 22.2 17.2802 22.92 17.7602 23.4L22.0402 27.68C22.2802 27.92 22.5602 28.04 22.8402 28.04C23.1202 28.04 23.4002 27.92 23.6402 27.68L30.2402 21.08C30.7202 20.6 30.7202 19.88 30.2402 19.4C29.7602 18.92 29.0402 18.92 28.5602 19.32Z"
                fill="#F28C0D"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-[#1A1A1A]">{title}</h2>
          <Button
            onClick={onClose}
            className="mt-6 h-[52px] w-[301px] rounded-full  border-[#9C5432] bg-white text-[#1A1A1A] border hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
