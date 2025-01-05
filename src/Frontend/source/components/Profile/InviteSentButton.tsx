import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
import FriendServices from '@/services/friendServices';
export const InviteSentButton = ({name, setThisState}: {name: string, setThisState: (state: string) => void}) => {
        const [clicked, setClicked] = useState(false);
        function handleClick() {
            try{
                FriendServices.cancelFriendRequest(name);
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
    return (
            <button className={`md:w-full w-[170px] md:h-full h-[30px] bg-white rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-blue-500 font-dayson text-lg shadow-2xl`} onClick={handleClick} >
                {clicked ? <AiOutlineLoading className="animate-spin text-black text-[20px]"  /> : 'Cancel'}
            </button>
        )
}