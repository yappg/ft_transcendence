export const Avatar = ({ url }: { url: string }) => {
  return (
    <img
      src={url}
      alt="avatar"
      className="size-[150px] rounded-full outline outline-[3px] lg:size-[250px] lg:rounded-[40px] lg:outline-[5px]"
    />
  );
};
