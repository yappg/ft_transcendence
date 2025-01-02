import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
export const EditProfile = ({setThisState}: {setThisState: (state: string) => void}) => {
    setThisState('self');
    return (
        <Link
          href={'/settings'}
          className="absolute top-4 right-4 lg:static w-fit h-fit p-1 bg-[#B7B7B7] rounded-[10px]  flex items-center justify-center"
        >
          <HiOutlinePencilSquare size={30} color="black" />
        </Link>
    );
};