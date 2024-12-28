'use client';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import Link from 'next/link';
import { User } from '@/context/GlobalContext';
import { Avatar } from './Avatar';
import { ProfileInfo } from './ProfileInfo';
import { InfoTitle } from './InfoTitle';
import { Separator } from '../ui/separator';
import { AddButton } from './AddButton';
import { PendingButton } from './AddButton';
import { BlockButton } from './AddButton';
import { EditProfile } from './EditProfile';
const UserInfo = ({
  userProfile,
  state,
} : {
  userProfile: User
  state: string
}) => {

  const renderContent = () => {
    switch (state) {
      case 'none':
        return <AddButton name={userProfile?.display_name} />;
      case 'pending':
        return <PendingButton name={userProfile?.display_name}/>;
      case 'friends':
        return <BlockButton name={userProfile?.display_name}/>;
    }
  };
  return (
    <div className="size-full z-99 absolute flex lg:flex-row flex-col items-center justify-between px-6 py-4 2xl:px-10">
      <div className="lg:w-fit w-full h-fit lg:h-full flex flex-col items-center justify-start lg:flex-row lg:items-end lg:justify-start gap-12">
        <Avatar url={userProfile?.avatar} />
        <ProfileInfo
          display_name={userProfile?.display_name}
          username={userProfile?.username}
          level={userProfile?.level}
        />
      </div>
      <div className="lg:w-fit w-full h-fit  lg:h-full flex-col flex items-end justify-between pr-6">
        <div className="flex w-full lg:w-fit flex-row lg:flex-col lg:items-start lg:justify-start items-center justify-center gap-4">
          <InfoTitle title={'Total Wins: '} value='55' />
          <Separator className="lg:hidden block" orientation="vertical" />
          <InfoTitle title={'Total Losses: '} value='55' />
          <Separator className="lg:hidden block" orientation="vertical" />
          <InfoTitle title={'Winrate: '} value='55%' />
        </div>
        {
          state === 'null' ? (
            <EditProfile />
          ) : (
        <div className="w-[270px] h-[70px]">{renderContent()}</div>
          )
        }
    </div>
    </div>
  );
};
export default UserInfo;
