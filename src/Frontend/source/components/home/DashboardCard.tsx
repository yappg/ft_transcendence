
import { useUser } from '@/context/GlobalContext';
import { RiArrowRightSLine } from "react-icons/ri";
export const DashboardCard = (...props: any) => {
    const { user } = useUser();
    if (!user) {
        return <div className="w-full h-full rounded-[30px]">
            <h1 className="text-white text-2xl font-dayson font-bold">No data available</h1>
        </div>
    }
    return (
        <div className="w-full h-full rounded-[30px] bg-black-crd flex items-center justify-between px-4">
            <img src={process.env.NEXT_PUBLIC_HOST + user.avatar} alt="avatar" className="size-[100px] rounded-full object-cover" />
            <div className='flex flex-col items-start justify-center gap-2'>
                <h1 className='text-white text-lg font-dayson'>{user.display_name}</h1>
                <h1 className='text-white text-sm font-dayson'>Level {user.level}</h1>
            </div>
            <h1 className='text-white text-[45px] font-dayson font-bold'>VS</h1>
            <div className='flex flex-col items-start justify-end gap-2'>
                <h1 className='text-white text-lg font-dayson'>{user.display_name}</h1>
                <h1 className='text-white text-sm font-dayson'>Level {user.level}</h1>
            </div>
            <img src={process.env.NEXT_PUBLIC_HOST + user.avatar} alt="avatar" className="size-[100px] rounded-full object-cover" />
            <RiArrowRightSLine className='text-white text-[80px] font-dayson font-bold' />
        </div>
    )
}
