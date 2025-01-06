import Image from "next/image";
export const Avatar = ({ url }: { url: string }) => {
  return (
    <Image
      src={url}
      alt="avatar"
      className="size-[150px] rounded-full outline outline-[3px] lg:size-[250px] lg:rounded-[40px] lg:outline-[5px]"
      width={150}
      height={150}
      unoptimized
    />
  );
};
