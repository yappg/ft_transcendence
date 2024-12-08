import { RiSettings5Fill } from "react-icons/ri";
import { IoMdNotifications } from 'react-icons/io';
import { FaUser } from "react-icons/fa6";
import { BsFillBrushFill, BsKeyFill, BsBoxArrowLeft } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { Card } from "@/components/settings/Card";

export default function Settings() {

const fields = [
    {
        title: "Notifications",
        Icon: IoMdNotifications
    },
    {
        title: "Profile",
        Icon : FaUser
    },
    {
        title: "Theme",
        Icon: BsFillBrushFill
    },
    {
        title: "Language",
        Icon: MdLanguage
    },
    {
        title: "Security",
        Icon: BsKeyFill
    },
    {
        title: "Logout",
        Icon: BsBoxArrowLeft
    }
]

    return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6">
        <div className="size-full bg-[#00000099] rounded-[40px] [box-shadow:4px_4px_60px_0px_rgba(0,0,0,1)] overflow-hidden">
    <div className="w-[310px] h-full bg-[#00000030]">
        <div className="w-full h-1/3 flex items-center justify-center">
            <RiSettings5Fill size={120} color="white"/>
        </div>
        <div className="w-full h-2/3">
            {
                fields.map((field, index) => (
                    <Card
                        key={index}
                        title={field.title}
                        Icon={field.Icon}
                    />
                ))

            }
        </div>
    </div>
</div>
    </div>
    );
}