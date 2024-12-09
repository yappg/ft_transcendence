import React from 'react';
import Content from '@/components/settings/Content';
import { Input } from '@/components/ui/input';
import { IconBrandCampaignmonitor } from '@tabler/icons-react';
import { IconUsersMinus } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';

const Profile = () => {
  const [clicked, setClicked] = React.useState(0);
  const Player = {
    username: 'player',
    email: 'example@gmail.com',
    password: 'password',
  };
  function handleClick(id:number) {
    setClicked(id);
  }
  return (
    <Content>
      <div className="w-full h-[95%] flex flex-col items-center justify-center">
        <div className="h-[10%] w-full border-b-[2px] border-l-[2px] border-black bg-[#00000099]">
          <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-8 gap-8 ml-[-90px]">
            <IconEdit stroke={1} className="text-white h-[50px] w-[50px]" />
            <h1 className="text-[30px] text-white font-coustard font-light border-b-2">
              Edit Profile
            </h1>
          </div>
        </div>
        <div className="h-[90%] w-full ">
          <div className="h-1/4 w-full ">
            <div
              className="h-[50%] w-[100%] flex items-center justify-start flex-row gap-8"
              onClick={handleClick}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2 ">
                <IconBrandCampaignmonitor stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[#00000099] font-coustard">Email</h1>
            </div>
            <div
              className={`${clicked ? 'flex' : 'hidden'} h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row border-b-2`}
            >
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Player.email}
                </div>
              </div>
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  placeholder="New mail..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white text-opacity-40 placeholder:opacity-55"
                />
              </div>
            </div>
          </div>
          <div className="h-1/4 w-full">
          <div
              className="h-[50%] w-[100%] flex items-center justify-start flex-row gap-8"
              onClick={handleClick}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2 ">
                <IconUsersMinus stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[25px] text-[#00000099] font-coustard">Username</h1>
            </div>
            <div className="h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row">
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Player.username}
                </div>
              </div>
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  placeholder="New username..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white text-opacity-40 placeholder:opacity-55"
                />
              </div>
            </div>
          </div>
          <div className="h-1/4 w-full">
          <div
              className="h-[50%] w-[100%] flex items-center justify-start flex-row gap-8"
              onClick={handleClick}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2 ">
                <IconLock stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[#00000099] font-coustard">Password</h1>
            </div>
            <div className="h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row">
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  placeholder="Old password..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white text-opacity-40 placeholder:opacity-55"
                />
              </div>
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  placeholder="Password..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white text-opacity-40 placeholder:opacity-55"
                />
              </div>
            </div>
          </div>
          <div className="h-1/4 w-full"></div>
        </div>
      </div>
    </Content>
  );
};
export default Profile;
