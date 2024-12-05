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
          className="w-[300px] h-[300px] rounded-lg border-[5px] border-black object-cover"
        />
      </div>

      
        <div className="flex items-start justify-end h-full w-[700px] h-full flex-col p-10">
            <div className="gap-10">
                <h1 className="text-[50px] font-dayson text-white ">{user.name}</h1>
                <div className="flex flex-row items-center gap-6 w-[100%] ">
                <p className="text-[35px] text-[#B6B6B6] font-dayson">@{user.username}</p>
                <p className="text-[28px] text-[#B6B6B6] font-dayson">level {user.level}</p>
                </div>
                </div>
        </div>
        <div className="ml-auto flex flex-col items-end justify-between text-white h-full py-8">
            <div className="gap-4">
            <p className="text-[20px] font-dayson text-white">Total Wins: {user.totalWins}</p>
            <p className="text-[20px] font-dayson text-white">Total Bets: {user.totalBets}</p>
            <p className="text-[20px] font-dayson text-white">Wins Rate: {user.winRate}%</p>
            </div>
            <button className="text-black bg-[#B7B7B7] size-[50px] rounded-[10px]">
                <HiOutlinePencilSquare className="size-[50px]"/>
            </button>
          </div>
        
        </div>
    );
}
export default UserInfo;

  