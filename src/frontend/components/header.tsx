import { IconSearch } from '@tabler/icons-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { IoMdNotifications } from 'react-icons/io';

export const Header = () => {
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
    <div className="flex items-center justify-between w-full h-full px-4">
      <div className="flex items-center justify-start gap-4 w-fit  h-full">
        <h1 className=" text-black xl:text-[36px] lg:text-[32px] md:text-[25px] text-[20px] font-days-one">
          Welcome
        </h1>
        <span className="text-[#66C3BD] xl:text-[36px] lg:text-[32px] md:text-[25px] text-[20px] font-days-one">
          {profile.name}
        </span>
      </div>
      <div className="w-fit  flex items-center justify-center gap-12">
        <button className="lg:hidden flex">
          <div className="md:h-[40px] md:w-[40px] w-[30px] h-[30px] flex items-center justify-center">
            <IconSearch className="text-gray-400 h-[35px] w-[35px]" />
          </div>
        </button>
        <Command className="hidden lg:flex lg:w-[340px] xl:w-[400px]">
          <CommandInput placeholder="Search..." />
          <CommandList />
        </Command>
        <div className="rounded-full bg-[rgba(28,28,28,0.4)] w-[33px] h-[33px] md:w-[40px] md:h-[40px] flex items-center justify-center shadow-xl opacity-60">
          <IoMdNotifications className="h-[20px] w-[20px] md:h-[30px] md:w-[30px] text-[rgba(28,28,28,0.9)] opacity-40" />
        </div>
      </div>
    </div>
  );
};
