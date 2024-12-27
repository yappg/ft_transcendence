'use client';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import { User } from '@/context/GlobalContext';
import { Avatar } from './Avatar';
import { ProfileInfo } from './ProfileInfo';
import { InfoTitle } from './InfoTitle';
const UserInfo = ({
  userProfile,
} : {
  userProfile: User
}) => {
  const { avatar, username, display_name, level } = userProfile;
  return (
    <div className="size-full z-99 absolute flex lg:flex-row flex-col items-center justify-between px-6 py-4">
      <div className="lg:w-fit w-full h-fit lg:h-full flex flex-col items-center justify-start lg:flex-row lg:items-end lg:justify-start gap-12">
        <Avatar url={userProfile?.avatar} />
        <ProfileInfo
          display_name={display_name}
          username={username}
          level={level}
        />
      </div>
      <div className="lg:w-fit w-full h-fit  lg:h-full flex-col flex items-end justify-between pr-6">
        <div className="flex w-full lg:w-fit flex-row lg:flex-col lg:items-start lg:justify-start items-center justify-center gap-4">
          <InfoTitle title={'Total Wins: '} value='55' />
          <InfoTitle title={'Total Losses: '} value='55' />
          <InfoTitle title={'Winrate: '} value='55%' />
        </div>
        <Link
          href={'/settings'}
          className="absolute top-4 right-4 lg:static w-fit h-fit p-1 bg-[#B7B7B7] rounded-[10px]  flex items-center justify-center"
        >
          <HiOutlinePencilSquare size={30} color="black" />
        </Link>
      </div>
    </div>
  );
};
export default UserInfo;
