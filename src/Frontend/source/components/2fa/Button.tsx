export default function Button({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-coustard mt-12 h-[68px] w-[201px] rounded-[21px]
     bg-[#C1382C] text-[24px] font-black text-white
      costum-little-shadow transition-all duration-300 
      md:mt-0 md:h-[88px] md:w-[301px] md:text-[36px]"
    >
      {value}
    </button>
  );
}
