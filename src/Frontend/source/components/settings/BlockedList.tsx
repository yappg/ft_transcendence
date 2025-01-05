import { useUser } from '@/context/GlobalContext';
import BlockedComponent from './BlockedComponent';
import FriendServices from '@/services/friendServices';
import { useEffect, useState } from 'react';

export interface Blocked {
  id: number;
  username: string;
  avatar: string;
}
const BlockedList = () => {
  const [blockedList, setBlockedList] = useState<Blocked[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function handleUnblock(name: string) {}
  useEffect(() => {
    const fetchBlockedList = async () => {
      try {
        const blocked = await FriendServices.getBlocked();
        setBlockedList(blocked);
      } catch (err) {
        console.error('Error fetching blocked list:', err);
        setError('Failed to fetch blocked users.');
      } finally {
        setLoading(false);
      }
    return (
        <div className="size-full 2xl:p-28">
            <div className="custom-scrollbar-container h-[calc(100%-200px)] overflow-y-scroll 2xl:rounded-[50px] bg-[#4C4D4E] shadow-2xl">
            <div className="bg-black-crd dark:bg-transparent w-full h-full items-center justify-center ">
            {blockedList.length > 0 ? (
            blockedList.map((user, index) => (
              <BlockedComponent
                key={index}
                name={user?.username}
                ProfilePhoto={process.env.NEXT_PUBLIC_HOST + user?.avatar}
                onUnblock={handleUnblock}
              />
            ))
          ) : (
            <div className="flex items-center justify-center font-dayson text-xl text-white ">No blocked users found.</div>
          )}
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default BlockedList;
