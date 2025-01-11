import axios from '@/lib/axios';

const FriendServices = {
  async getPlayers() {
    try {
      const response = await axios.get('/relations/players/');
      return response.data;
    } catch (error) {
    }
  },

  async getFriends() {
    try {
      const response = await axios.get('/relations/friends/');
      return response.data;
    } catch (error) {
    }
  },

  async getFriendRequests() {
    try {
      const response = await axios.get('/relations/friends/pending/');
      return response.data;
    } catch (error) {
    }
  },

  async declineFriendRequest(receiverUsername: string) {
    try {
      const response = await axios.delete('/relations/friends/pending/', {
        data: { decline_pending: receiverUsername },
      });
      return response.data;
    } catch (error) {
    }
  },

  async sendFriendRequest(receiverUsername: string) {
    try {
      const response = await axios.post('/relations/friends/invite/', {
        receiver: receiverUsername,
      });
      return response.data;
    } catch (error) {
    }
  },
  async cancelFriendRequest(receiverUsername: string) {
    try {
      const response = await axios.delete('/relations/friends/invite/', {
        data: { cancel_invite: receiverUsername },
      });
      return response.data;
    } catch (error) {
      // console.log("error", error);
    }
  },

  async acceptFriendRequest(senderUsername: string) {
    try {
      const response = await axios.post('/relations/friends/accept/', {
        sender: senderUsername,
      });
      return response.data;
    } catch (error) {
    }
  },
  async getBlocked() {
    try {
      const response = await axios.get('/relations/friends/block/');
      return response.data;
    } catch (error) {
    }
  },

  async blockFriend(blockedUsername: string) {
    try {
      const response = await axios.patch('/relations/friends/block/', {
        block_user: blockedUsername,
      });
      return response.data;
    } catch (error) {
    }
  },

  async unblockFriend(unblockedUsername: string) {
    try {
      const response = await axios.delete('/relations/friends/block/', {
        data: { unblock_user: unblockedUsername },
      });
      return response.data;
    } catch (error) {
    }
  },
};

export default FriendServices;
