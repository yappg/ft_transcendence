export const ProfileInfo = ({
  display_name,
  username,
  level,
}: {
  display_name: string;
  username: string;
  level: number;
}) => {
  return (
    <div className="flex size-fit flex-col items-center justify-start gap-2 lg:items-start">
      <h1 className="font-dayson text-2xl font-bold text-white">
        {display_name}
      </h1>
      <div className="flex items-center justify-start gap-2 pb-8">
        <h1 className="font-dayson text-sm font-bold text-[#B6B6B6]">
          @{username}
        </h1>
        <h1 className="font-dayson text-sm font-bold text-[#B6B6B6]">
          Level {level}
        </h1>
      </div>
    </div>
  );
};
