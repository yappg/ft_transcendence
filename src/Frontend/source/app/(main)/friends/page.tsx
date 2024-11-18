'use client';
import UserFriendsNav from '@/components/friends/UserFriendsNav';
import { friends } from '@/constants/friendsList';
import FriendsComponent from '@/components/friends/FriendsComponent';

export default function Page() {
  const player = {
    name: 'Noureddine Akebli',
    level: 22,
  };
  console.log('Player object in parent:', player);
  return (
    <div className="col-span-10 col-start-2 row-span-8 row-start-2 grid grid-cols-[1fr] grid-rows-[1fr] pl-6">
      <div className="h-full w-[95%] overflow-hidden rounded-[50px] shadow-2xl">
        <div className="friend-bar-bg fex-row flex h-[150px] w-full items-center justify-start p-7">
          <UserFriendsNav player={player} />
        </div>
        <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll">
          {friends.map((friend, index) => (
            <FriendsComponent
              key={index}
              name={friend.name}
              ProfilePhoto={friend.profilePhoto}
              level={friend.level}
              wins={friend.wins}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
