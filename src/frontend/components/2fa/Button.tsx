export default function Button({
  value,
  onClick,
}: {
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[201px] h-[68px] md:w-[301px] md:h-[88px] font-coustard
     font-black bg-[#C1382C] transition-all duration-300
      rounded-[21px] text-white md:text-[36px] 
      text-[24px] mt-12 md:mt-0 shadow-2xl"
    >
      {value}
    </button>
  );
}
