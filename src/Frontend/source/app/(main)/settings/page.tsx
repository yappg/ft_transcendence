/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable tailwindcss/classnames-order */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { RiSettings5Fill } from "react-icons/ri";
import { FaUser } from "react-icons/fa6";
import { BsFillBrushFill, BsKeyFill, BsBoxArrowLeft } from "react-icons/bs";
import { Card } from "@/components/settings/Card";
import Theme from "@/components/settings/Theme";
import { ImBlocked } from "react-icons/im";
import Logout from "@/components/settings/Logout";
import { useEffect, useContext } from "react";
import Profile from "@/components/settings/Profile";
import { SideBarContext } from "@/context/SideBarContext";
import BlockedList from "@/components/settings/BlockedList";
import React from "react";
import { useSearchParams } from "next/navigation";
export default function Settings() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(8);
  }, [setIsActivated]);
  const fields = [
    {
      title: "Profile",
      Icon: FaUser,
      path: "profile",
    },
    {
      title: "Theme",
      Icon: BsFillBrushFill,
      path: "theme",
    },
    {
      title: "Blocked",
      Icon: ImBlocked,
      path: "blocked",
    },
  ];

  // const [searchParams] = React.useState(() => {
    const params = useSearchParams();
    const field = params.get("field") as string;

  const renderContent = () => {
    switch (field) {
      case "profile":
        return <Profile />;
      case "theme":
        return <Theme />;
      case "blocked":
        return <BlockedList />;
      default:
        return <Profile />;
    }
  };
  return (
    <div className="flex size-full items-center justify-center">
      <div className="costum-little-shadow flex size-full flex-col-reverse overflow-hidden bg-black-crd md:rounded-[50px] lg:flex-row">
        <div className="flex h-[10%] w-full flex-row border-l-2 border-[#0000008C] bg-[#0000008C] lg:h-full lg:w-1/6 lg:flex-col xl:w-2/6 xl:max-w-[300px]">
          <div className="hidden h-full w-0 items-center justify-center border-b-2 border-black lg:flex lg:h-1/3 lg:w-full">
            <RiSettings5Fill
              color="white"
              className="lg:size-[100px] xl:size-[120px]"
            />
          </div>
          <div className="flex size-full flex-row items-start justify-start lg:h-2/3 lg:w-full lg:flex-col">
            {fields.map((field, index) => (
              <div key={index} className="h-full w-1/4 lg:h-1/6 lg:w-full">
                <Card
                  key={index}
                  title={field.title}
                  Icon={field.Icon}
                  path={field.path}
                />
              </div>
            ))}
            <div className="flex h-full w-1/4 items-center justify-center lg:h-1/6 lg:w-full">
              <Logout />
            </div>
          </div>
        </div>
        <div className="lg:w-6/6 2xl:w-6/6 custom-scrollbar-container flex h-[90%] w-full flex-col overflow-y-scroll lg:h-full xl:w-5/6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
