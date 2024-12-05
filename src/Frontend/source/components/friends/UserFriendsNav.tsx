import Link from 'next/link';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FriendsComponent from '@/components/friends/FriendsComponent';
import FriendRequestCard from './FriendRequestCard';
import AddFriends from './AddFriendsComponent';
import {useEffect} from 'react';
import FriendServices from '@/services/friendServices';
import { toast } from '@/hooks/use-toast';
import { FaCommentDots } from 'react-icons/fa';

const UserFriendsNav = (): JSX.Element => {
  const player = {
    name: 'Noureddine Akebli',
    level: 22,
  };
  const [Requests, setRequests] = useState([]);
  const [Friends, setFriends] = useState([]);

  useEffect(() => {
    const displayInvit = async () => {
      
      try {
        const response = await FriendServices.getFriendRequests();
        console.log('Friends Requests\n', response.data);
        if (response.message)
        {
          setRequests(response.data);
        }
        else if (response.error){
          console.log(response.error)
        }
      } catch (error) {
        toast({
          title: 'Authentication failed',
          description: 'Oups Somthing went wrong !',
          variant: 'destructive',
          className: 'bg-primary-dark border-none text-white',
        });
      }
    }
    displayInvit();
  }, []);
  
  useEffect(() => {
    const displayFriends = async () => {
      
      try {
        const response = await FriendServices.getFriends();
        console.log('Friends:',response.data);
        if (response.message){
          setFriends(response.data);
        }
        else if (response.error) { 
          console.log(response.error)
        }
      } catch (error) {
        toast({
          title: 'Authentication failed',
          description: 'Oups Somthing went wrong !',
          variant: 'destructive',
          className: 'bg-primary-dark border-none text-white',
        });
      }
    }
    displayFriends();
  }, []);
   


  // const { name, level } = player;
  
  const [activeIndex, setActiveIndex] = useState(0);
  // const { activeIndex, setActiveIndex } = useContext(TabContext);

  const headers = [
    { title: 'Your Friends', href: '' },
    { title: 'Invitations', href: '' },
    { title: 'Add New', href: '' },
  ];
  const renderContent = () => {
    if (activeIndex === 0) {
      return (
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {Friends.length > 0 ? (
          Friends.map((friend: any, index) => (
            <FriendsComponent
              key={index}
              name={friend.friend_requester}
              ProfilePhoto={friend.profilePhoto}
              level={friend.level}
              wins={friend.wins}
              messagesLink={
                <div className="flex items-center justify-center">
                  <Link href="/messages">
                    <FaCommentDots className="size-[40px] text-[#1C1C1C] opacity-40 transition-all duration-300 xl:size-[50px] 2xl:size-[55px] dark:text-[#B8B8B8] mr-4" />
                  </Link>
                </div>
              }
            />
          ))
  ) : (
    <div className="text-center font-bold text-white h-full flex items-center justify-center bg-black-crd">No Friends to display </div>
  )}
        </div>
      );
    } else if (activeIndex === 1) {
      return (
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {Requests.length > 0 ? (
          Requests.map((invitation: any, index) => (
            <FriendRequestCard
              key={index}
              name={invitation.sender}
              ProfilePhoto={invitation.senderProfilePhoto}
              vari={invitation.created_at}
            />
          ))
  ) : (
    <div className="text-center font-bold text-white h-full flex items-center justify-center bg-black-crd">No invitations </div>
  )}
        </div>
      );
    } else if (activeIndex === 2) {
      return <AddFriends />;
    }
  };
  return (
    <div className="flex size-full w-full flex-col items-start justify-start">
      <div className="friend-bar-bg flex h-fit w-full flex-row items-center justify-between md:px-2 md:pr-4 lg:px-10">
        <div className="flex h-fit flex-row items-center justify-between">
          <Avatar className="max-w-[120px] md:size-auto ">
            //
            <AvatarImage src="" />
            <AvatarFallback className="font-dayson m-2 size-[80px] bg-[rgba(28,28,28,0.5)] text-lg text-white">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <h1 className="font-dayson text-[20px] text-white opacity-[80%] md:text-[18px] lg:text-[25px] xl:text-[30px] 2xl:text-[31px]">
              {player.name}
            </h1>
            <h1 className="font-coustard text-white opacity-[40%] md:text-[17px] lg:text-[22px] xl:text-[27px] 2xl:text-[28px]">
              Level {player.level}
            </h1>
          </div>
        </div>
        <div className="flex h-[60px] w-auto flex-row items-center transition-all duration-300 md:gap-[25px] lg:gap-[45px] xl:gap-[60px] 2xl:gap-[125px]">
          {headers.map((header, index) => (
            <Link href="#" key={index} onClick={() => setActiveIndex(index)}>
              <h1
                className={`${
                  activeIndex === index
                    ? 'border-b-2 border-[#28AFB0] text-[#28AFB0] opacity-[100%] dark:border-[#E43222] dark:text-[#E43222]'
                    : 'text-white opacity-[60%]'
                } font-dayson cursor-pointer text-center transition-all duration-300 md:text-[18px] lg:text-[18px] xl:text-[22px] 2xl:text-[28px]`}
              >
                {header.title}
              </h1>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[90%] w-full">{renderContent()}</div>
    </div>
  );
};

export default UserFriendsNav;
