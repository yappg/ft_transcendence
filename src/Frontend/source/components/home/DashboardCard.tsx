
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
        <div className="w-full h-full rounded-[30px] bg-black-crd flex items-start p-2 justify-between">
            <img src={'http://localhost:8080' + user.avatar} alt="avatar" className="sm:size-[70px] size-[50px] rounded-full object-cover" />
            <div className='flex flex-col items-start justify-center gap-2'>
                <h1 className='text-white  text-sm font-dayson'>{user.display_name}</h1>
                <h1 className='text-white  text-xs font-dayson'>Level {user.level}</h1>
            </div>
            <h1 className='text-white lg:text-[45px] text-[30px] font-coustard'>VS</h1>
            <div className='flex flex-col items-start justify-end gap-2'>
                <h1 className='text-white  text-sm font-dayson'>{user.display_name}</h1>
                <h1 className='text-white  text-xs font-dayson'>Level {user.level}</h1>
            </div>
            <img src={'http://localhost:8080' + user.avatar} alt="avatar" className="sm:size-[70px] size-[50px] rounded-full object-cover"/>
            <RiArrowRightSLine className='text-white sm:text-[80px] text-[50px] font-dayson font-bold' />
        </div>
    )
}