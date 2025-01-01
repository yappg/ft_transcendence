import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
import FriendServices from '@/services/friendServices';
export const InviteSentButton = () => {
        const [clicked, setClicked] = useState(false);
        function handleClick() {
            // try{
            //     FriendServices.cancelFriendRequest(name);
            //     setClicked(true);
            // }catch{
            //     console.log('error')
            // }
            setClicked(true);
            setTimeout(() => {
                setClicked(false);
            }, 2000);
        }
    return (
            <button className={` bg-green-500 text-white rounded-md w-[130px] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClick} >
                {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Cancel'}
            </button>
        )
}