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
import { useUser } from '@/context/GlobalContext';


const UserFriendsNav = (): JSX.Element => {
  const [Requests, setRequests] = useState([]);
  const [Friends, setFriends] = useState([]);
  const [currentUserUserName, setCurrentUserName] = useState<number | null>(null);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  const {user } = useUser();

  useEffect(() => {
      try {
        setCurrentUserName(user?.display_name);
        console.log(user?.display_name)
      } catch (error) {
        console.error('Failed to fetch current user ID', error);
      }
  }, []);


  const player = {
    name: currentUserUserName,
    level: 22,
  };

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
  
  const [activeIndex, setActiveIndex] = useState(0);

  const headers = [
    { title: 'Your Friends', href: '' },
    { title: 'Invitations', href: '' },
    { title: 'Add New', href: '' },
  ];
  
  const handleRequestAccepted = (username: string) => {
    const acceptedRequest = Requests.find((req: any) => req.sender === username);
    if (acceptedRequest) {
      setRequests((prevRequests: any) => prevRequests.filter((req: any) => req.sender !== username));
      const newFriend = {
        friend_requester: currentUserUserName,
        friend_responder: username,
        profilePhoto: acceptedRequest.senderProfilePhoto,
        level: acceptedRequest.level,
        wins: acceptedRequest.wins,
      };
      setFriends((prevFriends: any) => [...prevFriends, newFriend]);
    }
  };

  const renderContent = () => {
    if (activeIndex === 0) {
      return (
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {Friends.length > 0 ? (
          Friends.map((friend: any, index) => (
            <FriendsComponent
              key={index}
              name={friend.display_name}
              ProfilePhoto={`http://localhost:8080${friend.avatar}`}
              level={friend.level}
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
          Requests.map((invitation: any, index: any) => (
            <FriendRequestCard
              key={index}
              name={invitation.sender}
              ProfilePhoto={invitation.sender.avatar}
              vari={formatDate(invitation.created_at)}
              onRequestAccepted={handleRequestAccepted}
            />
          ))
          ) : (
            <div className="text-center font-bold text-white h-full flex items-center justify-center bg-black-crd">No invitations </div>
          )
        }
        </div>
      );
    }
    // } else if (activeIndex === 2) {
    //   return <AddFriends />;
    // }
  };
  return (
    <div className="flex size-full flex-col items-start justify-start">
      <div className="friend-bar-bg flex h-fit w-full flex-row items-center justify-between sm:px-4 md:pr-4 lg:px-10">
        <div className="flex h-fit flex-row items-center justify-between w-[250px] md:w-[300px]">
          <Avatar className="max-w-[120px] md:size-auto sm:size-[60px]">
            //
            <AvatarImage src="" />
            <AvatarFallback className="font-dayson m-2 md:size-[80px] size-[60px] bg-[rgba(28,28,28,0.5)] text-lg text-white">
              CN
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <h1 className="font-dayson text-[15px] text-white opacity-[80%] md:text-[18px] lg:text-[25px] xl:text-[30px] 2xl:text-[31px]">
              {player.name}
            </h1>
            <h1 className="font-coustard text-white opacity-[40%] md:text-[17px] text-[15px] lg:text-[22px] xl:text-[27px] 2xl:text-[28px]">
              Level {player.level}
            </h1>
          </div>
        </div>
        <div className="flex h-[60px] w-auto flex-row items-center transition-all duration-300 sm:gap-[25px] lg:gap-[45px] xl:gap-[60px] 2xl:gap-[125px]">
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
