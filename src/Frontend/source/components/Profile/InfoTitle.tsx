export const InfoTitle = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col items-center justify-start gap-2 lg:flex-row lg:justify-center">
      <h1 className="font-dayson text-[12px] font-bold text-white lg:text-lg">{title}</h1>
      <h1 className="font-dayson text-[12px] font-bold text-white lg:text-lg">{value}</h1>
    </div>
  );
};
