import Image from "next/image";
export const Avatar = ({ url }: { url: string }) => {
  return (
    <Image
      src={url}
      alt="avatar"
      className="size-[100px] rounded-full outline outline-[3px] lg:size-[150px] lg:rounded-[40px] lg:outline-[5px]"
      width={100}
      height={100}
      unoptimized
    />
  );
};
