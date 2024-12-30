'use client';
import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
import { User, useUser } from '@/context/GlobalContext';
import { useEffect } from 'react';
export default function Page() {
  const { user: userProfile, PlayerMatches, players } = useUser();
  console.log(userProfile);
  if (!userProfile) {
    return <div>Loading...</div>;
  }
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
        <div className="relative col-start-1 flex items-center justify-center w-full h-[55%] lg:h-[40%]">
          <div
            className="absolute h-full w-full z-[0]"
            style={{
              backgroundImage: `url(${userProfile?.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(10px)',
            }}
          ></div>
          <UserInfo userProfile={userProfile as User} state="null" />
        </div>
        <div className="flex items-start justify-start w-full h-[45%] lg:h-[60%] overflow-y-scroll">
          <UserSummary
            user={userProfile as User}
            userFriends={players}
            userHistory={PlayerMatches}
            is_private={false}
          />
        </div>
      </div>
    </div>
  );
}
