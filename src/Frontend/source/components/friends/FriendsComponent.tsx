const FriendsComponent = ({
  key,
  name,
  ProfilePhoto,
  level,
}: {
  key: number;
  name: string;
  ProfilePhoto: string;
  level: number;
}): JSX.Element => {
  return (
    <div className="bg-side-bar h-[150px] w-full border-b-2 border-[#1C1C1C] border-opacity-[40%]"></div>
  );
};
export default FriendsComponent;
