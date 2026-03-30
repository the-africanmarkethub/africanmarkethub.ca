"use client";

import { COMPANY_CONTACT_INFO, waMessage } from "@/setting";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { LuSettings, LuBell, LuArrowRight } from "react-icons/lu";

export default function MaintenancePage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-6 font-sans bg-zinc-50">
            <div className="w-full max-w-md text-center">
                {/* Icon Animation */}
                <div className="relative inline-flex mb-8">
                    <div className="p-4 bg-emerald-100 rounded-2xl">
                        <LuSettings className="w-12 h-12 text-emerald-600 animate-[spin_4s_linear_infinite]" />
                    </div>
                    <div className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-sm -top-2 -right-2">
                        <span className="relative flex w-3 h-3">
                            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-emerald-400"></span>
                            <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-500"></span>
                        </span>
                    </div>
                </div>

                {/* Branding & Message */}
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                    Improving the Hub
                </h1>
                <p className="mt-4 leading-relaxed text-zinc-600">
                    We're currently performing scheduled maintenance to make
                    <span className="font-semibold text-zinc-800"> African Market Hub </span>
                    faster and more secure for your business.
                </p>


                {/* Footer Link */}
                <div className="flex justify-center mt-10 text-center">
                    <div className="flex items-start mb-4">
                        <FaWhatsapp className="w-6 h-6 mt-1 text-hub-primary shrink-0" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-900">
                                Need Urgently?
                            </p>
                            <p className="text-gray-700 transition-colors hover:text-hub-secondary">
                                <Link href={`https://wa.me/${COMPANY_CONTACT_INFO.whatsappNumber}?text=${waMessage}`} rel="noopener noreferrer">
                                    Chat on WhatsApp
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}