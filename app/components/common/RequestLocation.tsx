"use client";

import { useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function LocationRequest() {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(userCoords);
        setLoading(false);
        toast.success("Location updated!");

        console.log("User Location:", userCoords);
      },
      (error) => {
        setLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error(
            "Please enable location permissions in your browser settings."
          );
        } else {
          toast.error("Unable to retrieve your location.");
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col items-center p-4 bg-orange-50 rounded-2xl border border-orange-100">
      <MapPinIcon className="w-8 h-8 text-orange-800 mb-2" />
      <h3 className="font-bold text-gray-900">Find Nearby Stores</h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        We use your location to find the closest African markets and calculate
        accurate shipping.
      </p>

      <button
        onClick={handleGetLocation}
        disabled={loading}
        className="bg-orange-800 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-orange-900 transition-all"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          "Share My Location"
        )}
      </button>

      {coords && (
        <p className="mt-2 text-[10px] text-gray-400">
          Location active: {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
        </p>
      )}
    </div>
  );
}
