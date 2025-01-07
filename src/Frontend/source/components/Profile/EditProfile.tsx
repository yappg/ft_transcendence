import { HiOutlinePencilSquare } from "react-icons/hi2";
import Link from "next/link";
export const EditProfile = () => {
  return (
    <Link
      href={"/settings"}
      className="right-4 top-4 flex size-fit items-center justify-center rounded-[10px] border border-black bg-[#B7B7B7] p-1 lg:static"
    >
      <HiOutlinePencilSquare size={40} color="black" />
    </Link>
  );
};
