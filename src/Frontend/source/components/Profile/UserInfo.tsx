import { HiOutlinePencilSquare } from "react-icons/hi2";

const UserInfo = () => {
    const user = {
        name: "Omaaar taraki",
        username: "Omaaaghh",
        level : "1/100%",
        totalWins: 10,
        totalBets: 20,
        winRate: 50,
    }
    return (
        <div className="size-full flex items-center justify-start px-10 ">
        <div className="flex items-end justify-center w-[300px] h-full pb-6 ">
         <img
          src="/ProfilePhoto.svg"
          alt="Profile"
          className="2xl:size-[300px] xl:size-[250px] lg:size-[200px] rounded-lg border-[5px] border-black object-cover"
        />
      </div>

      
        <div className="flex items-start justify-end w-[700px] h-full flex-col p-10">
            <div className="gap-10">
                <h1 className="2xl:text-[50px] xl:text-[45px] lg:text-[40px] md:text-[35px] font-dayson text-white ">{user.name}</h1>
                <div className="flex flex-row items-center gap-6 w-[100%] ">
                <p className="2xl:text-[35px] xl:text-[32px] lg:text-[25px] md:text-[20px] text-[#B6B6B6] font-dayson">@{user.username}</p>
                <p className="2xl:text-[28px] xl:text-[23px] text-[#B6B6B6] font-dayson">level {user.level}</p>
                </div>
                </div>
        </div>
        <div className="ml-auto flex flex-col items-end justify-between text-white h-full py-8">
            <div className="gap-4 lg:w-[150px] 2xl:w-[200px]">
            <p className="2xl:text-[20px] xl:text-[15px] font-dayson text-white">Total Wins: {user.totalWins}</p>
            <p className="2xl:text-[20px] xl:text-[15px] font-dayson text-white">Total Bets: {user.totalBets}</p>
            <p className="2xl:text-[20px] xl:text-[15px] font-dayson text-white">Wins Rate: {user.winRate}%</p>
            </div>
            <button className="text-black bg-[#B7B7B7] 2xl:size-[50px] lg:size-[45px] rounded-[10px]">
                <HiOutlinePencilSquare className="2xl:size-[50px] lg:size-[45px]"/>
            </button>
          </div>
        
        </div>
    );
}
export default UserInfo;

  