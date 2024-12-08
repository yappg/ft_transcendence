import React from "react";
export const Card = (
    {
        title, Icon, key
    } 
    : {
        title: string;
        Icon: React.ReactNode;
        key: number
    }
) => {
    return (
    <div key={key} className="w-full h-[16.6%] bg-[#00000026] border-t-[2px] border-black flex items-center justify-between px-12">
        <Icon size={30} color="white"/>
        <h1 className="text-white">{title}</h1>
    </div>
    );
}