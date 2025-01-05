import FriendServices from '@/services/friendServices';
import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
export const BlockButton = ({
    name,
    setThisState,
}: {
    name: string;
    setThisState: (state: string) => void;
}) => {
    const [clicked, setClicked] = useState(false);
    function handleClick() {
            try{
                FriendServices.blockFriend(name);
                setClicked(true);
                setThisState('blocked');
            }catch{
                console.log('error')
            }
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
        }, 2000);
    }
    return (
        <button className={`md:w-full w-[170px] md:h-full h-[30px] bg-[#080E7E] rounded-[14px] lg:rounded-[30px] flex items-center justify-center text-white font-dayson text-lg shadow-2xl`} onClick={handleClick} >
            {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Block'}
        </button>
    )
}