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
    return <button className={` bg-green-500 text-white rounded-md w-[130px] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClick} >
        {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Unblock'}
    </button>
}