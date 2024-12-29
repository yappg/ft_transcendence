import { useState } from 'react';
import { AiOutlineLoading } from "react-icons/ai";
export const PendingButton = ({ name }: { name: string }) => {
    const [clicked, setClicked] = useState(false);
    function handleClick() {
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
        }, 2000);
    }
    return (
        <div className="size-full gap-2">
           <button className={` bg-red-200 shadow-2xl text-white rounded-md w-[50%] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClick} >
           {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Decline'}
            </button>
            <button className={` bg-[#00000026] text-white rounded-md w-[50%] flex justify-center py-2 font-coustard transition-all duration-300`} onClick={handleClick} >
            {clicked ? <AiOutlineLoading className="animate-spin text-white text-[20px]"  /> : 'Accept'}
            </button>
        </div>

    )
}