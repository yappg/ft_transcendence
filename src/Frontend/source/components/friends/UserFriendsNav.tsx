import Link from "next/link";
import { JSX, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FriendsComponent from "@/components/friends/FriendsComponent";
import FriendRequestCard from "./FriendRequestCard";
import FriendServices from "@/services/friendServices";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { FaCommentDots } from "react-icons/fa";
import { useUser } from "@/context/GlobalContext";
/* eslint-disable tailwindcss/no-custom-classname */
export interface Friend {
  id: number;
  display_name: string;
  avatar: string;
  level: number;
}

export interface PendingInvitation {
  sender: number;
  receiver: number;
  created_at: string;
  sender_display_name: string;
  sender_avatar: string;
  sender_level: number;
}

const UserFriendsNav = (): JSX.Element => {
  const { user } = useUser();
  const [Friends, setFriends] = useState<Friend[] | null>(null);
  const [Requests, setRequests] = useState<PendingInvitation[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (!user) return;
    const displayInvit = async () => {
      try {
        const response = await FriendServices.getFriendRequests();
        console.log("Friends Requests\n", response.data);
        if (response.message) {
          setRequests(response.data);
        } else if (response.error) {
          console.log(response.error);
        }
      } catch (error) {
        toast({
          title: "Authentication failed",
          description: "Oups Somthing went wrong !",
          variant: "destructive",
          className: "bg-primary-dark border-none text-white",
        });
      }
    };
    displayInvit();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const displayFriends = async () => {
      try {
        const response = await FriendServices.getFriends();
        console.log("Friends:", response.data);
        if (response.message) {
          setFriends(response.data);
        } else if (response.error) {
          console.log(response.error);
        }
      } catch (error) {
        toast({
          title: "Authentication failed",
          description: "Oups Somthing went wrong !",
          variant: "destructive",
          className: "bg-primary-dark border-none text-white",
        });
      }
    };
    displayFriends();
  }, [user]);

  const headers = [
    { title: "Your Friends", href: "" },
    { title: "Invitations", href: "" },
  ];

  const handleRequestDeclined = (username: string) => {
    if (!user) return;
    const declinedRequest = Requests?.find(
      (req: any) => req.sender_display_name === username,
    );
    if (declinedRequest) {
      setRequests((prevRequests: any) =>
        prevRequests.filter((req: any) => req.sender_display_name !== username),
      );
    }
  };

  const handleRequestAccepted = (username: string) => {
    if (!user) return;
    const acceptedRequest = Requests?.find(
      (req: any) => req.sender_display_name === username,
    );
    if (acceptedRequest) {
      setRequests((prevRequests: any) =>
        prevRequests.filter((req: any) => req.sender_display_name !== username),
      );
      const newFriend = {
        display_name: acceptedRequest.sender_display_name,
        avatar: acceptedRequest.sender_avatar,
        level: acceptedRequest.sender_level,
      };
      setFriends((prevFriends: any) => [...prevFriends, newFriend]);
    }
  };

  const renderContent = () => {
    if (activeIndex === 0) {
      return (
        <div className="custom-scrollbar-container h-full overflow-y-scroll">
          {Friends && Friends.length > 0 ? (
            Friends.map((friend: any, index) => (
              <FriendsComponent
                key={index}
                name={friend.display_name}
                ProfilePhoto={`http://localhost:8080${friend.avatar}`}
                level={friend.level}
                messagesLink={
                  <div className="flex items-center justify-center">
                    <Link href="/messages">
                      <FaCommentDots className="mr-4 size-[40px] text-[#1C1C1C] opacity-40 transition-all duration-300 dark:text-[#B8B8B8] xl:size-[50px] 2xl:size-[55px]" />
                    </Link>
                  </div>
                }
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-center font-bold text-white">
              No Friends to display{' '}
            </div>
          )}
        </div>
      );
    } else if (activeIndex === 1) {
      return (
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {Requests && Requests.length > 0 ? (
            Requests.map((invitation: any, index: any) => (
              <FriendRequestCard
                key={index}
                name={invitation.sender_display_name}
                ProfilePhoto={`http://localhost:8080${invitation.sender_avatar}`}
                vari={formatDate(invitation.created_at)}
                onRequestAccepted={handleRequestAccepted}
                onRequestDeclined={handleRequestDeclined}
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center text-center font-bold text-white">
              No invitations{' '}
            </div>
          )}
        </div>
      );
    }
  };
  return (
    <div className="flex size-full flex-col items-start justify-start">
      <div className="friend-bar-bg flex h-fit w-full flex-row items-center justify-between px-6 sm:px-4 md:px-4">
        <div className="flex h-fit w-auto flex-row items-center justify-between gap-4 py-3">
          <Avatar className="size-full max-h-[45px] max-w-[45px] bg-black-crd md:max-h-[60px] md:max-w-[60px] lg:max-h-[85px] lg:max-w-[85px]">
            <AvatarImage src={`http://localhost:8080${user?.avatar}`} />
            <AvatarFallback className="m-2 size-[60px] bg-[rgba(28,28,28,0.5)] font-dayson text-lg text-white md:size-[80px]">
              {user?.display_name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-dayson text-[15px] text-white opacity-[80%] md:text-[18px] lg:text-[25px] xl:text-[30px] 2xl:text-[31px]">
              {user?.display_name && user?.display_name.length < 9
                ? user?.display_name
                : user?.display_name.substring(0, 7) + '...'}
            </h1>
            <h1 className="font-poppins text-[15px] text-white opacity-[40%] md:text-[17px] lg:text-[22px] xl:text-[27px] 2xl:text-[28px]">
              Level {user?.level}
            </h1>
          </div>
        </div>
        <div className="flex h-[60px] w-auto flex-row items-center transition-all duration-300 sm:gap-[25px] lg:gap-[45px] xl:gap-[60px] 2xl:gap-[125px]">
          {headers.map((header, index) => (
            <Link href="#" key={index} onClick={() => setActiveIndex(index)}>
              <h1
                className={`${
                  activeIndex === index
                    ? "border-b-2 border-[#28AFB0] text-[#28AFB0] opacity-[100%] dark:border-[#E43222] dark:text-[#E43222]"
                    : "text-white opacity-[60%]"
                } cursor-pointer text-center font-dayson transition-all duration-300 md:text-[18px] lg:text-[18px] xl:text-[22px] 2xl:text-[28px]`}
              >
                {header.title}
              </h1>
            </Link>
          ))}
        </div>
      </div>
      <div className="size-full bg-black-crd">{renderContent()}</div>
    </div>
  );
};

export default UserFriendsNav;
