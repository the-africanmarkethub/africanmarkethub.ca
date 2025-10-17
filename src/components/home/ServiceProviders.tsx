import React from "react";
import Image from "next/image";

const placeholderProviders = [
  {
    id: 1,
    name: "John Doe",
    service: "Tailor",
    image: "/img/placeholder-provider1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    service: "Hairdresser",
    image: "/img/placeholder-provider2.jpg",
  },
  {
    id: 3,
    name: "Mike Brown",
    service: "Caterer",
    image: "/img/placeholder-provider3.jpg",
  },
  {
    id: 4,
    name: "Lisa White",
    service: "Photographer",
    image: "/img/placeholder-provider4.jpg",
  },
  {
    id: 5,
    name: "Paul Green",
    service: "Plumber",
    image: "/img/placeholder-provider5.jpg",
  },
  {
    id: 6,
    name: "Anna Blue",
    service: "Electrician",
    image: "/img/placeholder-provider6.jpg",
  },
];

export default function ServiceProviders() {
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">
        Service Providers
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {placeholderProviders.map((provider) => (
          <div
            key={provider.id}
            className="flex flex-col items-center bg-white rounded-lg shadow p-3"
          >
            <Image
              src={provider.image}
              alt={provider.name}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-full mb-2"
            />
            <span className="text-sm font-medium">{provider.name}</span>
            <span className="text-xs text-gray-500">{provider.service}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
