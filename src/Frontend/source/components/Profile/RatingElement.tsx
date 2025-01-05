export const RatingElement = ({
  color,
  title,
  value,
}: {
  color: string;
  title: string;
  value: number;
}) => {
  return (
    <div className="flex size-fit items-start justify-start gap-5">
      <div
        className="size-[10px] rounded-full border-2 border-black xl:size-[15px]"
        style={{ backgroundColor: color }}
      ></div>
      <div className="flex flex-col items-start justify-start">
        <h1 className="font-dayson text-[14px] text-white lg:text-[10px] xl:text-[15px]">
          {title}
        </h1>
        <p className="font-dayson text-[14px] text-white opacity-50 lg:text-[10px] xl:text-[15px]">
          {value}%
        </p>
      </div>
    </div>
  );
};
