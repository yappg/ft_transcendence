import React from 'react';
import Content from '@/components/settings/Content';
import { Input } from '@/components/ui/input';
import { IconBrandCampaignmonitor } from '@tabler/icons-react';
import { IconUsersMinus } from '@tabler/icons-react';
import { IconLock } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { set } from 'zod';
const Profile = ({
  Profile,
  setProfile,
} :
{
  Profile: {
    username: string;
    email: string;
    oldPassword: string;
  };
  setProfile: (value: any) => void;
}) => {
  const [newProfile, setNewProfile] = useState({
    username: Profile.username,
    email: Profile.email,
    oldPass: '',
    newPass: '',
  });

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
        <div className="w-full h-[90%] px-8 py-12 flex flex-col items-start justify-start gap-12">
          <div className="w-full h-fit flex flex-col items-start justify-center gap-6">
            <h1 className="text-white text-xl font-dayson">Email</h1>
            <Input
              value={newProfile.email}
              onChange={(e) => {
                setNewProfile({ ...newProfile, email: e.target.value });
              }}
              placeholder="New mail..."
              className="bg-[#0000003D] rounded-[50px] w-[400px] text-white  placeholder:opacity-55"
            />
          </div>
          <div className="w-full h-fit flex flex-col items-start justify-center gap-6">
            <h1 className="text-white text-xl font-dayson">Username</h1>
            <Input
              value={newProfile.username}
              onChange={(e) => {
                setNewProfile({ ...newProfile, username: e.target.value });
              }}
              placeholder="New mail..."
              className="bg-[#0000003D] rounded-[50px] w-[400px] text-white  placeholder:opacity-55"
            />
          </div>
          <div className="w-full h-fit flex flex-col items-start justify-center gap-6">
            <h1 className="text-white text-xl font-dayson">Password</h1>
            <div className="flex flex-col items-start justify-center gap-2">
              <h1 className="text-white text-[14px] font-dayson">
                Old Password
              </h1>
            <Input
              value={newProfile.oldPass}
              type="password"
              onChange={(e) => {
                setNewProfile({ ...newProfile, oldPass: e.target.value });
              }}
              placeholder="Write old password..."
              className="bg-[#0000003D] rounded-[50px] w-[400px] text-white  placeholder:opacity-55"
            />
            </div>
            <div className="flex flex-col items-start justify-center gap-2">
              <h1 className="text-white text-[14px] font-dayson">
                  New Password
                </h1>
              <Input
                value={newProfile.newPass}
                type="password"
                onChange={(e) => {
                  setNewProfile({ ...newProfile, newPass: e.target.value });
                }}
                placeholder="Write new password..."
                className="bg-[#0000003D] rounded-[50px] w-[400px] text-white  placeholder:opacity-55"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              if (newProfile.oldPass != Profile.oldPassword) {
                console.log('Old password is wrong');
              } else 
              {
                setProfile({ ...Profile, oldPassword: newProfile.newPass, email: newProfile.email, username: newProfile.username });
                setNewProfile({ ...newProfile, oldPass: '', newPass: '' });
              }
            }}
            className="bg-[#fff] rounded-[13px] w-[400px] text-black placeholder:opacity-55"
          >
            Save
          </Button>
        </div>
      </div>
    </Content>
  );
};
export default Profile;

{
  /* <div className="h-[90%] w-full ">
          <div className="h-1/4 w-full ">
            <div
              className="h-[50%] w-[100%] flex items-center justify-start flex-row gap-8"
              onClick={() => handleClick(1)}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2 ">
                <IconBrandCampaignmonitor stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[#00000099] font-coustard">Email</h1>
            </div>
            <div
              className={`${clicked === 1 ? 'flex' : 'hidden'} h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row border-b-2`}
            >
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Profile.email}
                </div>
              </div>
              <div className="h-full w-[50%] flex items-center justify-center">
                <Input
                  value={Profile.email}
                  onChange={(e) => {
                    setProfile({ ...Profile, email: e.target.value });
                  }}
                  placeholder="New mail..."
                  className="bg-[#0000003D] rounded-[50px] w-[400px] text-white  placeholder:opacity-55"
                />
              </div>
            </div>
          </div>
          <div className="h-1/4 w-full">
            <div
              className="h-[50%] w-[100%] flex items-center justify-start flex-row gap-8"
              onClick={() => handleClick(2)}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2 ">
                <IconUsersMinus stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[#00000099] font-coustard">Username</h1>
            </div>
            <div
              className={`${clicked === 2 ? 'flex' : 'hidden'} h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row`}
            >
              <div className="h-full w-[50%] flex items-center justify-center">
                <div className="h-[50px] w-[400px] flex items-center justify-center border-2 border-white opacity-40 rounded-[50px]">
                  {Profile.username}
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
              onClick={() => handleClick(3)}
            >
              <div className="rounded-[50px] h-full w-[130px] ml-[-40px] flex justify-end items-center bg-[#FFFFFF4F] pr-2">
                <IconLock stroke={2} className="text-[#00000099] size-12" />
              </div>
              <h1 className="text-[25px] text-[#00000099] font-coustard">Password</h1>
            </div>
            <div
              className={`${clicked === 3 ? 'flex' : 'hidden'} h-[50%] w-[100%] items-start justify-center gap-40 flex flex-row`}
            >
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
        </div> */
}
