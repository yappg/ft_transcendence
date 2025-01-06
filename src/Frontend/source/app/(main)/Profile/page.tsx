"use client";
import UserInfo from "@/components/Profile/UserInfo";
import UserSummary from "@/components/Profile/UserSummary";
import { User, useUser } from "@/context/GlobalContext";
/* eslint-disable tailwindcss/no-custom-classname */
export default function Page() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="custom-scrollbar-container size-full overflow-y-scroll md:py-4 md:pl-6">
      <div className="costum-little-shadow size-full gap-8 overflow-hidden md:rounded-[50px]">
        <div className="relative col-start-1 flex h-3/5 w-full items-center justify-center lg:h-2/5">
          <div
            className="absolute z-0 size-full min-h-[400px]"
            style={{
              backgroundImage: `url(http://localhost:8080${user?.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(10px)",
            }}
          ></div>
          <UserInfo userProfile={user as User} state="null" />
        </div>
        <div className="flex h-[45%] w-full items-start justify-start lg:h-3/5">
          <UserSummary
            user={user as User}
            userFriends={user?.friends}
            userHistory={user?.matches_history}
            is_private={false}
          />
        </div>
      </div>
    </div>
  );
}
