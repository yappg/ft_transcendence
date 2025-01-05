'use client';
import { RiSettings5Fill } from 'react-icons/ri';
import { FaUser } from 'react-icons/fa6';
import { BsFillBrushFill, BsKeyFill, BsBoxArrowLeft } from 'react-icons/bs';
import { Card } from '@/components/settings/Card';
import { useSearchParams } from 'next/navigation';
import Theme from '@/components/settings/Theme';
import { ImBlocked } from 'react-icons/im';
import Logout from '@/components/settings/Logout';
import { useState, useEffect, useContext } from 'react';
import Profile from '@/components/settings/Profile';
import { SideBarContext } from '@/context/SideBarContext';
import BlockedList from '@/components/settings/BlockedList';
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
    {
      title: 'Blocked',
      Icon: ImBlocked,
      path: 'blocked',
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
      case 'blocked':
        return <BlockedList />;
      default:
        return <Profile />;
    }
  };
  return (
    <div className="size-full md:py-4 md:pl-6 overflow-auto">
      <div className="costum-little-shadow size-full md:rounded-[50px] overflow-hidden bg-black-crd flex flex-col-reverse lg:flex-row">
        <div className="xl:w-2/6 xl:max-w-[300px] w-full h-[10%] lg:w-1/6 lg:h-full bg-[#0000008C] border-l-2 border-[#0000008C] flex flex-row lg:flex-col">
          <div className="w-0 hidden lg:w-full border-b-[2px] border-black h-full  lg:h-1/3 lg:flex items-center justify-center">
            <RiSettings5Fill color="white" className="xl:size-[120px] lg:size-[100px]" />
          </div>
          <div className="flex lg:flex-col flex-row items-start justify-start  w-full h-full lg:w-full lg:h-2/3">
            {fields.map((field, index) => (
              <div key={index} className="lg:w-full w-1/4 lg:h-1/6 h-full">
                <Card key={index} title={field.title} Icon={field.Icon} path={field.path} />
              </div>
            ))}
            <div className="lg:w-full w-1/4 lg:h-1/6 h-full flex items-center justify-center">
              <Logout />
            </div>
          </div>
        </div>
        <div className="w-full h-[90%] lg:h-full lg:w-6/6 xl:w-5/6 2xl:w-6/6 custom-scrollbar-container overflow-y-scroll flex flex-col">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
