import React, { use } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconType } from "react-icons/lib";
export const Card = ({
  title,
  Icon,
  path,
}: {
  title: string;
  Icon: IconType;
  path: string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleFilter() {
    if (!path) {
      return;
    }
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    currentParams.set("field", path);
    router.push(`?${currentParams.toString()}`);
  }
  return (
    <div className="size-full border-b-2 border-r-2 border-black transition-all duration-300 hover:bg-[#000000]">
      <button
        className="flex size-full items-center justify-center gap-11 p-0 lg:justify-start lg:px-12"
        onClick={handleFilter}
      >
        <Icon
          style={{
            height: "30px",
            width: "30px",
          }}
          color="white"
        />
        <h1 className="hidden font-dayson text-white xl:block">{title}</h1>
      </button>
    </div>
  );
};
