import FriendServices from "@/services/friendServices";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai"

export const UnBlockButton = ({name, setThisState}: {name: string, setThisState: (state: string) => void}) => {
    const [clicked, setClicked] = useState(false);
    function handleClick() {
        try{
            FriendServices.unblockFriend(name);
            setClicked(true);
            setThisState('none');
        }catch{
            console.log('error')
        }
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
        }, 2000);
    }
    return <button className={`w-full h-full bg-[#4C4D4E75] rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-white font-dayson text-lg shadow-2xl`} onClick={handleClick} >
        {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Unblock'}
    </button>
}