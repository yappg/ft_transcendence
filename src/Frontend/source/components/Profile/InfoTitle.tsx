export const InfoTitle = ({
    title,
    value
} : {
    title : string,
    value : string
}) => {
    return (
        <div className="flex flex-col items-center justify-start gap-2 lg:flex-row lg:justify-center border-r-2 border-white border-opacity-[40%] p-3 lg-border-none">
        <h1 className="font-dayson text-sm lg:text-lg font-bold text-white">
          {title}
      </h1>
        <h1 className="font-dayson text-sm lg:text-lg font-bold text-white">
          {value}
        </h1>
        </div>
    );
}