import { UsersList } from '@/constants/UsersList';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FriendRequestCard from './FriendRequestCard';
import { IconPlus } from '@tabler/icons-react';

import axios from 'axios';
import Cookies from 'js-cookie';


const AddFriends = () => {
  const [searchQuery, setsearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const FiltredUsers = UsersList.filter((User) =>
    User.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const sendFriendRequest = async (rev_id: BigInteger ,receiverUsername: string) => {
    try {
      const token = Cookies.get('access_token'); // Retrieve the access token from cookies
      const response = await axios.post('http://localhost:8080/relations/friends/invite', {
        id: rev_id,
        receiver: receiverUsername
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use the token from cookies
        }
      });

      if (response.status === 201) {
        setMessage(`Friend request sent to ${receiverUsername}`);
      } else {
        setMessage(`Error sending friend request to ${receiverUsername}`);
      }
    } catch (error) {
      setMessage(`Error sending friend request to ${receiverUsername}: ${error.response ? error.response.data : error.message}`);
    }
  };
  return (
    <div className="bg-black-crd flex size-full flex-col items-center justify-between gap-10 overflow-visible rounded-lg pt-10">
      <Form className="flex h-[70px] w-[65%] items-center justify-center rounded-[30px] bg-cyan-100 bg-opacity-20 shadow-2xl">
        <Form.Control
          placeholder="Enter Friend's username or ID ..."
          className="font-coustard ml-10 size-full rounded-lg bg-transparent text-white text-opacity-[70%] placeholder:text-gray-300 focus:outline-none lg:text-[20px] xl:text-[26px] 2xl:text-[30px] dark:placeholder:text-gray-700"
          value={searchQuery}
          onChange={(e: any) => setsearchQuery(e.target.value)}
        />
      </Form>
      <div className="custom-scrollbar-container h-[calc(100%-200px)] w-full overflow-y-scroll">
        {FiltredUsers.length === 0 ? (
          <div className="text-center font-bold text-white">No results found for {searchQuery}</div>
        ) : (
          FiltredUsers.map((user) => (
            <FriendRequestCard
              key={user.id}
              name={user.name}
              ProfilePhoto={user.ProfilePhoto}
              vari={user.level}
              actions={[
                <IconPlus
                  key={user.id}
                  className="ml-[100px] size-[40px] text-white cursor-pointer"
                  onClick={() => sendFriendRequest(user.id, user.name)}
                />
              ]}
              customStyles={{ backgroundColor: 'transparent' }}
            />
          ))
        )}
      </div>
      {message && <div className="text-center font-bold text-white">{message}</div>}
    </div>
  );
};
export default AddFriends;
