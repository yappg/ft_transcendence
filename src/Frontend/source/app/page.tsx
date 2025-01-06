/* eslint-disable tailwindcss/no-custom-classname */
import Background from "@/components/landing-page/Background";
import React from "react";

export default function Home() {
  return (
    <div className="relative z-[1] h-screen w-full overflow-hidden bg-white dark:bg-secondary">
      <Background />
    </div>
  );
}
