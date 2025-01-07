// /* eslint-disable tailwindcss/no-custom-classname */
"use client";
import UserInfo from "@/components/Profile/UserInfo";
import UserSummary from "@/components/Profile/UserSummary";
import { User, useUser } from "@/context/GlobalContext";
import { useEffect } from "react";

export default function Page() {
  const { user, fetchCurrentUserDetails } = useUser();

  useEffect(() => {
    fetchCurrentUserDetails();
  }, [user?.username]);

  if (!user?.username) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex size-full items-center justify-center overflow-y-scroll scrollbar-hide md:py-4 md:pl-6">
      <div className="costum-little-shadow size-full gap-8 overflow-x-hidden bg-black-crd scrollbar-hide md:rounded-xl">
        <div className="relative z-0 col-start-1 flex h-2/3 w-full items-start justify-center lg:h-1/2">
          <div
            className="absolute z-20 h-[110%] w-[120%]"
            style={{
              backgroundImage: `url(http://localhost:8080${user?.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(10px)",
            }}
          ></div>
          <UserInfo userProfile={user as User} state="self" />
        </div>
        <div className="z-50 flex size-full items-start justify-center">
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
