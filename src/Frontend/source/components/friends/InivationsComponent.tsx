import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { invitations } from '@/constants/InvitationsList';
const InvitationsComponent = ({
  key,
  name,
  ProfilePhoto,
  sendAt,
}: {
  key: number;
  name: string;
  ProfilePhoto: string;
  sendAt: string;
}): JSX.Element => {
  return (
    <div className="bg-black-crd flex h-[150px] w-full flex-row items-center justify-between border-b-2 border-[#1C1C1C] border-opacity-[40%] px-4 lg:px-5">
      <div className="flex h-[75px] w-fit flex-row items-center justify-center gap-8 xl:gap-10">
        <Avatar className="size-[65px] transition-all duration-300 md:size-[70px] lg:size-[75px]">
          <AvatarImage src={ProfilePhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-[75px] w-fit flex-col ">
          <h1 className="font-dayson text-[17px] text-[#1C1C1C] opacity-[90%] transition-all duration-300 lg:text-[25px] xl:text-[27px] 2xl:text-[30px] dark:text-white">
            {name}
          </h1>
          <h1 className="font-coustard text-[12px] text-white opacity-[30%] transition-all duration-300 md:text-[20px] xl:text-[25px]">
            sent {sendAt}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default InvitationsComponent;
