'use client';
import { RiSettings5Fill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa6';
import { BsFillBrushFill, BsKeyFill, BsBoxArrowLeft } from 'react-icons/bs';
import { Card } from '@/components/settings/Card';
import { useSearchParams } from 'next/navigation';
import Theme from '@/components/settings/Theme';
import Security from '@/components/settings/Security';
import Logout from '@/components/settings/Logout';
import { useState, useEffect, useContext } from 'react';
import Profile from '@/components/settings/Profile';
import { SideBarContext } from '@/context/SideBarContext';
export default function Settings() {
  const { setIsActivated } = useContext(SideBarContext);
  useEffect(() => {
    setIsActivated(8);
  }, [setIsActivated]);
  const fields = [
    {
      title: 'Profile',
      Icon: FaUser,
      path: 'profile',
    },
    {
      title: 'Theme',
      Icon: BsFillBrushFill,
      path: 'theme',
    },
  ];
  let param = useSearchParams();
  const current = param.get('field');
  const renderContent = () => {
    switch (current) {
      case 'profile':
        return <Profile />;
      case 'theme':
        return <Theme />;
      default:
        return <Profile />;
    }
  };
  return (
    <div className="size-full py-4 pl-6">
      <div className="size-full bg-[#00000099] rounded-[40px] [box-shadow:4px_4px_60px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-row">
        <div className="w-[310px] h-full bg-[#0000008C] border-l-2 border-[#0000008C]">
          <div className="w-full h-1/3 flex items-center justify-center">
            <RiSettings5Fill size={120} color="white" />
          </div>
          <div className="w-full h-2/3 ">
            {fields.map((field, index) => (
              <Card key={index} title={field.title} Icon={field.Icon} path={field.path} />
            ))}
            <div className="w-full h-[16.6%] bg-[#00000026] border-t-[2px] border-r-[2px] border-black">
              <Logout />
            </div>
          </div>
        </div>
        <div className="w-full h-full overflow-hidden">{renderContent()}</div>
      </div>
    </div>
  );
}
