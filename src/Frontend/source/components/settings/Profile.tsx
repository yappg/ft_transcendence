import React from 'react';
import Content from '@/components/settings/Content';
import { Input } from '@/components/ui/input';
import { IconMail } from '@tabler/icons-react';
import { IconUserEdit } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';

const Profile = () => {
  const Player = {
    username: 'player',
    email: 'example@gmail.com',
    password: 'password',
  };
  return (
    <Content>
      <div className="w-full h-[95%] flex flex-col items-center justify-center">
        <div className="h-[10%] w-full ">
          <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-10 gap-8">
            <IconEdit stroke={2} className="text-white" />
            <h1 className="text-[25px] text-white font-coustard">Edit Profile</h1>
          </div>
        </div>
        <div className="h-[90%] w-full">
          <div className="h-1/4 w-full ">
            <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-10 gap-8">
              <IconMail stroke={1} className="text-white" />
              <h1 className="text-[25px] text-white font-coustard">Email</h1>
            </div>
            <div className="h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row">
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Player.email}
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
            <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-10 gap-8">
              <IconUserEdit stroke={2} className="text-white" />
              <h1 className="text-[25px] text-white font-coustard">Username</h1>
            </div>
            <div className="h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row">
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Player.username}
                </div>
              </div>
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  placeholder="New email..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white text-opacity-40 placeholder:opacity-55"
                />
              </div>
            </div>
          </div>
          <div className="h-1/4 w-full">
            <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-10 gap-8">
              <IconLock stroke={2} className="text-white" />
              <h1 className="text-[25px] text-white font-coustard">Password</h1>
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
