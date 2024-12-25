'use client';
import UserInfo from '@/components/Profile/UserInfo';
import UserSummary from '@/components/Profile/UserSummary';
import { useUser } from '@/context/GlobalContext';
import {useState} from 'react';
import { useEffect } from 'react';
import fetcherestprofiles from '@/services/fetcherestprofiles';
import { useParams } from 'next/navigation';
export default function Page() {
  const params = useParams();
  const id = params.UserId;
  const [PlayerRestProfile, setPlayerRestProfile] = useState(null);
  useEffect(() => {
    try {
      fetcherestprofiles.getPlayers(id).then((data) => {
        setPlayerRestProfile(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

    return (
    
            <div className="size-full md:py-4 md:pl-6 overflow-auto">
              <div className="costum-little-shadow size-full overflow-hidden md:rounded-[50px] gap-8">
                <div className="relative col-start-1 col- flex items-center justify-center w-full h-[40%] md:h-[50%] min-h-[300px]">
                  <div
                    className="absolute h-full w-full -z-0"
                    style={{
                      backgroundImage: `url(${PlayerRestProfile?.cover})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: 'blur(10px)',
                    }}
                  ></div>
                  <UserInfo 
                  userProfile={PlayerRestProfile}/>
                </div>
                <div className="flex items-center justify-center w-full h-[60%] md:h-[50%] ">
                  <UserSummary 
                  user={PlayerRestProfile}
                  private={PlayerRestProfile?.is_private} />
                </div>
              </div>
            </div>
    );
}