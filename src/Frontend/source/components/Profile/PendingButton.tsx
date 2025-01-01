import FriendServices from '@/services/friendServices';
import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
export const PendingButton = ({ name, setThisState }: { name: string, setThisState: (state: string) => void }) => {
    const [clicked, setClicked] = useState(false);
    function handleClickAccept() {
            try{
                FriendServices.acceptFriendRequest(name);
                setClicked(true);
                setThisState('friend');
            }catch{
                console.log('error')
            }
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
        }, 2000);
    }
    function handleClickDecline() {
        try{
            FriendServices.declineFriendRequest(name);
            setClicked(true);
            setThisState('none');
        }catch{
            console.log('error')
        }
    }
    return (
        <div className="size-full gap-2">
           <button className={` bg-red-200 shadow-2xl text-white rounded-md w-[50%] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClickDecline} >
           {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Decline'}
            </button>
            <button className={` bg-[#00000026] text-white rounded-md w-[50%] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClickAccept} >
            {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Accept'}
            </button>
        </div>

    )
}