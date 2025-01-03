import FriendRequestCard from './FriendRequestCard';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import FriendServices from '@/services/friendServices';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/context/GlobalContext';
import axios from '@/lib/axios';
import { Input } from '../ui/input';

export interface Result {
  id: number
  display_name: string
  avatar: string
  is_online: boolean
}

const AddFriends = () => {
  const [message, setMessage] = useState('');

  const [searchUser, setsearchUser] = useState('');
  const [FiltredUsers, setFiltredUsers] = useState([]);
  const {players, fetchPlayers}= useUser();


  useEffect(() => {
    fetchPlayers().then((data)=>{
      setFiltredUsers(data)
    });
  }, []);

  const sendFriendRequest = async (receiverUsername: string) => {
    try {
      const response = await FriendServices.sendFriendRequest(receiverUsername);

      if (response.message) {
        console.log(response.message);
        setMessage(`Friend request sent to ${receiverUsername}`)
        fetchPlayers().then((data)=>{
          setFiltredUsers(data)
        });
      } else if (response.error) {
        console.log(response.error);
        setMessage(`Error sending friend request to ${receiverUsername}: ${response.error}`);
      }
    } catch (error: any) {
      toast({
        title: 'Authentication failed',
        description: 'Oups Somthing went wrong !',
        variant: 'destructive',
        className: 'bg-primary-dark border-none text-white',
      });
    }
  };

  const fetchUsers = async (value: string) => {
    try {
      const res = await axios.get(`accounts/search-users/?search=${value}`);
      return res.data;
    }  catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue(searchValue);

    if (searchValue) {
      try {
        const resData = await fetchUsers(searchValue);
        if (resData && resData.results) {
          setFilteredPlayers(resData.results);
        }
      } catch (error) {
        console.error('Error processing fetched users:', error);
      }
    } else {
      setFilteredPlayers([]);
    }
  };
  return (
    <div className="bg-black-crd flex size-full flex-col items-center justify-between gap-10 overflow-visible rounded-lg pt-10">
      <div className="flex h-[70px] w-[65%] items-center justify-center rounded-[30px] bg-cyan-100 bg-opacity-20 shadow-2xl">
      <Input
              value={value}
              onChange={handleChange}
              className={`font-coustard ml-10 size-full rounded-lg bg-transparent text-white text-opacity-[70%] placeholder:text-gray-300 focus:outline-none lg:text-[20px] xl:text-[26px] 2xl:text-[30px] dark:placeholder:text-gray-700`}
              placeholder="Enter Friend's username or ID ..."
            />
            </div>
      <div className="custom-scrollbar-container h-[calc(100%-200px)] w-full overflow-y-scroll">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map((user: any) => (
            <FriendRequestCard
              key={user.id}
              name={user?.display_name}
              ProfilePhoto={process.env.NEXT_PUBLIC_HOST + user?.avatar}
              vari={user.level}
              actions={[
                <IconPlus
                key={user.id}
                className="ml-[100px] size-[40px] text-white cursor-pointer"
                onClick={() => sendFriendRequest(user.display_name)}
                />,
              ]}
              customStyles={{ backgroundColor: 'transparent' }}
              />
            ))
          ) : (
          <div className="text-center font-bold text-white">No results found for {searchUser} </div>
        )
        }
      </div>
      {message && <div className="text-center font-bold text-white">{message}</div>}
    </div>
  );
};
export default AddFriends;
