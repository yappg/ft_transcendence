export const InfoTitle = ({
    title,
    value
} : {
    title : string,
    value : number
}) => {
    return (
        <div className="flex flex-col items-center justify-start gap-2 lg:flex-row lg:justify-between w-[160px]">
        <h1 className="font-dayson text-[12px] lg:text-lg font-bold text-white">
          {title}
      </h1>
        <h1 className="font-dayson text-[12px] lg:text-lg font-bold text-white">
          {value}
        </h1>
        </div>
    );
}