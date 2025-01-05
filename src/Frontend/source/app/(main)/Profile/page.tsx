'use client';
import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
import { User, useUser } from '@/context/GlobalContext';
export default function Page() {
  const { user } = useUser();

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-y-scroll custom-scrollbar-container">
      <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
        <div className="relative col-start-1 flex items-center justify-center w-full h-[60%] lg:h-[40%]">
          <div
            className="absolute h-full w-full z-[0]"
            style={{
              backgroundImage: `url(http://localhost:8080${user?.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(10px)',
            }}
          ></div>
          <UserInfo userProfile={user as User} state="null" />
        </div>
        <div className="flex items-start justify-start w-full lg:h-[60%] h-[45%]">
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
