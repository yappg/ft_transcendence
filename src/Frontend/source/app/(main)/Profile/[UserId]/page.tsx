"use client";
import UserInfo from "@/components/Profile/UserInfo";
import UserSummary from "@/components/Profile/UserSummary";
import { History, User, Player } from "@/context/GlobalContext";
import { useState } from "react";
import { useEffect } from "react";
import fetcherestprofiles from "@/services/fetcherestprofiles";
import { useParams } from "next/navigation";
/* eslint-disable tailwindcss/no-custom-classname */
export default function Page() {
  const params = useParams();
  const id = parseInt((params?.UserId as string) || "");
  const [PlayerRestProfile, setPlayerRestProfile] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      try {
        fetcherestprofiles.getRestUser(id).then((data) => {
          setPlayerRestProfile(data);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [id]);
  console.log(PlayerRestProfile);
  // need to add online status
  if (!PlayerRestProfile) {
    return <div>loading ...</div>;
  } else {
    return (
      <div className="relative size-full overflow-auto md:py-4 md:pl-6">
        <div className="costum-little-shadow size-full gap-8 overflow-hidden md:rounded-[50px]">
          <div className="relative col-start-1 flex h-[55%] w-full items-center justify-center lg:h-2/5">
            <div
              className="absolute z-0 size-full min-h-[400px]"
              style={{
                backgroundImage: `url(http://localhost:8080${PlayerRestProfile?.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "blur(10px)",
              }}
            ></div>
            <UserInfo
              userProfile={PlayerRestProfile as User}
              state={PlayerRestProfile?.relation || ""}
            />
          </div>
          <div className="custom-scrollbar-container flex h-1/2 w-full items-start justify-start overflow-y-scroll lg:h-3/5">
            <UserSummary
              user={PlayerRestProfile as User}
              userFriends={PlayerRestProfile?.friends as Player[]}
              userHistory={PlayerRestProfile?.matches_history as History[]}
              is_private={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
