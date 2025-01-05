'use client';
import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
import { History, User, Player } from '@/context/GlobalContext';
import { useState } from 'react';
import { useEffect } from 'react';
import fetcherestprofiles from '@/services/fetcherestprofiles';
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();
  const id = Number(params.UserId);
  const [PlayerRestProfile, setPlayerRestProfile] = useState<User | null>(null);
  useEffect(() => {
    try {
      fetcherestprofiles.getRestUser(id).then((data) => {
        setPlayerRestProfile(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  // need to add online status
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
        <div className="relative col-start-1 flex items-center justify-center w-full h-[55%] lg:h-[40%]">
          <div
            className="absolute h-full w-full z-[0]"
            style={{
              backgroundImage: `url(http://localhost:8080${PlayerRestProfile?.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'blur(10px)',
            }}
          ></div>
          <UserInfo
            userProfile={PlayerRestProfile as User}
            state={PlayerRestProfile?.relation || ''}
          />
        </div>
        <div className="flex items-start justify-start w-full h-[45%] lg:h-[60%] overflow-y-scroll custom-scrollbar-container">
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
