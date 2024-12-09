'use client';
import { RiSettings5Fill } from 'react-icons/ri';
import { IoMdNotifications } from 'react-icons/io';
import { FaUser } from 'react-icons/fa6';
import { BsFillBrushFill, BsKeyFill, BsBoxArrowLeft } from 'react-icons/bs';
import { MdLanguage } from 'react-icons/md';
import { Card } from '@/components/settings/Card';
import { useSearchParams } from 'next/navigation';
import Notifications from '@/components/settings/Notifications';
import Profile from '@/components/settings/Profile';
import Theme from '@/components/settings/Theme';
import Language from '@/components/settings/Language';
import Security from '@/components/settings/Security';
import Logout from '@/components/settings/Logout';
import { useParams } from 'react-router-dom';

export default function Settings() {
  const fields = [
    {
      title: 'Notifications',
      Icon: IoMdNotifications,
      path: 'notifications',
    },
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
      title: 'Language',
      Icon: MdLanguage,
      path: 'language',
    },
    {
      title: 'Security',
      Icon: BsKeyFill,
      path: 'security',
    },
    {
      title: 'Logout',
      Icon: BsBoxArrowLeft,
      path: 'logout',
    },
  ];
  let param = useSearchParams();
  const current = param.get('field');
  const renderContent = () => {
    switch (current) {
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      case 'theme':
        return <Theme />;
      case 'language':
        return <Language />;
      case 'security':
        return <Security />;
      case 'logout':
        return <Logout />;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };
  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] py-4 pl-6">
      <div className="size-full bg-[#00000099] rounded-[40px] [box-shadow:4px_4px_60px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-row">
        <div className="w-[310px] h-full bg-[#0000008C] border-l-2 border-[#0000008C]">
          <div className="w-full h-1/3 flex items-center justify-center">
            <RiSettings5Fill size={120} color="white" />
          </div>
          <div className="w-full h-2/3 ">
            {fields.map((field, index) => (
              <Card key={index} title={field.title} Icon={field.Icon} path={field.path} />
            ))}
          </div>
        </div>
        <div className="w-full h-full overflow-hidden">{renderContent()}</div>
      </div>
    </div>
  );
}
