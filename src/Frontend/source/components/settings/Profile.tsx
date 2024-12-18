import React from 'react';
import { IconFeather } from '@tabler/icons-react';
import { useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { IconCloudLock } from '@tabler/icons-react';
const ProfileShema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  newPassword: z.string().min(8),
});
const Profile = () => {
  const [profile, setProfile] = useState({
    username: 'Meryem22',
    name: 'Meryem',
    email: 'test.ts@gmail.com',
    oldPassword: '123',
  });
  const [newProfile, setNewProfile] = useState({
    username: Profile.username,
    email: Profile.email,
    oldPass: '',
    newPass: '',
  });
  const [errors, setErrors] = useState({});
  function handleSave() {
    try {
      ProfileShema.parse({
        email: newProfile.email,
        username: newProfile.username,
        newPassword: newProfile.newPass,
      });
      setErrors({});
      setProfile({
        username: newProfile.username,
        email: newProfile.email,
        oldPassword: newProfile.oldPass,
      });
      setNewProfile({ ...newProfile, oldPass: '', newPass: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
      }
    }
  }
  return (
    // <Content>
    //   <div className="w-full h-[95%] flex flex-col items-center justify-center">
    //     <div className="h-[10%] w-full border-b-[2px] border-l-[2px] border-black bg-[#00000099]">
    //       <div className="h-[50%] w-[100%] flex items-center justify-center flex-row p-8 gap-8 ml-[-90px]">
    //         {/* <IconEdit stroke={1} className="text-white h-[50px] w-[50px]" /> */}
    //         {/* <h1 className="text-[30px] text-white font-coustard font-light border-b-2">
    //           Edit Profile
    //         </h1> */}
    //       </div>
    //     </div>
    //     <div className="w-full h-[90%] flex flex-col items-start justify-start gap-12">
    //       <EditProfilePicture/>
    //       <EditProfile/>
    //     </div>
    //   </div>
    // </Content>
    <div className="size-full flex flex-col gap-2 items-center">
      <div className="w-full h-1/5 flex justify-between items-center p-5 border-b-2 border-[rgba(28,28,28,0.9)]">
        <div className="size-[200px] gap-2 flex items-center justify-start p-4 flex-col">
          <h1 className="text-[rgba(28,28,28,0.9)] text-[20px]">Profile picture</h1>
          <div className="size-[100px] rounded-full bg-white"></div>
        </div>
        <div className="w-[500px] h-full flex items-center justify-start gap-8">
          <button className="bg-white rounded-md h-[50px] w-[200px] hover:bg-[#28AFB0] transition-all duration-300 text-[rgba(28,28,28,0.9)]">
            Change picture
          </button>
          <button className="bg-white rounded-md h-[50px] w-[200px] text-red-500 ">
            Delete picture
          </button>
        </div>
        <div></div>
        <div></div>
      </div>
      <div className="w-full h-2/5">
        <div className="w-full h-1/4 flex items-center justify-start gap-5 p-8">
          <IconFeather stroke={2} />
          <h1 className="text-[rgba(28,28,28,0.9)] text-[20px]">Personal information</h1>
        </div>
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
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 font-coustard">{errors.email}</p>
          )}
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
          {errors.username && (
            <p className="mt-1 text-sm text-red-500 font-coustard">{errors.username}</p>
          )}
        </div>
      </div>
      <div className="w-full h-2/5">
        <div className="w-full h-1/4 flex items-center justify-start gap-5 p-8">
          <IconCloudLock stroke={2} />
          <h1 className="text-[rgba(28,28,28,0.9)] text-[20px]">Security</h1>
        </div>
      </div>
    </div>
  );
};
export default Profile;
