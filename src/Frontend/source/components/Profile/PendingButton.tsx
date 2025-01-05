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
        <div className="size-full gap-7 flex flex-row">
           <button className={`h-full bg-red-500 rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-white font-dayson text-lg shadow-2xl w-[50%]`} onClick={handleClickDecline} >
           {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Decline'}
            </button>
            <button className={` h-full bg-green-400 rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-white font-dayson text-lg shadow-2xl w-[50%]`} onClick={handleClickAccept} >
            {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Accept'}
            </button>
        </div>

    )
}