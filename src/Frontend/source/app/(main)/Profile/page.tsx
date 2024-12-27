'use client';
import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
import { useUser } from '@/context/GlobalContext';
export default function page() {
  const { user: userProfile } = useUser();
  console.log(userProfile?.avatar);
  return (
    
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
        <div className="relative col-start-1 flex items-center justify-center w-full h-[400px] lg:h-[50%]">
          <div
            className="absolute h-full w-full -z-0"
            style={{
              backgroundImage: `url(${userProfile?.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(10px)',
            }}
          ></div>
          <UserInfo 
          userProfile={userProfile}/>
        </div>
        <div className="flex items-center justify-center w-full h-[calc(100%-400px)] lg:h-[50%] ">
          <UserSummary 
          user={userProfile} />
        </div>
      </div>
    </div>
  );
}
