const Rating = () => {
    return(
        <div className="w-[50%] h-full">
            <div className="w-full h-1/2  flex flex-row">
            <div className="w-1/2 h-full flex items-start justify-start p-4 gap-5">
            <div className="rounded-full bg-[#766153] xl:size-[15px] size-[10px]"></div>
            <div className="flex flex-col items-start justify-start">
                <h1 className="text-white font-dayson text-[14px]">Earth</h1>
                <p className="text-white font-dayson text-[14px] opacity-50">50%</p>
            </div>
            </div>
            <div className="w-1/2 h-full  flex items-start justify-start p-4 gap-5">
            <div className="rounded-full bg-[#C1382C] xl:size-[15px] size-[10px]"></div>
            <div className="flex flex-col items-start justify-start">
                <h1 className="text-white font-dayson text-[14px]">Fire</h1>
                <p className="text-white font-dayson text-[14px] opacity-50">50%</p>
            </div>
            </div>
            </div>
            <div className="w-full h-1/2 flex flex-row">
            <div className="w-1/2 h-full flex items-start justify-start p-4 gap-5">
            <div className="rounded-full bg-[#98CBD0] xl:size-[15px] size-[10px]"></div>
            <div className="flex flex-col items-start justify-start">
                <h1 className="text-white font-dayson text-[14px]">Air</h1>
                <p className="text-white font-dayson text-[14px] opacity-50">50%</p>
            </div>
            </div>
            <div className="w-1/2 h-full flex items-start justify-start p-4 gap-5">
            <div className="rounded-full bg-[#00A6FF] xl:size-[15px] size-[10px]"></div>
            <div className="flex flex-col items-start justify-start">
                <h1 className="text-white font-dayson text-[14px]">Water</h1>
                <p className="text-white font-dayson text-[14px] opacity-50">50%</p>
            </div>
            </div>
            </div>
        </div>
    )
};
export default Rating;