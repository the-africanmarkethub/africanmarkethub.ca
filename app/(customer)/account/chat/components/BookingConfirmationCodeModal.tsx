import { useState } from "react";

export default function BookingConfirmationCodeModal({ isOpen, onClose, onVerify }: any) {
    const [code, setCode] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-2xl">
                <h3 className="mb-2 text-lg font-bold text-gray-900">Verify Completion</h3>
                <p className="mb-6 text-sm text-gray-500">
                    Ask the customer for the 4-digit code sent to their email to confirm delivery.
                </p>

                <input
                    type="text"
                    maxLength={4}
                    placeholder="0 0 0 0"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center text-3xl tracking-[15px] font-mono border-2 border-gray-100 rounded-xl py-4 focus:border-hub-primary focus:outline-none mb-6"
                />

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl">
                        Cancel
                    </button>
                    <button
                        onClick={() => onVerify(code)}
                        disabled={code.length < 4}
                        className="flex-1 py-3 text-sm font-semibold text-white bg-hub-primary rounded-xl disabled:bg-gray-300"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}