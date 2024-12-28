export const RatingElement = ({
    color,
    title,
    value
} : {
    color : string,
    title : string,
    value : number
}) => {
    return (
        <div className="w-fit h-fit flex items-start justify-start gap-5">
           <div
                className="rounded-full xl:size-[15px] size-[10px] border-2 border-black"
                style={{ backgroundColor: color }}
                ></div>
            <div className="flex flex-col items-start justify-start">
                <h1 className="text-white font-dayson text-[14px]">{title}</h1>
                <p className="text-white font-dayson text-[14px] opacity-50">{value}%</p>
            </div>
        </div>
    )
}