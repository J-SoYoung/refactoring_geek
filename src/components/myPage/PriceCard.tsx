import React from "react";

export default function PriceCard({
  text,
  price,
}: {
  text: string;
  price: number;
}) {
  return (
    <div className="bg-gray-50 p-6 mx-2 rounded-xl text-center text-sm md:text-sm">
      <p className="mb-[10px] font-bold">{text}</p>
      <p className="font-bold text-brand md:text-lg text-[#8F5BBD]">₩{price}</p>
    </div>
  );
}
