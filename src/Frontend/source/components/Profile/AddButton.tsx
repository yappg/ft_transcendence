import FriendServices from "@/services/friendServices";
import { AiOutlineLoading } from "react-icons/ai";
import { useState } from "react";


export const AddButton = ({ name, setThisState }: { name: string, setThisState: (state: string) => void }) => {

    const [clicked, setClicked] = useState(false);
    function handleClick () {
        try{
            FriendServices.sendFriendRequest(name);
            setClicked(true);
            setThisState('sent_invite');
        }catch(error: any){
                console.log('error', error)
        }
    }
    return (
        <button className="w-full h-full bg-[#4C4D4E] rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-white font-dayson text-lg shadow-2xl" onClick={handleClick}>
            {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Add Friend'}
        </button>
    )
}
