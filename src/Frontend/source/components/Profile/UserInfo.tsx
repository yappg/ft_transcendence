import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Link from 'next/link';

const UserInfo = () => {
  const user = {
    name: 'Omaaar taraki',
    username: 'Omaaaghh',
    level: '1/100%',
    totalWins: 10,
    totalBets: 20,
    winRate: 50,
  };
  return (
    <div className="size-full flex items-center justify-start px-10 absolute z-99 md:flex-row flex-col">
      <div className="md:h-full md:w-[80%] w-full h-[80%] flex sm:flex-row flex-col">
        <div className="flex md:items-end items-center justify-center sm:w-[500px] sm:h-full pb-6 w-full h-[75%] pt-8 sm:pt-0">
          <img
            src="/ProfilePicture.svg"
            alt="Profile"
            className="2xl:size-[300px] xl:size-[250px] size-[200px] border-[4px] object-cover border-black sm:rounded-[40px] rounded-full"
          />
        </div>

        <div className="flex items-start md:justify-end sm:justify-center sm:w-[700px] h-full flex-col p-10 w-full">
          <div className="gap-10">
            <h1 className="2xl:text-[50px] xl:text-[45px] lg:text-[35px] md:text-[30px] text-[20px] font-dayson text-white ">
              {user.name}
            </h1>
            <div className="flex flex-row items-center lg:gap-6 gap-3 w-[100%] ">
              <p className="2xl:text-[35px] xl:text-[32px] lg:text-[25px] md:text-[17px] text-[12px] text-[#B6B6B6] font-dayson">
                @{user.username}
              </p>
              <p className="2xl:text-[28px] xl:text-[23px] md:text-[17px] text-[12px] text-[#B6B6B6] font-dayson">
                level {user.level}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-auto flex md:flex-col flex-row items-end justify-between text-white md:h-full md:w-[20%] w-full h-[20%] md:py-8 py-5">
        <div className="md:gap-4 md:w-[150px] 2xl:w-[200px] flex md:flex-col sm:w-[90%] sm:h-full">
          <div className="sm:w-1/3 md:w-full 2xl:text-[20px] xl:text-[15px] font-dayson text-white sm:flex sm:gap-3 md:gap-0 sm:flex-col sm:items-center md:flex-row sm:border-r-2 md:border-none">
            <h1>Total Wins :</h1>
            <h2>{user.totalWins}</h2>
          </div>
          <div className="sm:w-1/3 md:w-full 2xl:text-[20px] xl:text-[15px] font-dayson text-white sm:flex sm:gap-3 md:gap-0 sm:flex-col sm:items-center md:flex-row sm:border-r-2 md:border-none">
            <h1>Total Bets :</h1>
            <h2>{user.totalBets}</h2>
          </div>
          <div className="sm:w-1/3 md:w-full 2xl:text-[20px] xl:text-[15px] font-dayson text-white sm:flex sm:gap-3 md:gap-0 sm:flex-col sm:items-center md:flex-row">
            <h1>Wins Rate :</h1>
            <h1>{user.winRate}%</h1>
          </div>
        </div>
        <Link
          href="/settings?field=profile"
          className="text-black bg-[#B7B7B7] 2xl:size-[50px] md:size-[45px] rounded-[10px]"
        >
          <HiOutlinePencilSquare className="2xl:size-[50px] sm:size-[45px]" />
        </Link>
      </div>
    </div>
  );
};
export default UserInfo;
