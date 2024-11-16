import { IconSearch } from '@tabler/icons-react';
import { Command, CommandInput, CommandList } from '@/components/ui/command';
import { IoMdNotifications } from 'react-icons/io';

export const Header = ({ isActivated }: { isActivated: number }) => {
  const paths = [
    { id: 1, path: 'Welcome' },
    { id: 2, path: 'Games' },
    { id: 3, path: 'Stars' },
    { id: 4, path: 'Trophies' },
    { id: 5, path: 'Achievement' },
    { id: 6, path: 'Friends' },
    { id: 7, path: 'Messages' },
  ];
  const profile = {
    name: 'Meryeme',
    lastHistory: {
      myscore: 10,
      opponentScore: 5,
      opponentProfile: {
        name: 'John Doe',
        avatar: '/images/avatar.jpg',
      },
    },
  };
  return (
    <div className="flex size-full items-center justify-between px-4">
      {paths
        .filter((path) => path.id === isActivated)
        .map((path) => (
          <div key={path.id} className="flex h-full w-fit items-center justify-start  gap-4">
            <h1 className=" font-dayson text-[20px] font-black text-black md:text-[25px] lg:text-[32px] xl:text-[36px] dark:text-white">
              {path.path}
            </h1>
            {path.id === 1 && (
              <span className="dark:text-fire-red text-aqua font-dayson text-[20px] font-black md:text-[25px] lg:text-[32px] xl:text-[36px]">
                {profile.name}
              </span>
            )}
          </div>
        ))}
      <div className="flex  w-fit items-center justify-center gap-12">
        <button className="flex lg:hidden">
          <div className="flex size-[30px] items-center justify-center md:size-[40px]">
            <IconSearch className="size-[35px] text-gray-400" />
          </div>
        </button>
        <Command className="hidden lg:flex lg:w-[340px] xl:w-[400px]">
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
        <div className="flex size-[33px] items-center justify-center rounded-full bg-[rgba(28,28,28,0.4)] opacity-60 shadow-xl md:size-[40px]">
          <IoMdNotifications className="size-[20px] text-[rgba(28,28,28,0.9)] opacity-40 md:size-[30px]" />
        </div>
      </div>
    </div>
  );
};
