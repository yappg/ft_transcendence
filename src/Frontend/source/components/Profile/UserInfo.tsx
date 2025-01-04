'use client';
import { User } from '@/context/GlobalContext';
import { Avatar } from './Avatar';
import { ProfileInfo } from './ProfileInfo';
import { InfoTitle } from './InfoTitle';
import { Separator } from '../ui/separator';
import { AddButton } from './AddButton';
import { PendingButton } from './PendingButton';
import { BlockButton } from './BlockButton';
import { EditProfile } from './EditProfile';
import { InviteSentButton } from './InviteSentButton';
import { UnBlockButton } from './UnBlockButton';
import { useEffect, useState } from 'react';
const UserInfo = ({
  userProfile,
  state,
} : {
  userProfile: User
  state: string
}) => {
  const [thisState, setThisState] = useState(state);
  console.log('thisState', thisState);
  console.log('state', state);

  useEffect(() => {
    setThisState(state);
  }, [state]);
  const renderContent = () => {
    switch (thisState) {
      case 'none':
        return <AddButton name={userProfile?.display_name} setThisState={setThisState} />;
      case 'received_invite':
        return <PendingButton name={userProfile?.display_name} setThisState={setThisState}/>;
      case 'friend':
        return <BlockButton name={userProfile?.display_name} setThisState={setThisState}/>;
      case 'sent_invite':
          return <InviteSentButton name={userProfile?.display_name} setThisState={setThisState}/>;
      case 'self':
        return <EditProfile setThisState={setThisState}/>;
      case 'blocked':
        return <UnBlockButton name={userProfile?.display_name} setThisState={setThisState}/>;
      case 'blocked_by_user':
        return <div>blocked by user</div>;
    }
  };
  return (
    <div className="size-full z-99 absolute flex lg:flex-row flex-col items-center justify-between px-6 py-4 2xl:px-10">
      <div className="lg:w-fit w-full h-fit lg:h-full flex flex-col items-center justify-start lg:flex-row lg:items-end lg:justify-start gap-12">
        <Avatar url={`http://localhost:8080${userProfile?.avatar}`} />
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
        <div className="w-[270px] h-[70px] flex items-center justify-end">{renderContent()}</div>
    </div>
    </div>
  );
};
export default UserInfo;
